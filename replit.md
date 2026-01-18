# SEO Analyzer Tool

## Overview

This is an SEO analysis web application that allows users to input a URL and receive a comprehensive SEO health report. The tool fetches webpage HTML, extracts meta tags, Open Graph data, Twitter cards, heading structure, images, and links, then performs various SEO checks to produce an overall score with actionable recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled using Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth UI transitions
- **Form Handling**: React Hook Form with Zod validation

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/` (shadcn/ui primitives)
- Feature components in `client/src/components/` (ScoreCard, GooglePreview, SocialPreview, etc.)
- Custom hooks in `client/src/hooks/` for data fetching and UI logic

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Pattern**: RESTful endpoints defined in `server/routes.ts`
- **HTML Parsing**: Cheerio library for server-side DOM manipulation

Key API endpoints:
- `POST /api/analyze` - Accepts a URL, fetches the page, extracts SEO data, and returns analysis results
- `GET /api/scans` - Returns recent scan history

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's type-safe schema builder
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)
- **Tables**: `scans` table tracks URL analysis history with status

### Shared Code
- `shared/schema.ts` - Database schema and TypeScript types for SEO analysis results
- `shared/routes.ts` - API route definitions with Zod validation schemas for type-safe client-server communication

### Build System
- Development: Vite dev server with HMR, Express backend via tsx
- Production: Custom build script (`script/build.ts`) using esbuild for server bundling and Vite for client

## External Dependencies

### Database
- PostgreSQL database required (configured via DATABASE_URL)
- Uses `connect-pg-simple` for session storage capability
- Drizzle Kit for database migrations (`npm run db:push`)

### Third-Party Libraries
- **Cheerio**: Server-side HTML parsing for extracting SEO elements
- **Zod**: Schema validation shared between client and server
- **drizzle-zod**: Generates Zod schemas from Drizzle table definitions

### UI Component Dependencies
- Full shadcn/ui component set with Radix UI primitives
- Lucide React for icons
- Class Variance Authority for component variants

### Deployment
- Vercel-ready with `vercel.json` configuration for API routing
- Replit integration with development plugins (cartographer, dev-banner, runtime-error-modal)