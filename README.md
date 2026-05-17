# BroadSec — Morocco's AI Bug Bounty Platform

> Built at GDG Agadir Vibe Coding Hackathon · Powered by Gemini AI · Deployed on Google Cloud

Morocco's first AI-native vulnerability disclosure platform — connecting companies with security researchers, with Gemini AI at the core.

---

## Prize Targets

| Prize | Criteria | How We Win |
|-------|----------|-----------|
| 🥇 1st — 1000 DH | Best Use of Gemini API | 6 distinct AI features: Triage, Explainer, Fix Generator, Report Writer, Translator, Scope Analyzer |
| 🥈 2nd — 700 DH  | Best Deployed App on Google Cloud | Firebase Hosting + Cloud Run + Firestore + Gemini via Google AI Studio |
| 🥉 3rd — 500 DH  | IdeaHack Award | CNSS breach story · Saudi Arabia precedent · Morocco-first |

---

## Stack

```
Frontend   Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui
Backend    Python FastAPI → Docker → Cloud Run
Database   Firebase Firestore
Auth       Firebase Authentication
AI         Google Gemini API (gemini-2.0-flash)
Storage    Firebase Storage
Hosting    Firebase Hosting + Cloud Run
```

---

## Project Structure

```
broadsec/
├── frontend/                   # Next.js app
│   ├── app/
│   │   ├── page.tsx            # Landing page (from Emergent, polished)
│   │   ├── scanner/            # Live scanner section
│   │   ├── programs/           # Bug bounty programs list
│   │   ├── submit/             # Report submission (AI-assisted)
│   │   ├── leaderboard/        # Hall of Fame
│   │   └── api/
│   │       ├── scan/           # → Python scanner or inline checks
│   │       ├── triage/         # → Gemini AI triage
│   │       └── translate/      # → Gemini multilingual
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   ├── sections/           # Landing page sections
│   │   └── layout/             # Navbar, Footer
│   ├── lib/
│   │   ├── gemini.ts           # All 6 Gemini AI features
│   │   ├── scanner.ts          # Scanner client helpers
│   │   └── mock-data.ts        # Demo placeholder data
│   └── types/index.ts          # Shared TypeScript types
│
├── backend/                    # Python FastAPI scanner
│   ├── main.py                 # FastAPI app
│   ├── requirements.txt
│   └── Dockerfile              # → Cloud Run
│
└── docs/                       # Architecture, pitch notes
```

---

## Quick Start

### Frontend
```bash
cd frontend
cp .env.example .env.local
# Fill in GEMINI_API_KEY from https://aistudio.google.com/app/apikey
npm install
npm run dev
# → http://localhost:3000
```

### Backend
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

---

## The 6 Gemini AI Features

| # | Feature | Endpoint | Description |
|---|---------|----------|-------------|
| 1 | **AI Triage** | `POST /api/triage` | Classifies reports: validity, CVSS, duplicate check, fix suggestion |
| 2 | **AI Explainer** | `POST /api/scan` (inline) | Same vuln explained for CEO, Developer, and Compliance |
| 3 | **AI Fix Generator** | `lib/gemini.ts` | Generates before/after code diff to fix the vulnerability |
| 4 | **AI Report Writer** | `lib/gemini.ts` | Transforms rough notes into professional report |
| 5 | **AI Translator** | `POST /api/translate` | FR ↔ AR ↔ Darija ↔ EN for all security content |
| 6 | **AI Scope Analyzer** | `lib/gemini.ts` | Auto-discovers scope + suggests reward tiers for a domain |

---

## Deploy to Google Cloud

### Frontend → Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Backend → Cloud Run
```bash
cd backend
gcloud run deploy broadsec-scanner \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

---

## The Story

On April 8, 2025, Morocco suffered its worst data breach — 2 million employees and 500,000 companies had their data leaked from the CNSS. Morocco has 12.6 million web threats per year (top 3 in Africa) and only 13 cybersecurity companies.

Saudi Arabia solved this in 2019 with BugBounty.sa — now protecting 300 companies with 15,000 researchers.

BroadSec is Morocco's version. AI-native. Arabic-first. Built in 9 hours.

---

## Team

Built at GDG Agadir × MLH Vibe Coding Hackathon
