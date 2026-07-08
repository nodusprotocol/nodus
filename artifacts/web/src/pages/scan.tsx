import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useScanTarget, useAnalyzeWithAI } from "@workspace/api-client-react";
import { ScanInputTargetType, ScanResult, AIAnalyzeResult } from "@workspace/api-client-react";
import { ShieldAlert, ShieldCheck, AlertTriangle, Loader2, BrainCircuit, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Scan() {
  const [target, setTarget] = useState("");
  const [targetType, setTargetType] = useState<ScanInputTargetType>("website");
  const { toast } = useToast();

  const scanMutation = useScanTarget();
  const aiMutation = useAnalyzeWithAI();

  const handleScan = () => {
    if (!target) {
      toast({ title: "Enter a target", description: "The target cannot be empty.", variant: "destructive" });
      return;
    }
    scanMutation.mutate(
      { data: { target, targetType } },
      {
        onError: () =>
          toast({
            title: "Scan failed",
            description: "Could not complete the scan. Please try again.",
            variant: "destructive",
          }),
      },
    );
  };

  const handleAIAnalyze = () => {
    if (!target) return;
    aiMutation.mutate(
      { data: { target, targetType } },
      {
        onError: () =>
          toast({
            title: "AI analysis failed",
            description: "Nodus AI could not analyze this target right now.",
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Scan a Target</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Check a website, wallet, smart contract, token, or social account for threats before you interact with it.
          </p>
        </div>

        <Card className="mb-12 border-primary/20 shadow-lg shadow-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={targetType} onValueChange={(v) => setTargetType(v as ScanInputTargetType)}>
                <SelectTrigger className="w-full md:w-[200px]" data-testid="select-target-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="contract">Smart Contract</SelectItem>
                  <SelectItem value="token">Token</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                </SelectContent>
              </Select>
              
              <Input 
                placeholder="Enter a URL, address, or username..." 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="flex-1"
                data-testid="input-target"
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
              />
              
              <Button 
                onClick={handleScan} 
                disabled={scanMutation.isPending}
                className="w-full md:w-auto"
                data-testid="button-scan"
              >
                {scanMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
                Scan Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {scanMutation.data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <ScanResultDisplay result={scanMutation.data} />
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleAIAnalyze}
                disabled={aiMutation.isPending || aiMutation.isSuccess}
                className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
              >
                {aiMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                Deep Analysis with Nodus AI
              </Button>
            </div>

            {aiMutation.data && (
              <AIResultDisplay result={aiMutation.data} />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function ScanResultDisplay({ result }: { result: ScanResult }) {
  const getVerdictDetails = (verdict: string) => {
    switch(verdict) {
      case 'safe': return { icon: ShieldCheck, color: "text-green-600", bg: "bg-green-500/10", border: "border-green-500/20", label: "Safe" };
      case 'caution': return { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Caution" };
      case 'danger': return { icon: ShieldAlert, color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/20", label: "Danger" };
      default: return { icon: ShieldAlert, color: "text-muted-foreground", bg: "bg-muted", border: "border-border", label: "Unknown" };
    }
  };

  const details = getVerdictDetails(result.verdict);
  const Icon = details.icon;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className={`md:col-span-1 border-2 ${details.border} shadow-lg`}>
        <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
          <div className={`p-4 rounded-full ${details.bg} mb-4`}>
            <Icon className={`w-12 h-12 ${details.color}`} />
          </div>
          <h2 className="text-4xl font-bold font-mono mb-2">{result.score}<span className="text-lg text-muted-foreground">/100</span></h2>
          <Badge variant="outline" className={`${details.color} ${details.border} ${details.bg} text-sm px-3 py-1 uppercase tracking-wider font-bold`}>
            {details.label}
          </Badge>
          
          {result.knownThreat && (
            <Badge variant="destructive" className="mt-4 animate-pulse">Known Threat</Badge>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Scan Details</CardTitle>
          <CardDescription>Target: <span className="font-mono text-foreground">{result.target}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
              <span className="text-sm font-medium">Community Reports</span>
              <Badge variant={result.communityReports > 0 ? "destructive" : "secondary"}>
                {result.communityReports} Reports
              </Badge>
            </div>
            
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-3">Data Sources</h4>
            <div className="grid gap-3">
              {result.sources.map((src, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${src.available ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                    <span className="font-medium">{src.source}</span>
                  </div>
                  {src.available ? (
                    <div className="flex items-center gap-4">
                      {src.summary && <span className="text-xs text-muted-foreground">{src.summary}</span>}
                      {src.score !== undefined && <Badge variant="outline" className="font-mono">{src.score}/100</Badge>}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not Available</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AIResultDisplay({ result }: { result: AIAnalyzeResult }) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          Nodus AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Assessment</h4>
          <p className="text-muted-foreground leading-relaxed">{result.analysis}</p>
        </div>
        
        {result.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Recommended Actions</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
