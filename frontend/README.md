# GPB Nexus — Career Certification Platform

India's career roadmap and certification platform for TCS, Infosys, Wipro, HCL, Cognizant, and Accenture roles.

## Stack

- **Next.js 14** (Pages Router)
- **React 18**
- **Tailwind CSS 3**
- **html2canvas + jsPDF** for certificate downloads
- **localStorage** for all data (no backend, no database, no Firebase)

## Quick Start

```bash
# 1. Unzip and enter the folder
cd gpb-nexus

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
http://localhost:3000
```

## Features

- 6 curated career roadmaps (TCS, Infosys, Wipro, HCL, Cognizant, Accenture)
- Structured docs-style roadmap viewer with sidebar navigation
- 30-question timed certification quiz per roadmap (real questions)
- Certificate generation — download as PDF or JPG
- Dashboard with progress tracking and certificate history
- Auth (register/login) — all stored in browser localStorage
- Light/Dark theme with CSS variable system
- Fully responsive

## Deploy to Vercel

```bash
npm run build        # verify build passes
npx vercel           # deploy
```

## Folder Structure

```
pages/           Next.js pages (file-based routing)
components/      Shared React components
lib/             auth.js · storage.js · theme.js
utils/           seedData.js (roadmaps + quiz questions)
styles/          globals.css (design token system)
public/          Static assets
```

## Notes

- No `.env` variables required for local development
- All quiz attempts and certificates persist in localStorage
- Data is device-specific (no cloud sync by design)
