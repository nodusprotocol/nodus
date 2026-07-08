import { Layout } from "@/components/layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListThreats } from "@workspace/api-client-react";
import { useMemo, useState } from "react";
import { AlertTriangle, ShieldCheck, ShieldAlert, Loader2, Calendar, ServerCrash, SlidersHorizontal, Radar } from "lucide-react";
import { format } from "date-fns";

const SEVERITY = {
  high: { ring: "bg-red-500", tile: "bg-red-500/10 text-red-600", pill: "bg-red-500/10 text-red-600 border-red-500/20", label: "High" },
  medium: { ring: "bg-yellow-500", tile: "bg-yellow-500/10 text-yellow-600", pill: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", label: "Medium" },
  low: { ring: "bg-blue-500", tile: "bg-blue-500/10 text-blue-600", pill: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "Low" },
} as const;

function sev(s: string) {
  return SEVERITY[s as keyof typeof SEVERITY] ?? SEVERITY.low;
}

export default function Threats() {
  const [threatType, setThreatType] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  const dateFrom = useMemo(() => {
    if (dateRange === "all") return undefined;
    const days = Number(dateRange);
    if (Number.isNaN(days)) return undefined;
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  }, [dateRange]);

  const { data: threats, isLoading, isError, refetch } = useListThreats({
    threatType: threatType !== "all" ? threatType : undefined,
    severity: severity !== "all" ? severity : undefined,
    dateFrom,
    limit: 50,
  });

  const stats = useMemo(() => {
    const list = threats ?? [];
    return {
      total: list.length,
      high: list.filter((t) => t.severity === "high").length,
      verified: list.filter((t) => t.verified).length,
    };
  }, [threats]);

  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-grid bg-grid-fade -z-10 h-72" />
        <div className="container mx-auto px-4 py-14 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.15em] mb-3">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" /> Live Intelligence
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Public Threat Feed</h1>
              <p className="text-muted-foreground text-lg">Threats verified by the Guardian network in real time.</p>
            </div>

            {/* Summary */}
            <div className="flex gap-3">
              <StatPill label="Showing" value={stats.total} icon={<Radar className="w-4 h-4 text-primary" />} />
              <StatPill label="High risk" value={stats.high} icon={<ShieldAlert className="w-4 h-4 text-red-600" />} />
              <StatPill label="Verified" value={stats.verified} icon={<ShieldCheck className="w-4 h-4 text-primary" />} />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-2 md:items-center rounded-2xl border border-border bg-card p-2.5 mb-8">
            <div className="flex items-center gap-2 px-2 text-sm font-semibold text-muted-foreground shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <Select value={threatType} onValueChange={setThreatType}>
                <SelectTrigger className="w-full sm:flex-1 rounded-xl"><SelectValue placeholder="Threat Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="drainer">Drainer</SelectItem>
                  <SelectItem value="scam">Scam</SelectItem>
                  <SelectItem value="rugpull">Rugpull</SelectItem>
                  <SelectItem value="fake_token">Fake Token</SelectItem>
                  <SelectItem value="fake_social">Fake Account</SelectItem>
                  <SelectItem value="malicious_contract">Malicious Contract</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="w-full sm:w-[150px] rounded-xl" data-testid="filter-severity"><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-[170px] rounded-xl" data-testid="filter-date"><SelectValue placeholder="Time Range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1">Last 24 Hours</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="grid gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-destructive/40 bg-destructive/[0.03]" data-testid="threats-error">
              <ServerCrash className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-1">Failed to load threats</h3>
              <p className="text-muted-foreground mb-5">Something went wrong reaching the server. Please try again.</p>
              <button
                onClick={() => refetch()}
                data-testid="button-retry-threats"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
              >
                <Loader2 className="w-4 h-4" /> Try Again
              </button>
            </div>
          ) : threats && threats.length > 0 ? (
            <div className="grid gap-4">
              {threats.map((threat) => {
                const s = sev(threat.severity);
                return (
                  <div key={threat.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <span className={`absolute left-0 top-0 h-full w-1 ${s.ring}`} />
                    <div className="p-5 md:p-6 flex flex-col md:flex-row gap-5 md:items-center">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${s.tile}`}>
                        {threat.severity === "high" ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                      </div>

                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-mono font-bold truncate max-w-full" title={threat.target}>{threat.target}</h3>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.pill}`}>{s.label}</span>
                          {threat.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground flex-wrap">
                          <span className="capitalize font-semibold text-foreground/80">{threat.threatType.replace("_", " ")}</span>
                          <span className="text-border">•</span>
                          <span className="capitalize">{threat.targetType}</span>
                          <span className="text-border">•</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(threat.createdAt), "dd MMM yyyy, HH:mm")}</span>
                        </div>
                        {threat.description && <p className="text-sm text-muted-foreground/80 leading-relaxed">{threat.description}</p>}
                      </div>

                      <div className="flex md:flex-col items-center md:items-end gap-1 shrink-0 border-t md:border-t-0 md:border-l border-border/60 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-center">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Threat Score</span>
                        <span className="text-3xl font-black font-mono text-red-600 leading-none">{threat.score}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-dashed border-border">
              <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold mb-1">No threats found</h3>
              <p className="text-muted-foreground">Adjust your filters to see more threats.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function StatPill({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-2.5">
      {icon}
      <div className="leading-none">
        <p className="text-lg font-black tracking-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-0.5">{label}</p>
      </div>
    </div>
  );
}
