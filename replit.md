# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a luxury beauty salon website with Firebase backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Luxury Beauty Salon (`artifacts/beauty-salon`)
- **Type**: React + Vite web app
- **Preview Path**: `/` (root)
- **Port**: 19229
- **Theme**: Ivory + Champagne Gold luxury theme
- **Fonts**: Playfair Display, Poppins, Cinzel, Montserrat
- **Firebase Project**: `beauty-salon11`

#### Pages:
- `/` — Home Page (hero, about, why choose us, stats, featured services, testimonials, CTA)
- `/services` — Services page (responsive grid, category filter, search, service detail modal)
- `/gallery` — Gallery (masonry layout, lightbox, category filter)
- `/experience` — Client Experience (before/after slider comparisons, testimonials carousel)
- `/lookbook` — Lookbook (style inspirations, occasion filter, look detail modal)
- `/adminbeauty` — Admin Panel (password: `12345678`), includes SEO control tab
- `*` — Luxury branded 404 page with quick links

#### Key Features:
- Fully responsive for mobile, tablet, and desktop
- Service detail modal with booking CTA
- Before & After side-by-side drag slider (no extra packages)
- Virtual Lookbook with curated looks, products, and filtering by category/occasion
- SEO: Google meta tags, Open Graph, Twitter Card, schema.org LocalBusiness structured data
- `public/sitemap.xml` for all public routes
- `src/hooks/usePageSEO.ts` — per-page dynamic title/description/og tags
- Admin panel SEO tab: per-page title, description, global keywords, OG image, business info


#### Features:
- Loading screen with logo reveal animation
- Framer Motion animations throughout
- Glassmorphism cards
- Gold shimmer buttons
- Parallax hero section
- Animated counters
- Testimonial slider
- Floating WhatsApp button
- Back-to-top button
- Sticky navbar with scroll effect
- Fully responsive design

#### Firebase Collections:
- `services` — Beauty services
- `gallery` — Gallery images
- `siteContent/siteContent` — Home page content, settings

#### Admin Panel Features:
- Dashboard overview
- Home Page Control (edit hero, about, stats, CTA, testimonials)
- Manage Services (add/edit/delete with image upload)
- Manage Gallery (upload/manage images)
- Settings (website name, contact, WhatsApp, Instagram, footer)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
