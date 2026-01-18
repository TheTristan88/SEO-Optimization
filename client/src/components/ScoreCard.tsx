import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Activity } from "lucide-react";
import { type AnalyzeResponse } from "@shared/routes";

interface ScoreCardProps {
  data: AnalyzeResponse;
}

export function ScoreCard({ data }: ScoreCardProps) {
  // Calculate a simple score based on passing checks
  const checks = Object.values(data.checks);
  const passed = checks.filter(c => c.status === 'pass').length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  let statusColor = "text-red-500";
  let statusBg = "bg-red-500/10";
  let statusBorder = "border-red-200";
  let Icon = XCircle;
  let verdict = "Needs Improvement";

  if (score >= 90) {
    statusColor = "text-emerald-500";
    statusBg = "bg-emerald-500/10";
    statusBorder = "border-emerald-200";
    Icon = CheckCircle2;
    verdict = "Excellent";
  } else if (score >= 70) {
    statusColor = "text-amber-500";
    statusBg = "bg-amber-500/10";
    statusBorder = "border-amber-200";
    Icon = AlertTriangle;
    verdict = "Good";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">SEO Health Score</h3>
          <p className="text-sm text-muted-foreground">Overall optimization level</p>
        </div>
        <div className={`p-2 rounded-full ${statusBg}`}>
          <Icon className={`w-6 h-6 ${statusColor}`} />
        </div>
      </div>

      <div className="flex items-end gap-3 mb-4">
        <span className={`text-5xl font-extrabold ${statusColor}`}>
          {score}
        </span>
        <span className="text-xl font-medium text-muted-foreground mb-1.5">/ 100</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{verdict}</span>
          <span className="text-muted-foreground">{passed} of {total} checks passed</span>
        </div>
        <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${statusColor.replace('text-', 'bg-')}`} 
          />
        </div>
      </div>

      {data.performance.loadTime && (
        <div className="mt-6 pt-6 border-t border-border/50 flex items-center gap-3">
          <Activity className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-muted-foreground">
            Est. Load Time: <span className="font-semibold text-foreground">{data.performance.loadTime}ms</span>
          </span>
        </div>
      )}
    </motion.div>
  );
}
