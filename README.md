# Empire.lol

**Own the internet. One territory at a time.**

Empire.lol is a territory-ownership game/advertising experiment. The V1 prototype contains the public map experience, curated territories, mock ownership, live activity shell and rankings.

## Stack

- React + Vite
- Lucide icons
- Netlify-ready static build

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Product roadmap

1. Supabase/Postgres persistence
2. Stripe Checkout + verified webhooks
3. Real ownership/conquest history
4. Authentication and owner profiles
5. Realtime activity feed
6. X share cards
7. Server-side transaction locking
8. Netlify production deployment

## Deployment

Netlify should use:

- Build command: `npm run build`
- Publish directory: `dist`
- Node: `20`
