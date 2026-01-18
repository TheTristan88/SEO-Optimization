import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  status: text("status").notNull(), // 'success', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScanSchema = createInsertSchema(scans).omit({ 
  id: true, 
  createdAt: true 
});

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;

// === API TYPES ===

export interface SeoAnalysisResult {
  url: string;
  meta: {
    title: string | null;
    description: string | null;
    canonical: string | null;
    keywords: string | null;
    robots: string | null;
    author: string | null;
    viewport: string | null;
    charSet: string | null;
  };
  og: {
    title: string | null;
    description: string | null;
    image: string | null;
    url: string | null;
    siteName: string | null;
    type: string | null;
  };
  twitter: {
    card: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
    creator: string | null;
  };
  content: {
    h1: string[];
    h2: string[];
    h3: string[];
    wordCount: number;
    imageCount: number;
    imagesWithoutAlt: number;
  };
  performance: {
    loadTime?: number; // Estimated or simulated
  };
  checks: {
    titleLength: { status: 'pass' | 'fail' | 'warning', message: string };
    descriptionLength: { status: 'pass' | 'fail' | 'warning', message: string };
    hasH1: { status: 'pass' | 'fail', message: string };
    hasOgImage: { status: 'pass' | 'fail', message: string };
    hasCanonical: { status: 'pass' | 'fail', message: string };
    https: { status: 'pass' | 'fail', message: string };
    missingAltText: { status: 'pass' | 'fail' | 'warning', message: string };
  };
}

export type SeoAnalysisRequest = {
  url: string;
};
