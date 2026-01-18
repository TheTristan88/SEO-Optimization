import { motion } from "framer-motion";
import { type AnalyzeResponse } from "@shared/routes";
import { Globe } from "lucide-react";

interface GooglePreviewProps {
  data: AnalyzeResponse;
}

export function GooglePreview({ data }: GooglePreviewProps) {
  const title = data.meta.title || "No Title Tag Found";
  const desc = data.meta.description || "No meta description found. Google will use page content snippets instead.";
  const urlDisplay = data.url.replace(/^https?:\/\//, '').split('/')[0];
  const fullUrl = data.url;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl p-5 shadow-sm border border-border h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-base font-bold text-foreground">Google Search Preview</h3>
      </div>

      {/* Google Result Container */}
      <div className="bg-white p-3 rounded-lg border border-border/50 shadow-sm max-w-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <Globe className="w-3 h-3 text-gray-500" />
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-xs text-[#202124] font-normal truncate">{data.og.siteName || "Website"}</span>
            <span className="text-[10px] text-[#5f6368] truncate">{fullUrl}</span>
          </div>
        </div>
        
        <h3 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-normal mt-0.5 leading-snug truncate">
          {title.length > 60 ? title.substring(0, 60) + '...' : title}
        </h3>
        
        <p className="text-xs text-[#4d5156] mt-0.5 leading-relaxed line-clamp-2">
          {data.meta.description && data.meta.description.length > 160 
            ? data.meta.description.substring(0, 160) + '...' 
            : desc}
        </p>
      </div>

      <div className="mt-5 space-y-1.5">
        <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
          <span>Title</span>
          <span className={title.length > 60 ? "text-red-500" : "text-emerald-500"}>
            {title.length} / 60
          </span>
        </div>
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${title.length > 60 ? 'bg-red-500' : 'bg-emerald-500'}`} 
            style={{ width: `${Math.min((title.length / 60) * 100, 100)}%` }} 
          />
        </div>

        <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-2">
          <span>Description</span>
          <span className={desc.length > 160 ? "text-red-500" : "text-emerald-500"}>
            {desc.length} / 160
          </span>
        </div>
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${desc.length > 160 ? 'bg-red-500' : 'bg-emerald-500'}`} 
            style={{ width: `${Math.min((desc.length / 160) * 100, 100)}%` }} 
          />
        </div>
      </div>
    </motion.div>
  );
}
