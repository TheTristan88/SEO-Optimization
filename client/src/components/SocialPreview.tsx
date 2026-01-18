import { motion } from "framer-motion";
import { type AnalyzeResponse } from "@shared/routes";
import { Share2, ImageOff } from "lucide-react";

interface SocialPreviewProps {
  data: AnalyzeResponse;
}

export function SocialPreview({ data }: SocialPreviewProps) {
  const title = data.og.title || data.meta.title || "No Title";
  const desc = data.og.description || data.meta.description || "No description available.";
  const image = data.og.image || data.twitter.image;
  const domain = new URL(data.url).hostname.toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border h-fit"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Social Media Preview</h3>
      </div>

      {/* Social Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-xl mx-auto">
        <div className="aspect-[1.91/1] w-full bg-gray-100 relative group overflow-hidden">
          {image ? (
            <img 
              src={image} 
              alt="Social Preview" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full flex flex-col items-center justify-center text-gray-400 ${image ? 'hidden' : ''}`}>
            <ImageOff className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">No OG Image Found</span>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1 tracking-wide uppercase">{domain}</p>
          <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
          <span className="block text-xs text-muted-foreground font-medium mb-1">og:type</span>
          <span className="font-mono text-sm">{data.og.type || "website"}</span>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
          <span className="block text-xs text-muted-foreground font-medium mb-1">twitter:card</span>
          <span className="font-mono text-sm">{data.twitter.card || "summary_large_image"}</span>
        </div>
      </div>
    </motion.div>
  );
}
