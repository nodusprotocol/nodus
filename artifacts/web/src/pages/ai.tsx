import { Layout } from "@/components/layout";
import { useState, useRef, useEffect } from "react";
import { type AIAnalyzeInputTargetType } from "@workspace/api-client-react";
import { Send, Loader2, Globe, Wallet, FileCode, Coins, AtSign, Sparkles, ShieldCheck, Radar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import logoMark from "@assets/gagaga_(77)_1783422691110.png";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api/ai/chat`;

const TARGET_TYPES: { value: AIAnalyzeInputTargetType; label: string; icon: React.ReactNode }[] = [
  { value: "website", label: "Website", icon: <Globe className="w-3.5 h-3.5" /> },
  { value: "wallet", label: "Wallet", icon: <Wallet className="w-3.5 h-3.5" /> },
  { value: "contract", label: "Smart Contract", icon: <FileCode className="w-3.5 h-3.5" /> },
  { value: "token", label: "Token", icon: <Coins className="w-3.5 h-3.5" /> },
  { value: "social", label: "Social Media", icon: <AtSign className="w-3.5 h-3.5" /> },
];

const SUGGESTIONS = [
  "Is this contract safe to interact with?",
  "Check this wallet for suspicious activity",
  "Does this token show rug-pull signs?",
  "Is this website a phishing scam?",
];

export default function AIChat() {
  const [target, setTarget] = useState("");
  const [targetType, setTargetType] = useState<AIAnalyzeInputTargetType>("website");
  const [question, setQuestion] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const appendToAssistant = (id: string, chunk: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: m.content + chunk } : m)));
  };

  const handleSend = async () => {
    if (!target) {
      toast({ title: "Target required", description: "Enter a target you want to ask about.", variant: "destructive" });
      return;
    }
    if (isStreaming) return;

    const userMsg = question
      ? `Target: ${target} (${targetType}). Question: ${question}`
      : `Please analyze this target: ${target} (${targetType})`;
    const assistantId = `a-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: userMsg },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setIsStreaming(true);
    setQuestion("");

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, targetType, question }),
      });

      if (!res.ok || !res.body) {
        throw new Error("stream failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let gotError = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const raw of events) {
          const eventLine = raw.split("\n").find((l) => l.startsWith("event: "));
          const dataLine = raw.split("\n").find((l) => l.startsWith("data: "));
          if (!eventLine || !dataLine) continue;
          const event = eventLine.slice(7).trim();
          const data = dataLine.slice(6);

          if (event === "token") {
            appendToAssistant(assistantId, JSON.parse(data) as string);
          } else if (event === "error") {
            gotError = true;
            const { message } = JSON.parse(data) as { message: string };
            appendToAssistant(assistantId, message);
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId && m.content.trim() === "" && !gotError
            ? { ...m, content: "Sorry, no response was generated. Please try again." }
            : m,
        ),
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, something went wrong during analysis. Please try again later." }
            : m,
        ),
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-grid bg-grid-fade -z-10 h-64" />
        <div className="container mx-auto px-4 py-8 max-w-3xl h-[calc(100dvh-7rem)] flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3.5 pb-6 mb-6 border-b border-border/60">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground to-[hsl(226,55%,16%)] shadow-lg shrink-0">
              <img src={logoMark} alt="Nodus AI" className="w-1/2 brightness-0 invert" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight leading-none">Nodus AI</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Online
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Your Web3 security assistant</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">
                <Radar className="w-3 h-3 text-primary" /> Multi-source
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">
                <ShieldCheck className="w-3 h-3 text-primary" /> No-mock
              </span>
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-6">
            {isEmpty ? (
              <div className="flex h-full flex-col items-center justify-center text-center pb-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-foreground to-[hsl(226,55%,16%)] shadow-xl mb-6">
                  <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-2xl -z-10" />
                  <img src={logoMark} alt="" className="w-1/2 brightness-0 invert" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter mb-2">How can I protect you today?</h2>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-8">
                  Enter a target — a URL, wallet, token, or contract — and I'll analyze it against
                  live threat intelligence and community signals. Ask anything.
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5 w-full max-w-lg">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuestion(s)}
                      className="group flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 text-left text-[13px] font-medium text-foreground/80 hover:border-primary/40 hover:bg-accent transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="leading-snug">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 text-right">You</p>
                      <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex gap-3">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-foreground to-[hsl(226,55%,16%)] shrink-0 shadow">
                      <img src={logoMark} alt="" className="w-1/2 brightness-0 invert" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Nodus AI</p>
                      <div className="rounded-2xl rounded-tl-sm border border-border/70 bg-card px-4 py-3 text-[13px] leading-[1.7] text-foreground/85 whitespace-pre-wrap">
                        {msg.content ||
                          (isStreaming ? (
                            <span className="inline-flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> Analyzing threats…
                            </span>
                          ) : null)}
                      </div>
                    </div>
                  </div>
                ),
              )
            )}
            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <div className="mt-6 rounded-2xl border border-border bg-card shadow-lg shadow-primary/5 p-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={targetType} onValueChange={(v) => setTargetType(v as AIAnalyzeInputTargetType)}>
                <SelectTrigger aria-label="Target type" className="w-full sm:w-[150px] h-10 text-[13px] rounded-xl">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-[13px]">
                      <span className="flex items-center gap-2">
                        {t.icon} {t.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                aria-label="Target to analyze"
                placeholder="Target — URL, wallet, token, or contract address"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="flex-1 h-10 rounded-xl border border-border bg-background px-3.5 text-[13px] font-medium outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-colors"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <input
                aria-label="Ask a question about the target"
                placeholder="Ask a question (optional)…"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 h-10 rounded-xl border border-border bg-background px-3.5 text-[13px] outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isStreaming || !target}
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">{isStreaming ? "Analyzing" : "Send"}</span>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2.5 px-1 leading-relaxed">
              Nodus AI analyzes live threat data. Always verify before signing any transaction.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
