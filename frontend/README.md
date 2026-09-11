# Ledger — Personal Financial Health Assistant (Frontend)

React + Vite + Tailwind + Recharts, built against `FRONTEND.md` and `PRD.md`.

## Run it

```
npm install
npm run dev
```

Runs fully on mock data out of the box — no backend needed to explore every screen.

## Switching to the real backend

Copy `.env.example` to `.env` and set:

```
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8000
```

`src/api/client.js` is the single place that branches on mock vs real — no
component needs to change when the FastAPI backend comes online. Wire it up
against your actual `API_CONTRACT.md` endpoint shapes if they differ from the
mock JSON in `src/mock/`.

## Design system — "the ledger"

The product's whole differentiator per the PRD is **explainable recommendations** —
every number the assistant shows must trace back to a real calculation, never an
invented figure. The UI is built around that idea rather than a generic dashboard
template:

- **Palette** — ledger paper (`#F5F3ED`), ink navy (`#1C2B3A`), passbook teal
  (`#0E5C55`) as the primary accent, rupee-gold (`#C08A2E`) for savings/positive
  figures, and rust (`#A8432F`) reserved for alerts and the top-priority liability.
- **Type** — Fraunces (display/headings) paired with IBM Plex Sans (body) and IBM
  Plex Mono for every number in the app — amounts, dates, rates. Tabular figures
  everywhere a person needs to compare two numbers at a glance.
- **Layout** — a passbook "spine" sidebar with numbered index tabs (01 Upload → 05
  Simulate), mirroring the order someone actually works through the product.
  Content sits on white "index cards" over a faint ruled-paper background.
- **Signature interaction** — the **ledger tear-off**: every `RecommendationCard`
  (recommendations, alerts, liability rankings) has a "Why?" control that unfolds
  a dashed, receipt-style panel listing the exact inputs behind the headline. This
  one component is reused across Dashboard, Goals, Liabilities, and Alerts, per
  `FRONTEND.md`.

## Structure

Matches `FRONTEND.md` exactly: `api/client.js`, `mock/*.json`, `pages/`,
`components/`. `RecommendationCard` was built first and is the base every other
card composes (`AlertBanner`, `LiabilityRankCard`).
