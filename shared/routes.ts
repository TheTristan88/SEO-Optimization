import { z } from 'zod';
import { insertScanSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// Response schema for the analysis endpoint
// We define the shape manually to match SeoAnalysisResult interface
// In a real app we might want to use Zod to define the whole nested structure, 
// but for simplicity/flexibility in this checker we'll use z.any() or a basic object for the complex result
const analysisResultSchema = z.object({
  url: z.string(),
  meta: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    canonical: z.string().nullable(),
    keywords: z.string().nullable(),
    robots: z.string().nullable(),
    author: z.string().nullable(),
    viewport: z.string().nullable(),
    charSet: z.string().nullable(),
  }),
  og: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    url: z.string().nullable(),
    siteName: z.string().nullable(),
    type: z.string().nullable(),
  }),
  twitter: z.object({
    card: z.string().nullable(),
    title: z.string().nullable(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    creator: z.string().nullable(),
  }),
  content: z.object({
    h1: z.array(z.string()),
    h2: z.array(z.string()),
    h3: z.array(z.string()),
    wordCount: z.number(),
    imageCount: z.number(),
    imagesWithoutAlt: z.number(),
  }),
  performance: z.object({
    loadTime: z.number().optional(),
  }),
  checks: z.record(z.object({
    status: z.enum(['pass', 'fail', 'warning']),
    message: z.string(),
  })),
});

export const api = {
  analyze: {
    method: 'POST' as const,
    path: '/api/analyze',
    input: z.object({
      url: z.string().url({ message: "Please enter a valid URL (including http:// or https://)" }),
    }),
    responses: {
      200: analysisResultSchema,
      400: errorSchemas.validation,
      500: errorSchemas.internal,
    },
  },
  scans: {
    list: {
      method: 'GET' as const,
      path: '/api/scans',
      responses: {
        200: z.array(z.custom<typeof insertScanSchema>()),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AnalyzeInput = z.infer<typeof api.analyze.input>;
export type AnalyzeResponse = z.infer<typeof api.analyze.responses[200]>;
