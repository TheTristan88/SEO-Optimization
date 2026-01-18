import { motion } from "framer-motion";
import { type AnalyzeResponse } from "@shared/routes";
import { CheckCircle2, XCircle, AlertTriangle, ListChecks } from "lucide-react";

interface IssuesListProps {
  data: AnalyzeResponse;
}

export function IssuesList({ data }: IssuesListProps) {
  const checks = Object.entries(data.checks);
  
  // Sort: Fail first, then Warning, then Pass
  checks.sort(([, a], [, b]) => {
    const score = { fail: 0, warning: 1, pass: 2 };
    return score[a.status] - score[b.status];
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl shadow-sm border border-border h-full overflow-hidden flex flex-col"
    >
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <ListChecks className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground">SEO Checklist</h3>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {checks.map(([key, check], index) => {
          let Icon = CheckCircle2;
          let colorClass = "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
          let borderClass = "border-emerald-100 dark:border-emerald-900/30";

          if (check.status === 'fail') {
            Icon = XCircle;
            colorClass = "text-red-500 bg-red-50 dark:bg-red-900/20";
            borderClass = "border-red-100 dark:border-red-900/30";
          } else if (check.status === 'warning') {
            Icon = AlertTriangle;
            colorClass = "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
            borderClass = "border-amber-100 dark:border-amber-900/30";
          }

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`flex items-start gap-3 p-3 mb-1 rounded-lg border ${borderClass} ${colorClass.split(' ')[1]} transition-all hover:translate-x-1`}
            >
              <div className={`mt-0.5 ${colorClass.split(' ')[0]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-[13px] text-foreground capitalize leading-none">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-[12px] text-muted-foreground mt-1 leading-tight">{check.message}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
