import { Router, type IRouter } from "express";
import { and, count, eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db, threatsTable, reportsTable } from "@workspace/db";
import { AnalyzeWithAIBody } from "@workspace/api-zod";
import { scanUrl } from "../lib/virustotal";
import { scanToken, scanAddress, scanSite } from "../lib/goplus";
import { logger } from "../lib/logger";

const router: IRouter = Router();

type Intel = {
  source: string;
  available: boolean;
  score: number;
  summary: string;
};

type AiTargetType = "website" | "wallet" | "contract" | "token" | "social";

type IntelContext = {
  intel: Intel[];
  score: number;
  verdict: "safe" | "caution" | "danger";
  communityReports: number;
  knownThreat: boolean;
  intelText: string;
};

function verdictFor(score: number): "safe" | "caution" | "danger" {
  if (score >= 75) return "safe";
  if (score >= 45) return "caution";
  return "danger";
}

// Gather real threat intelligence (VirusTotal + GoPlus) plus community signal
// from the database and derive a combined security score. Shared by the
// request/response `/ai/analyze` endpoint and the streaming `/ai/chat` endpoint.
async function gatherIntel(
  target: string,
  targetType: AiTargetType,
): Promise<IntelContext> {
  const intel: Intel[] = [];

  if (targetType === "website") {
    const [vt, gp] = await Promise.all([scanUrl(target), scanSite(target)]);
    intel.push({ source: "VirusTotal", ...vt });
    intel.push({ source: "GoPlus", ...gp });
  } else if (targetType === "token" || targetType === "contract") {
    intel.push({ source: "GoPlus", ...(await scanToken(target)) });
  } else if (targetType === "wallet") {
    intel.push({ source: "GoPlus", ...(await scanAddress(target)) });
  }

  const [knownThreatRows, reportRows] = await Promise.all([
    db
      .select({ c: count() })
      .from(threatsTable)
      .where(
        and(eq(threatsTable.target, target), eq(threatsTable.verified, true)),
      ),
    db
      .select({ c: count() })
      .from(reportsTable)
      .where(eq(reportsTable.target, target)),
  ]);
  const communityReports = Number(reportRows[0]?.c ?? 0);
  const knownThreat = Number(knownThreatRows[0]?.c ?? 0) > 0;

  const availableScores = intel.filter((i) => i.available).map((i) => i.score);
  let score =
    availableScores.length > 0
      ? Math.round(
          availableScores.reduce((a, b) => a + b, 0) / availableScores.length,
        )
      : 70;
  if (knownThreat) score = Math.min(score, 10);
  if (communityReports > 0)
    score = Math.max(0, score - Math.min(40, communityReports * 10));

  const intelText = intel
    .map(
      (i) =>
        `- ${i.source}: ${i.available ? `score ${i.score}/100 — ${i.summary}` : "no data available"}`,
    )
    .join("\n");

  return {
    intel,
    score,
    verdict: verdictFor(score),
    communityReports,
    knownThreat,
    intelText,
  };
}

function buildUserPrompt(
  target: string,
  targetType: AiTargetType,
  ctx: IntelContext,
  question?: string,
): string {
  return `Target: ${target}
Type: ${targetType}
Combined security score: ${ctx.score}/100 (verdict: ${ctx.verdict})
Threat intelligence:
${ctx.intelText || "- No third-party data available"}
Community reports for this target: ${ctx.communityReports}
Already listed as a verified threat: ${ctx.knownThreat ? "Yes" : "No"}
${question ? `User question: ${question}` : ""}`;
}

const JSON_SYSTEM_PROMPT = `You are Nodus AI, a Web3 security assistant for the Solana ecosystem. You analyze scan results from real threat-intelligence sources (VirusTotal, GoPlus) plus community reports, and explain the risk to everyday crypto users in clear, plain English. Be direct and practical. Never invent data you were not given. Respond ONLY with a valid JSON object of the form {"analysis": string, "recommendations": string[]}. "analysis" is 2-4 sentences. "recommendations" is 2-4 short actionable tips.`;

const CHAT_SYSTEM_PROMPT = `You are Nodus AI, a Web3 security assistant for the Solana ecosystem. You analyze scan results from real threat-intelligence sources (VirusTotal, GoPlus) plus community reports, and explain the risk to everyday crypto users in clear, plain English. Be direct, practical, and conversational. Never invent data you were not given. Start with a one-line verdict, then explain why in 2-4 sentences, then give a short bulleted list of concrete recommendations.`;

router.post("/ai/analyze", async (req, res) => {
  const parsed = AnalyzeWithAIBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request." });
  }
  const { target, targetType, question } = parsed.data;

  try {
    const ctx = await gatherIntel(target, targetType as AiTargetType);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: JSON_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildUserPrompt(target, targetType as AiTargetType, ctx, question),
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let analysis = "";
    let recommendations: string[] = [];
    try {
      const json = JSON.parse(raw) as {
        analysis?: string;
        recommendations?: string[];
      };
      analysis = json.analysis ?? "";
      recommendations = Array.isArray(json.recommendations)
        ? json.recommendations
        : [];
    } catch {
      analysis = raw;
    }

    return res.json({
      target,
      verdict: ctx.verdict,
      score: ctx.score,
      analysis,
      recommendations,
    });
  } catch (err) {
    logger.error({ err }, "AI analysis failed");
    return res.status(400).json({ error: "AI analysis failed." });
  }
});

// Streaming chat endpoint. Gathers the same real intel, then streams the GPT-4o
// response token-by-token as Server-Sent Events so the web chat renders the
// answer progressively. Not part of the generated OpenAPI client because SSE
// streaming is consumed directly via fetch on the frontend.
router.post("/ai/chat", async (req, res) => {
  const parsed = AnalyzeWithAIBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request." });
  }
  const { target, targetType, question } = parsed.data;

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const ctx = await gatherIntel(target, targetType as AiTargetType);
    send("meta", { target, verdict: ctx.verdict, score: ctx.score });

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildUserPrompt(target, targetType as AiTargetType, ctx, question),
        },
      ],
      max_completion_tokens: 1024,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) send("token", delta);
    }

    send("done", { ok: true });
    return res.end();
  } catch (err) {
    logger.error({ err }, "AI chat streaming failed");
    send("error", { message: "AI chat failed. Please try again." });
    return res.end();
  }
});

export default router;
