## Scope

A platform for drafting common legal agreements. Users fill out a form with party details and agreement terms, and the app renders a completed Mutual NDA (Common Paper MNDA v1.0) ready to sign. Legal templates for MNDA, CSA, DPA, and other CommonPaper agreements are in `templates/`, catalogued in `catalog.json`.

Frontend: Next.js 16 + TypeScript + Tailwind CSS + App Router in `frontend/`. NDA form types in `frontend/types/nda.ts`. `NdaForm` component in `frontend/components/NdaForm.tsx` — collects all cover-page fields and calls `onSubmit(NdaFormData)`. Home page is still placeholder scaffold.

## Commands

```bash
# Frontend (run from frontend/)
npm run dev       # start dev server
npm run build     # production build
npm run test      # run Vitest tests
npm run lint      # run ESLint
```

## Project Structure

```
frontend/          # Next.js 16 app
  app/             # App Router pages and layouts
  types/           # TypeScript interfaces (nda.ts)
  public/          # static assets
templates/         # CommonPaper legal document templates (.md)
catalog.json       # index of available templates
```

## Key Conventions

- Package manager: `npm` (frontend), `uv` (Python if added)
- Tests: Vitest + @testing-library/react; use `expectTypeOf` for type-only tests
- No `src/` directory in frontend (use `--no-src-dir` scaffold)
- `MndaTerm` and `ConfidentialityTerm` are aliases of `NdaTerm` (`types/nda.ts`)
- Do not use emojis in code or print statements
- Keep modules and functions short and focused
