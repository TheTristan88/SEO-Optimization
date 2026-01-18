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
      className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full flex flex-col justify-between hover-elevate transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">SEO Health</h3>
          <p className="text-sm text-muted-foreground">Overall performance grade</p>
        </div>
        <div className={`p-2.5 rounded-xl ${statusBg}`}>
          <Icon className={`w-6 h-6 ${statusColor}`} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4 gap-2">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-secondary"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={364.42}
              initial={{ strokeDashoffset: 364.42 }}
              animate={{ strokeDashoffset: 364.42 - (364.42 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={statusColor}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${statusColor}`}>
              {score}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Points</span>
          </div>
        </div>
        
        <div className={`mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full ${statusBg} border border-current/10`}>
          <Icon className={`w-4 h-4 ${statusColor}`} />
          <span className={`text-sm font-bold ${statusColor}`}>{verdict}</span>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
          <span className="text-foreground font-semibold">{passed} / {total} Checks</span>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
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
