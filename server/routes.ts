import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api, type AnalyzeResponse } from "../shared/routes.js";
import { z } from "zod";
import * as cheerio from 'cheerio';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.analyze.path, async (req, res) => {
    try {
      const input = api.analyze.input.parse(req.body);
      const url = input.url;

      // Log the scan attempt
      await storage.logScan({ url, status: 'pending' });

      // Fetch the HTML
      // We use a custom User-Agent to avoid being blocked by some sites
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ReplitSeoBot/1.0; +http://replit.com)'
        }
      });

      if (!response.ok) {
        await storage.logScan({ url, status: 'failed' });
        return res.status(400).json({ message: `Failed to fetch URL: ${response.statusText}` });
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract Metadata
      const title = $('title').text() || $('meta[property="og:title"]').attr('content') || null;
      const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || null;
      const canonical = $('link[rel="canonical"]').attr('href') || null;
      const keywords = $('meta[name="keywords"]').attr('content') || null;
      const robots = $('meta[name="robots"]').attr('content') || null;
      const author = $('meta[name="author"]').attr('content') || null;
      const viewport = $('meta[name="viewport"]').attr('content') || null;
      const charSet = $('meta[charset]').attr('charset') || null;

      // Extract Open Graph
      const ogTitle = $('meta[property="og:title"]').attr('content') || null;
      const ogDescription = $('meta[property="og:description"]').attr('content') || null;
      const ogImage = $('meta[property="og:image"]').attr('content') || null;
      const ogUrl = $('meta[property="og:url"]').attr('content') || null;
      const ogSiteName = $('meta[property="og:site_name"]').attr('content') || null;
      const ogType = $('meta[property="og:type"]').attr('content') || null;

      // Extract Twitter Card
      const twitterCard = $('meta[name="twitter:card"]').attr('content') || null;
      const twitterTitle = $('meta[name="twitter:title"]').attr('content') || null;
      const twitterDescription = $('meta[name="twitter:description"]').attr('content') || null;
      const twitterImage = $('meta[name="twitter:image"]').attr('content') || null;
      const twitterCreator = $('meta[name="twitter:creator"]').attr('content') || null;

      // Extract Content Stats
      const h1s = $('h1').map((_, el) => $(el).text().trim()).get();
      const h2s = $('h2').map((_, el) => $(el).text().trim()).get();
      const h3s = $('h3').map((_, el) => $(el).text().trim()).get();
      
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      const wordCount = bodyText.split(' ').length;
      
      const images = $('img');
      const imageCount = images.length;
      const imagesWithoutAlt = images.filter((_, el) => !$(el).attr('alt')).length;

      // Perform Checks
      const checks: AnalyzeResponse['checks'] = {
        titleLength: {
          status: 'pass',
          message: 'Title length is optimal (10-60 characters).'
        },
        descriptionLength: {
          status: 'pass',
          message: 'Description length is optimal (50-160 characters).'
        },
        hasH1: {
          status: h1s.length > 0 ? 'pass' : 'fail',
          message: h1s.length > 0 ? 'H1 tag found.' : 'Missing H1 tag.'
        },
        hasOgImage: {
          status: ogImage ? 'pass' : 'fail',
          message: ogImage ? 'Open Graph image found.' : 'Missing Open Graph image.'
        },
        hasCanonical: {
          status: canonical ? 'pass' : 'warning',
          message: canonical ? 'Canonical tag found.' : 'Missing canonical tag.'
        },
        https: {
          status: url.startsWith('https') ? 'pass' : 'fail',
          message: url.startsWith('https') ? 'Site uses HTTPS.' : 'Site is not using HTTPS.'
        },
        missingAltText: {
          status: imagesWithoutAlt === 0 ? 'pass' : (imagesWithoutAlt < 3 ? 'warning' : 'fail'),
          message: imagesWithoutAlt === 0 ? 'All images have alt text.' : `${imagesWithoutAlt} images are missing alt text.`
        }
      };

      // Refine Check Logic
      if (!title || title.length < 10) checks.titleLength = { status: 'warning', message: 'Title is too short (< 10 chars).' };
      if (title && title.length > 60) checks.titleLength = { status: 'warning', message: 'Title is too long (> 60 chars).' };
      
      if (!description || description.length < 50) checks.descriptionLength = { status: 'warning', message: 'Description is too short (< 50 chars).' };
      if (description && description.length > 160) checks.descriptionLength = { status: 'warning', message: 'Description is too long (> 160 chars).' };


      const result: AnalyzeResponse = {
        url,
        meta: { title, description, canonical, keywords, robots, author, viewport, charSet },
        og: { title: ogTitle, description: ogDescription, image: ogImage, url: ogUrl, siteName: ogSiteName, type: ogType },
        twitter: { card: twitterCard, title: twitterTitle, description: twitterDescription, image: twitterImage, creator: twitterCreator },
        content: { h1: h1s, h2: h2s, h3: h3s, wordCount, imageCount, imagesWithoutAlt },
        performance: { loadTime: 0 }, // Placeholder
        checks
      };

      await storage.logScan({ url, status: 'success' });
      res.json(result);

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error('Analysis error:', err);
      res.status(500).json({ message: 'Failed to analyze website. Please check the URL and try again.' });
    }
  });

  app.get(api.scans.list.path, async (req, res) => {
    const scans = await storage.getRecentScans();
    res.json(scans);
  });

  return httpServer;
}
