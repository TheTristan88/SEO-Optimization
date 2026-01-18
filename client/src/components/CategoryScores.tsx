import { motion } from "framer-motion";
import { Globe, Share2, FileText, Zap, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { type SeoAnalysisResult } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CategoryScoresProps {
  data: SeoAnalysisResult;
}

export function CategoryScores({ data }: CategoryScoresProps) {
  const categories = [
    {
      name: "Meta Tags",
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      checks: [data.checks.titleLength, data.checks.descriptionLength, data.checks.hasCanonical, data.checks.https],
    },
    {
      name: "Social Media",
      icon: Share2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      checks: [data.checks.hasOgImage],
    },
    {
      name: "Content",
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      checks: [data.checks.hasH1, data.checks.missingAltText],
    },
    {
      name: "Performance",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      checks: [], // Add performance specific checks if available in schema
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((cat, idx) => {
        const passed = cat.checks.filter(c => c.status === 'pass').length;
        const total = cat.checks.length;
        const score = total > 0 ? Math.round((passed / total) * 100) : 100;
        
        let statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        if (score < 50) statusIcon = <XCircle className="w-4 h-4 text-red-500" />;
        else if (score < 90) statusIcon = <AlertTriangle className="w-4 h-4 text-amber-500" />;

        return (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-4 hover-elevate transition-all border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${cat.bg}`}>
                  <cat.icon className={`w-5 h-5 ${cat.color}`} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{cat.name}</h4>
                  <div className="flex items-center gap-1.5">
                    {statusIcon}
                    <span className="text-xs font-medium text-muted-foreground">
                      {total > 0 ? `${passed}/${total} passed` : "Optimized"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Score</span>
                  <span>{score}%</span>
                </div>
                <Progress value={score} className="h-1.5" />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
