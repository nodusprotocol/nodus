import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useGetGuardian, useGetGuardianLeaderboard, getGetGuardianQueryKey } from "@workspace/api-client-react";
import { Wallet, Shield, Trophy, Activity, CheckCircle2, History, TrendingUp, Target, BadgeCheck } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import logoMark from "@assets/gagaga_(77)_1783422691110.png";

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const walletStr = publicKey?.toBase58() || "";

  const { data: profile, isLoading: isLoadingProfile, isError: isProfileError, error: profileError } = useGetGuardian(walletStr, {
    query: {
      enabled: !!walletStr && connected,
      queryKey: getGetGuardianQueryKey(walletStr),
    },
  });

  const isProfileNotFound = isProfileError && (profileError as { status?: number } | null)?.status === 404;

  const { data: leaderboard, isLoading: isLoadingLeaderboard, isError: isLeaderboardError } = useGetGuardianLeaderboard({ limit: 5 });

  const reputationChartData = (() => {
    const history = profile?.reputationHistory;
    if (!history?.length) return [] as { label: string; reputation: number }[];
    const chronological = [...history].reverse();
    const totalPoints = chronological.reduce((sum, e) => sum + e.points, 0);
    let running = (profile?.guardian.reputation ?? 0) - totalPoints;
    const points = chronological.map((e) => {
      running += e.points;
      return {
        label: format(new Date(e.createdAt), "dd MMM"),
        reputation: running,
      };
    });
    return [{ label: "Start", reputation: Math.max(0, (profile?.guardian.reputation ?? 0) - totalPoints) }, ...points];
  })();

  const approvalRate =
    profile && profile.guardian.reportsSubmitted > 0
      ? Math.round((profile.guardian.reportsApproved / profile.guardian.reportsSubmitted) * 100)
      : 0;

  if (!connected) {
    return (
      <Layout>
        <div className="relative">
          <div className="absolute inset-0 bg-grid bg-grid-fade -z-10 h-96" />
          <div className="container mx-auto px-4 py-28 max-w-3xl text-center">
            <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-foreground to-[hsl(226,55%,16%)] shadow-xl mb-8">
              <div className="absolute -inset-3 rounded-3xl bg-primary/20 blur-2xl -z-10" />
              <img src={logoMark} alt="" className="w-1/2 brightness-0 invert" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Guardian Dashboard</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Connect your Solana wallet to view your Guardian profile, track your reputation, and see the Web3 security leaderboard.
            </p>
            <Button size="lg" onClick={() => setVisible(true)} className="gap-2 rounded-full px-8 h-12 text-base">
              <Wallet className="w-5 h-5" /> Connect Wallet
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-grid bg-grid-fade -z-10 h-64" />
        <div className="container mx-auto px-4 py-14 max-w-6xl">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-block text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">Command Center</span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Guardian Dashboard</h1>
            </div>
            <Link href="/report">
              <Button className="gap-2 rounded-full">
                <Activity className="w-4 h-4" /> Report Threat
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile */}
              <div className="rounded-3xl border border-border bg-card overflow-hidden">
                {isLoadingProfile ? (
                  <div className="h-52 animate-pulse bg-muted/50" />
                ) : profile ? (
                  <>
                    <div className="relative h-28 bg-gradient-to-br from-foreground to-[hsl(226,55%,16%)]">
                      <div className="absolute inset-0 bg-grid opacity-[0.08]" />
                      <div className="absolute right-5 top-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/15 border border-background/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-background capitalize">
                          <BadgeCheck className="w-3.5 h-3.5" /> {profile.guardian.tier} Tier
                        </span>
                      </div>
                    </div>
                    <div className="relative px-6 md:px-8 pb-8">
                      <div className="absolute -top-10 left-6 md:left-8 p-1.5 bg-card rounded-2xl">
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-foreground to-[hsl(226,55%,16%)] shadow-xl">
                          <img src={logoMark} alt="" className="w-1/2 brightness-0 invert" />
                        </div>
                      </div>

                      <div className="pt-14 mb-6">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight font-mono">
                          {profile.guardian.walletAddress.slice(0, 8)}…{profile.guardian.walletAddress.slice(-8)}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Joined {format(new Date(profile.guardian.joinedAt), "dd MMM yyyy")}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Metric icon={<TrendingUp className="w-4 h-4 text-primary" />} label="Reputation" value={profile.guardian.reputation} accent="text-primary" />
                        <Metric icon={<Target className="w-4 h-4 text-muted-foreground" />} label="Reports" value={profile.guardian.reportsSubmitted} />
                        <Metric icon={<CheckCircle2 className="w-4 h-4 text-green-600" />} label="Verified" value={profile.guardian.reportsApproved} accent="text-green-600" />
                        <Metric icon={<Shield className="w-4 h-4 text-muted-foreground" />} label="Approval" value={`${approvalRate}%`} />
                      </div>
                    </div>
                  </>
                ) : isProfileNotFound ? (
                  <div className="p-10 text-center text-muted-foreground" data-testid="profile-not-found">Profile not found. Start contributing to become a Guardian.</div>
                ) : isProfileError ? (
                  <div className="p-10 text-center text-destructive" data-testid="profile-error">Failed to load your Guardian profile. Please reload the page.</div>
                ) : (
                  <div className="p-10 text-center text-muted-foreground">Profile not found.</div>
                )}
              </div>

              {/* Reputation chart */}
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Reputation Score</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5">How your reputation has grown over time.</p>
                {isLoadingProfile ? (
                  <div className="h-64 animate-pulse bg-muted/50 rounded-2xl" />
                ) : reputationChartData.length < 2 ? (
                  <p className="text-center text-muted-foreground py-16">Not enough data yet to show the reputation chart.</p>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reputationChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <defs>
                          <linearGradient id="repGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "0.8rem" }}
                          labelStyle={{ color: "hsl(var(--foreground))" }}
                          formatter={(value: number) => [value, "Reputation"]}
                        />
                        <Area type="monotone" dataKey="reputation" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#repGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* History */}
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-1">
                  <History className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-bold text-lg">Reputation History</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5">The reputation points you've earned recently.</p>
                {!profile?.reputationHistory.length ? (
                  <p className="text-center text-muted-foreground py-8">No reputation history yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {profile.reputationHistory.map((evt) => (
                      <div key={evt.id} className="flex justify-between items-center gap-4 p-3.5 rounded-2xl bg-accent/50 border border-border">
                        <div className="min-w-0">
                          <p className="font-semibold capitalize text-sm">{evt.eventType.replace("_", " ")}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(evt.createdAt), "dd MMM yyyy, HH:mm")}</p>
                          {evt.reason && <p className="text-xs mt-1 text-muted-foreground/80 truncate">{evt.reason}</p>}
                        </div>
                        <span className={`shrink-0 font-mono font-bold text-sm rounded-full px-3 py-1 border ${evt.points > 0 ? "text-green-600 border-green-500/30 bg-green-500/5" : "text-red-600 border-red-500/30 bg-red-500/5"}`}>
                          {evt.points > 0 ? "+" : ""}{evt.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card overflow-hidden">
                <div className="border-b border-border bg-primary/5 p-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Leaderboard</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">Top Nodus Guardians</p>
                </div>
                <div className="p-4">
                  {isLoadingLeaderboard ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-muted animate-pulse rounded-xl" />)}
                    </div>
                  ) : isLeaderboardError ? (
                    <p className="text-sm text-center text-destructive py-4" data-testid="leaderboard-error">Failed to load the leaderboard.</p>
                  ) : !leaderboard?.length ? (
                    <p className="text-sm text-center text-muted-foreground py-4">No Guardians yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {leaderboard.map((g, idx) => (
                        <div key={g.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-accent/60 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                idx === 0 ? "bg-yellow-400/20 text-yellow-600" : idx === 1 ? "bg-gray-300/30 text-gray-500" : idx === 2 ? "bg-amber-600/20 text-amber-700" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-mono text-sm font-semibold truncate">{g.walletAddress.slice(0, 4)}…{g.walletAddress.slice(-4)}</p>
                              <p className="text-xs text-muted-foreground capitalize">{g.tier}</p>
                            </div>
                          </div>
                          <span className="shrink-0 font-mono text-sm font-bold text-primary">{g.reputation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-bold text-lg">Your Recent Reports</h3>
                </div>
                {!profile?.recentReports.length ? (
                  <p className="text-sm text-center text-muted-foreground py-4">No reports yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {profile.recentReports.map((rep) => (
                      <div key={rep.id} className="p-3.5 rounded-2xl border border-border">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="font-mono font-semibold text-sm truncate max-w-[150px]">{rep.target}</span>
                          <span
                            className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full capitalize ${
                              rep.status === "verified" ? "bg-green-500/10 text-green-600" : rep.status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-yellow-500/10 text-yellow-600"
                            }`}
                          >
                            {rep.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">{rep.threatType.replace("_", " ")}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Metric({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-1.5 mb-2">{icon}<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span></div>
      <p className={`text-2xl font-black tracking-tighter font-mono ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
