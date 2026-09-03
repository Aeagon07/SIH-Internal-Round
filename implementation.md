# MetroScan AI — Implementation Plan
### SIH 2026 · PS #26034 · Team Takshak

---

## Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + CSS custom properties
- **Animation:** Framer Motion
- **Charts:** Recharts
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`, max_tokens 1500)
- **PDF:** jsPDF + jspdf-autotable
- **Icons:** Lucide React
- **Notifications:** react-hot-toast
- **Fonts:** Space Grotesk, DM Sans, JetBrains Mono (Google Fonts)

---

## 6 Pages / Routes

| Route | Page |
|---|---|
| `/` | Landing |
| `/scan` | Scanner (3 tabs) |
| `/processing` | Processing Animation |
| `/results` | Compliance Results |
| `/dashboard` | Enforcement Dashboard |
| `/manufacturer` | Manufacturer Portal |

---

## Stage 1 — Scaffold & Config (~30 min)
- `npx create-vite@latest metroscan-ai -- --template react-ts`
- Install: `react-router-dom framer-motion recharts lucide-react react-hot-toast jspdf jspdf-autotable`
- Install dev: `tailwindcss @tailwindcss/vite`
- `vite.config.ts` — proxy `/api/claude` → `https://api.anthropic.com` (CORS fix)
- `tailwind.config.ts` — extend colors with all design tokens
- `App.tsx` — React Router with 6 empty route stubs

---

## Stage 2 — Design System (~45 min)
- `index.css` — all 13 CSS color tokens:
  - `--bg-base: #070B14`, `--bg-surface: #0E1525`, `--bg-elevated: #162035`
  - `--saffron: #F97316`, `--india-green: #16A34A`, `--crimson: #DC2626`, `--amber: #D97706`
  - All dim variants + glow shadows + border
- Google Fonts `@import` for Space Grotesk, DM Sans, JetBrains Mono
- Typography scale: `display` 3.5rem, `h1` 2.25rem, `h2` 1.5rem, `body` 0.9375rem
- Utility classes: `.glass-card`, `.btn-primary`, `.btn-outline`, `.shimmer`, `.input-focus-glow`
- Tailwind `extend.colors` maps all CSS vars to Tailwind class names

---

## Stage 3 — Shared Components (~3 hrs)

### Layout
| Component | Notes |
|---|---|
| `Navbar.tsx` | Logo left, nav links, Officer Login right. Saffron bottom border. Blur on scroll >50px. |
| `Sidebar.tsx` | 240px fixed, 6 nav items with Lucide icons. Only on `/dashboard` + `/manufacturer`. |

### UI Components
| Component | Key Behaviour |
|---|---|
| `ScanBeam.tsx` | 2px saffron gradient line, `translateY 0%→100%` in 2.5s, runs once on upload trigger |
| `AnimatedCounter.tsx` | `requestAnimationFrame`, 0→target in 1500ms easeOut, JetBrains Mono output |
| `PipelineStep.tsx` | `state: pending/active/done`. Active = saffron + radial pulse keyframe |
| `ComplianceScore.tsx` | SVG double-circle gauge. Color: green >80, amber 50–80, crimson <50 |
| `StatusBadge.tsx` | Pill: green=COMPLIANT, crimson=VIOLATION, amber=WARNING |
| `UploadZone.tsx` | Dashed border, drag-drop + click-to-browse, thumbnail + ScanBeam on upload |
| `FieldAccordion.tsx` | Clickable header, `grid-template-rows` height animation, colored left border |
| `DemoModal.tsx` | Fixed bottom-right "DEMO MODE" chip → modal with 3 demo product buttons |

### Services & Data
| File | Notes |
|---|---|
| `claudeApi.ts` | Exact fetch from spec. Fallback to `MOCK_SCAN_RESULT` on any error |
| `mockData.ts` | Full `MOCK_SCAN_RESULT` + 3 product variants + dashboard stats |
| `compliance.ts` | TS interfaces: `ScanResult`, `ComplianceField`, `BarcodeCalibration` |
| `useScanContext.ts` | React Context: `scanInput`, `scanResult`, setters — wraps whole app |
| `PDFReportGenerator.ts` | jsPDF 3-page report: header+verdict → fields table → recommendation |

---

## Stage 4a — Landing Page (`/`) ~1.5 hrs
- Two-column hero: text left, live-scan mockup right
- Eyebrow pill + headline with "Compliance" in saffron
- `AnimatedCounter` metrics strip: 10,000+ / 94.5% / <60s / 80+
- CTAs: **Start Compliance Check** → `/scan`, **View Dashboard** → `/dashboard`
- Right card: food image + `ScanBeam` infinite loop + 5 sequential status rows lighting up
- Bottom 3 track cards (hover = saffron border, no float/lift)
- DEMO MODE chip bottom-right corner

---

