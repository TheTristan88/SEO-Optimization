import { motion } from "framer-motion";
import { type AnalyzeResponse } from "@shared/routes";
import { Code, Hash, ImageIcon, FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TechDetailsProps {
  data: AnalyzeResponse;
}

export function TechDetails({ data }: TechDetailsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden relative z-0"
    >
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Code className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Technical Details</h3>
        </div>
      </div>

      <div className="p-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="headers">
            <AccordionTrigger className="hover:no-underline hover:bg-secondary/50 px-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-primary" />
                <span>Heading Structure ({data.content.h1.length + data.content.h2.length + data.content.h3.length} tags)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">H1 Tags</h5>
                  {data.content.h1.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {data.content.h1.map((h, i) => (
                        <li key={i} className="text-sm text-foreground font-medium">{h}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-red-500 italic">No H1 tags found</span>
                  )}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">H2 Tags ({data.content.h2.length})</h5>
                  <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
                    {data.content.h2.slice(0, 10).map((h, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{h}</li>
                    ))}
                    {data.content.h2.length > 10 && (
                      <li className="text-xs text-muted-foreground italic">...and {data.content.h2.length - 10} more</li>
                    )}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="images">
            <AccordionTrigger className="hover:no-underline hover:bg-secondary/50 px-4 rounded-lg">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span>Image Analysis ({data.content.imageCount} images)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/30 rounded-xl border border-border text-center">
                  <span className="block text-2xl font-bold text-foreground">{data.content.imageCount}</span>
                  <span className="text-xs text-muted-foreground uppercase font-medium">Total Images</span>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl border border-border text-center">
                  <span className={`block text-2xl font-bold ${data.content.imagesWithoutAlt > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {data.content.imagesWithoutAlt}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase font-medium">Missing Alt Text</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meta">
            <AccordionTrigger className="hover:no-underline hover:bg-secondary/50 px-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Raw Meta Tags</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(data.meta).map(([k, v]) => (
                  <div key={k} className="flex flex-col border-b border-border/50 pb-2">
                    <span className="text-xs font-mono text-muted-foreground mb-1">{k}</span>
                    <span className="text-foreground font-medium break-all">{v || <em className="text-muted-foreground opacity-50">null</em>}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );
}
