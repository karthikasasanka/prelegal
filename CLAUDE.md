# Prelegal Project

A web application for generating legal agreement documents from CommonPaper templates.

## Project Status

### Completed

**PL-1 — Legal document template dataset**
- Downloaded all 12 CommonPaper markdown templates into `templates/`
- Created `catalog.json` at project root with name, description, and filename for each template
- Added `templates/LICENSE.txt` with CC BY 4.0 attribution notice

**PL-2 — Mutual NDA creator (Next.js prototype)**
- Next.js 15 app in `frontend/` with form + live preview + PDF save
- Form collects all NDA fields: purpose, effective date, MNDA term, term of confidentiality, governing law, jurisdiction, modifications, party 1 and party 2 details
- Preview renders the full NDA: filled cover page + standard terms with form values substituted inline
- Standard terms loaded from `frontend/public/Mutual-NDA.md` (static asset, works in all environments)
- "Save as PDF" triggers browser print (form panel hidden via `@media print`)

**Code review fixes (PR #5)**
- Fixed `blank(modifications) || "None."` — fallback was unreachable dead code
- Fixed inconsistent MNDA term text between cover page and standard terms for "continues until terminated" case
- Replaced blocking `readFileSync` API route with static file served from `frontend/public/`
- Added `r.ok` check in template fetch to surface HTTP errors correctly

## Structure

```
prelegal/
  templates/          # CommonPaper markdown templates (CC BY 4.0)
  catalog.json        # Index of all templates with name, description, filename
  frontend/           # Next.js app
    app/
      page.tsx        # Main page: form + NDA preview
      layout.tsx      # Root layout
      globals.css     # Tailwind + print styles
    public/
      Mutual-NDA.md   # Standard terms served as static asset
```

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000