## Stage 4b — Scanner Page (`/scan`) ~1 hr
- **Tab 1 Physical:** `UploadZone` (60%) + settings panel (40%) — rule set dropdown, toggles, checkboxes, CTA
- **Tab 2 E-Commerce:** URL input + example chips + Rule 6(10) amber callout + stats row
- **Tab 3 Manufacturer:** upload zone + form (GSTIN, product name, net qty, FSSAI)
- On CTA click: store in ScanContext → navigate to `/processing`

---

## Stage 4c — Processing Page (`/processing`) ~1.5 hrs ← ANIMATION HEAVY
- On mount: start timer + call `claudeApi.ts` + begin step progression
- 6 `PipelineStep` components advance at: 6s → 12s → 25s → 35s → 42s → API response
- Progress bar width = `(currentStep / 6) * 100%`
- Rotating fact chip every 8s (`setInterval`)
- On completion: store result in context → navigate to `/results`

---

## Stage 4d — Results Page (`/results`) ~2 hrs ← MOST UI WORK
- Two-column: left = annotated image panel, right = compliance report
- Full-width verdict badge (green/crimson/amber)
- `ComplianceScore` SVG gauge + Scan ID (TKS-26-XXXX) + timestamp + rule set
- Violation summary chips (Critical / Major / Minor) with pulsing dot if count > 0
- 12 `FieldAccordion` cards: found/required grid, font measurement bar, officer notes
- Semantic flags (amber chips) + Officer Recommendation box (saffron left border)
- Certificate eligibility row + PDF download → `PDFReportGenerator`
- Footer: "Powered by PaddleOCR-VL 1.5 · Mistral-7B · YOLOv11"

---

## Stage 4e — Dashboard Page (`/dashboard`) ~2 hrs ← CHARTS HEAVY
- `Sidebar` + 4 `AnimatedCounter` stat cards (1,247 / 342 / 72.6% / 18)
- Recharts **horizontal bar chart**: violations by field (saffron gradient bars)
- Recharts **donut chart**: Physical 58% / E-Commerce 28% / Manufacturer 14%
- Recharts **line chart**: 30-day volume — two lines: scans (saffron) + violations (crimson)
- Recent scans table: 10 rows, filter pills (All/Critical/Major/Minor/Compliant), sortable columns

---

## Stage 4f — Manufacturer Portal (`/manufacturer`) ~1.5 hrs
- Left: 3-step form (company details → upload → generate)
- Right: GOI-styled certificate preview card
- Inline condensed 3-step pipeline (no separate page navigation)
- **Compliant** → certificate with cert no. (MSLM-2026-XXXXXXXX) + Download PDF
- **Non-compliant** → violation list, no certificate

---

## Stage 5 — Claude API + Demo Flow (~1 hr)
- Wire up exact prompt from spec, parse JSON response
- Error fallback always returns `MOCK_SCAN_RESULT`
- **Demo Mode (OFFLINE-FIRST — must work with zero internet):**
  - Parle-G Biscuits → minor violations mock
  - Maggi Noodles → major violations mock
  - Generic Handwash → critical violations / non-compliant mock
- API key in `.env` as `VITE_ANTHROPIC_API_KEY` — add to `.gitignore`

---

## Stage 6 — Polish & Responsive (~1.5 hrs)
- [ ] Navbar blur on scroll >50px
- [ ] All inputs: focus ring `rgba(249,115,22,0.3)`
- [ ] No empty states anywhere — all screens populated on load
- [ ] Scan ID: `TKS-26-` + 4 random digits, monospace
- [ ] `react-hot-toast` dark theme (`--bg-elevated`, `--border`)
- [ ] Tab title: `MetroScan AI — Legal Metrology Compliance System`
- [ ] Gov footer: `Made for Government of India · Ministry of Consumer Affairs`
- [ ] DEMO MODE tested offline for all 3 products
- [ ] Mobile: stacked layouts, hamburger sidebar, 2×2 stat grid, charts stacked

---

## Time Estimate

| Stage | Task | Time |
|---|---|---|
| 1 | Scaffold + Config | 30 min |
| 2 | Design System | 45 min |
| 3 | Shared Components | 3 hrs |
| 4a | Landing | 1.5 hrs |
| 4b | Scanner | 1 hr |
| 4c | Processing | 1.5 hrs |
| 4d | Results | 2 hrs |
| 4e | Dashboard | 2 hrs |
| 4f | Manufacturer | 1.5 hrs |
| 5 | API + Demo Flow | 1 hr |
| 6 | Polish + Responsive | 1.5 hrs |
| **TOTAL** | | **~16 hrs** |

---

## 3 Things to Decide Before Starting
1. **API Key** — Do you have an Anthropic key, or run fully in demo/mock mode?
2. **Directory** — Scaffold inside `SIH 26034/metroscan-ai/` or directly in `SIH 26034/`?
3. **QR Code** — Real `qrcode` npm library on certificate, or a styled placeholder?

---
*Team Takshak · SIH 2026 · PS #26034*
