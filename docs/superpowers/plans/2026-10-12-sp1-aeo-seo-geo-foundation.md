# Sub-plan 1: AEO/SEO/GEO Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development`
> (recommended) or `superpowers:executing-plans` to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.
>
> Parent roadmap: `2026-10-12-portfolio-master.md` (Global Constraints and Review Focus
> apply to every task here).

**Goal:** Make `designjoom.com`'s content exist as real HTML for crawlers that do not
execute JavaScript, declare a machine-readable identity for "A V Ajay Kiran" via
JSON-LD, and add answer-shaped content that answer engines can extract and quote.

**Architecture:** A ~40-line Vite plugin (`transformIndexHtml`) renders the site's
answer content into `<div id="root">` at build time, from the same `src/seo.ts` module
the React components read — so the crawler HTML and the hydrated UI cannot drift.
`main.tsx` clears the container immediately before `createRoot`, so React's first commit
replaces the prerendered markup deterministically with no `hydrateRoot` mismatch risk
(the failure mode that previously blanked the ROSH site). Head metadata, social cards
and four JSON-LD blocks are injected by the same plugin, after Figma Make's own head
rewrite, which is why injection belongs in the plugin and not in `index.html`.

**Tech Stack:** Vite 8 plugin API (`transformIndexHtml`), React 19, node:fs assertions.
**Zero new dependencies.** No `react-dom/server`, no Puppeteer, no test framework.

**Spec:** this plan + `../docs/superpowers/specs/2026-10-12-profile-design.md` (existing
design spec for copy rules and verified metrics).

**Rejected alternatives** (do not reopen without new information): Puppeteer-based
prerender adds Chromium to every Vercel build for one route; a full SSR build means
guarding `window`, canvas, IntersectionObserver, Recharts, Lenis and framer-motion —
~10× the work to gain ~5% more crawler fidelity; `hydrateRoot` risks exactly the
hydration-mismatch class of bug that already broke another site in this workspace.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/seo.ts` (create) | The single source of truth for identity, metadata, and answer content: canonical descriptor, title/description, quick facts, FAQ, results ledger, and the About/positioning copy currently hardcoded in `App.tsx`. Pure TS, no JSX, no CSS imports — safe to import from the Vite config. |
| `vite-plugin-prerender.ts` (create) | Vite plugin: emits the bot-readable body HTML + head metadata + JSON-LD. Imports `src/data.ts` and `src/seo.ts` only. |
| `vite.config.ts` (modify) | Register the plugin. |
| `src/main.tsx` (modify) | Clear `#root` before `createRoot`. |
| `src/App.tsx` (modify) | Read copy from `src/seo.ts`; render Quick Facts, Results table and FAQ visibly, so the UI matches the prerendered HTML. |
| `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` (create) | Crawler policy, URL inventory, LLM summary. Vite copies `public/` to `dist/` verbatim. |
| `public/og-image.png` (create) | 1200×630 social card. Needs a raw exception in `.gitattributes` (it is `*.png`, which is LFS-tracked — an LFS pointer in the build makes the card 404, which is the exact bug that previously broke the hero photo). |
| `.gitattributes` (modify) | Raw exception for `public/og-image.png`, appended at the END of the file (later `*.png` rules override earlier ones). |
| `scripts/verify.mjs` (create) | The harness. Runs against `dist/` and exits non-zero on any failed assertion. This is the project's test suite; there is no test framework and none is needed. |
| `package.json` (modify) | Add `"verify": "node scripts/verify.mjs"`. |
| `docs/geo-prompt-panel.md` (create) | The 12 fixed prompts and a monthly citation log. |

---

## Interfaces

```ts
// src/seo.ts — every export is consumed by BOTH the plugin and App.tsx

export const IDENTITY: {
  name: string;                  // "A V Ajay Kiran"        — canonical, used in title/h1/schema
  alternateNames: string[];      // ["Ajay Kiran","Av. Ajay Kiran"] — the disambiguation list
  descriptor: string;            // "AI Growth & Digital Transformation Leader" — ONE string, verbatim everywhere
  jobTitle: string;              // must equal the LinkedIn title once Ajay aligns it
  employer: string;              // "DIGIT AI"              — one spelling, everywhere
  location: { city: string; country: string; region: string[] };
  email: string; phone: string;
  sameAs: string[];              // [linkedin, github, behance] — exactly 3
  image: string;                 // absolute URL of the hero photo
};

export const META: { title: string; description: string; canonical: string; ogImage: string; themeColor: string };
export const COPY: { heroTagline: string; aboutParagraph: string; positioning: string };
export const QUICK_FACTS: { label: string; value: string }[];   // 6 rows
export const RESULTS: { metric: string; client: string; period: string }[]; // 7 rows, verified only
export const FAQ: { q: string; a: string }[];                   // 8 items, each answer 40–60 words
export const ANSWER_INTRO: string;  // definitional sentence; must stand alone out of context

// scripts/verify.mjs exports nothing; it asserts. Expected values are HARDCODED there
// (9 projects, 8 FAQ items, 4 employers, 3 sameAs, 1200×630) — an independent check,
// not a tautology against the same source the build reads.
```

```ts
// vite-plugin-prerender.ts
export default function prerender(): Plugin  // Vite plugin; applies: "build"
```

---

## Tasks

### Task 1: Write the failing harness

**Files:** Create `scripts/verify.mjs`; modify `package.json`.

**Interfaces:** Produces the assertions every later task must satisfy.

- [ ] **Step 1: Write `scripts/verify.mjs`** — reads `dist/index.html` and `dist/assets/*`,
      collects failures into an array, prints one line per failure, `process.exit(1)` if
      the array is non-empty, else prints `VERIFY PASS (n assertions)`.

  Assertions (hardcoded expectations):
  - `lang="en"` present; `<title>` contains `A V Ajay Kiran` and is ≤ 60 chars
  - `<meta name="description">` present, 120–158 chars, contains the name
  - `<link rel="canonical" href="https://www.designjoom.com/">`
  - `og:title`, `og:description`, `og:url`, `og:image` (absolute URL), `og:type`,
    `og:site_name`, `twitter:card=summary_large_image` all present
  - exactly one `<h1>`, containing the full name
  - raw body HTML contains all **9** project names, all **4** employers
    (`DIGIT AI`, `Vigilare Bio Pharma`, `Logos GmbH`, `Vedic IT Solutions`),
    all **8** FAQ questions, and every `RESULTS` metric string
  - at least one `<table>` with ≥ 7 rows
  - every `<script type="application/ld+json">` block `JSON.parse`s; among them one
    `Person` with `name === "A V Ajay Kiran"` and `sameAs.length === 3`, one `FAQPage`
    with `mainEntity.length === 8`, one `WebSite`
  - `dist/robots.txt` exists and contains `Sitemap:` and `GPTBot`
  - `dist/sitemap.xml` exists and contains the canonical URL
  - `dist/llms.txt` exists and contains the name
  - `dist/assets/*og-image*` exists, starts with the PNG magic bytes, and its IHDR
    reads **1200×630** (bytes 16–23, big-endian)
  - no file under `dist/` contains the string `git-lfs` (catches LFS pointers shipping
    as content — the bug that broke the hero photo)

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm build; node scripts/verify.mjs`
Expected: **FAIL** with the baseline failures — name missing from title, 0 JSON-LD,
no h1, 404 assets. This proves the harness detects the real problem rather than
passing vacuously.

- [ ] **Step 3: Add `"verify": "node scripts/verify.mjs"` to `package.json` scripts.**

- [ ] **Step 4: Commit** — `test: add dist assertion harness (failing vs current build)`

### Task 2: `src/seo.ts` — identity and answer content

**Files:** Create `src/seo.ts`. **Interfaces:** Produces everything listed in the
Interfaces block above. Consumes nothing.

- [ ] **Step 1: Write `src/seo.ts`** with `IDENTITY`, `META`, `COPY`, `QUICK_FACTS`,
      `RESULTS`, `FAQ`, `ANSWER_INTRO` exactly as typed above.

  Content rules (these are the spec's fixed values, copy them verbatim):
  - `IDENTITY.name = "A V Ajay Kiran"`; `alternateNames = ["Ajay Kiran", "Av. Ajay Kiran"]`
  - `descriptor = "AI Growth & Digital Transformation Leader"` — this exact string
    appears in the title, the h1, and the schema `description`
  - `META.title = "A V Ajay Kiran — AI Growth & Digital Transformation Leader"` (60 chars max)
  - `COPY.aboutParagraph` = the existing About paragraph from `App.tsx:320`, moved not rewritten
  - `RESULTS` rows come only from already-verified facts: Dr. Gopichand +99% website traffic ·
    Dr. Gopichand +93% new users · Dr. Khalilullah 1,400+ users · 180%+ organic traffic growth
    (Logos GmbH) · 2,534 new users (IR4U) · 14K LinkedIn followers (Vigilare) ·
    33,248 impressions across 48 posts (Vigilare). Seven rows. `client` and `period` filled
    from `EXPERIENCE` in `data.ts`.
  - `FAQ` — 8 questions, each answer **40–60 words and self-contained** (it must survive
    being lifted with no page context). Questions: Who is A V Ajay Kiran? · What does he
    do? · How many years of experience? · What results has he delivered? · Where is he
    based and does he work remotely? · What AI and growth tools does he use? · Is he
    available for roles? · How do I contact him?
  - `ANSWER_INTRO` — one definitional sentence naming him, the descriptor, the years, and
    the location.
  - **No invented facts.** Any metric without a verified source is omitted, not guessed.
  - **No "Rosh" mention** anywhere.

- [ ] **Step 2: Verify the file parses and the fixed values hold**

Run: `node --experimental-strip-types -e "import('./src/seo.ts').then(m=>{const f=[];if(m.META.title.length>60)f.push('title too long');if(m.FAQ.length!==8)f.push('faq count');if(m.RESULTS.length!==7)f.push('results count');if(m.IDENTITY.sameAs.length!==3)f.push('sameAs count');if(m.FAQ.some(q=>q.a.split(/\s+/).length<40||q.a.split(/\s+/).length>60))f.push('faq answer length');console.log(f.length?f:'SEED OK')})"`
Expected: `SEED OK`. (If type-stripping misbehaves on this Node build, add the same
checks as a temporary `.mjs` copy of the data — do not skip the check.)

- [ ] **Step 3: Commit** — `feat(seo): single source of truth for identity, meta and answer content`

### Task 3: The prerender plugin

**Files:** Create `vite-plugin-prerender.ts`; modify `vite.config.ts`, `src/main.tsx`.

**Interfaces:** Consumes `IDENTITY`, `META`, `COPY`, `QUICK_FACTS`, `RESULTS`, `FAQ`,
`ANSWER_INTRO` from `src/seo.ts`, and `PROJECTS`, `EXPERIENCE`, `SKILLS_*` from `src/data.ts`.
Produces the built HTML that Task 1's assertions inspect.

- [ ] **Step 1: Add failing assertions to `scripts/verify.mjs`** for the prerendered body:
      the 9 project names, the 4 employers, the 8 FAQ questions and every `RESULTS` metric
      must appear in the raw HTML (they are already in Task 1's list; if you wrote them
      there, this step is a no-op — say so and move on).

- [ ] **Step 2: Run `pnpm build; node scripts/verify.mjs`** → confirm those assertions FAIL.

- [ ] **Step 3: Write `vite-plugin-prerender.ts`.** One exported function returning a
      Vite plugin with `name: "prerender"`, `apply: "build"`, and a
      `transformIndexHtml(html) { return {...} }` hook. It must:
  - build one `<h1>` containing `IDENTITY.name` and `IDENTITY.descriptor`
  - emit sections from `data.ts` — experience (role/company/period), projects (name,
    subtitle, metrics), skills — as semantic `<h2>`/`<ul>`/`<li>`
  - emit `ANSWER_INTRO` as a `<p>`, a quick-facts `<dl>`, a results `<table>` with a
    `<caption>`, and an FAQ block of `<h3>question</h3><p>answer</p>`
  - inject into `<head>`: `<title>`, description, canonical, the full `og:`/`twitter:`
    set, `themeColor`, and set `<html lang="en">`
  - inject four JSON-LD blocks: `Person` (with `@id`, `name`, `alternateName`,
    `jobTitle`, `description`, `image`, `url`, `sameAs`, `knowsAbout`, `worksFor`,
    `address`, `email`), `WebSite`, `ProfilePage` (`mainEntity` → Person `@id`), `FAQPage`
  - include an optional `google-site-verification` / `msvalidate.01` meta, **omitted
    entirely when the corresponding value is empty** (Task 7 wires this)
  - leave Figma Make's `<!-- figma:head-start -->` / `figma:body-start` comment markers intact
  - return `{ html, tags: [{ tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(node), injectTo: "head" }] }`
    for the JSON-LD, and place body content inside the existing `<div id="root">`

- [ ] **Step 4: Register the plugin in `vite.config.ts`** — `plugins: [prerender(), react(), tailwindcss(), ...]`.
      Import as `./vite-plugin-prerender`.

- [ ] **Step 5: Make React replace the prerendered markup deterministically.** In
      `src/main.tsx`, immediately before `createRoot(...)`, set the container's
      `innerHTML = ""` (read `document.getElementById("root")` with a null check). This is
      the deliberate alternative to `hydrateRoot`: no markup matching, no mismatch class
      of bug, and the prerendered HTML is a genuine first paint for slow connections.

- [ ] **Step 6: Run `npx tsc --noEmit; pnpm build; node scripts/verify.mjs`**
Expected: the body-content, head-metadata and JSON-LD assertions now PASS. Remaining
failures are only the Task 4/5 assets (robots, sitemap, llms, og-image) — that is correct
at this point.

- [ ] **Step 7: Commit** — `feat(seo): build-time prerender — content, head metadata, JSON-LD`

### Task 4: Crawler policy files

**Files:** Create `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`.

- [ ] **Step 1: `public/robots.txt`** — `User-agent: *` / `Allow: /`, an explicit allow
      group for `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`,
      `Claude-User`, `Google-Extended`, `Applebot-Extended`, `CCBot`, and
      `Sitemap: https://www.designjoom.com/sitemap.xml`. Rationale: citation is the goal,
      so this is an opt-in statement, not a fence.

- [ ] **Step 2: `public/sitemap.xml`** — one `<url>` for `https://www.designjoom.com/`
      with `<lastmod>` set to the build date. (SP4 appends the case-study URLs.)

- [ ] **Step 3: `public/llms.txt`** — markdown: `# A V Ajay Kiran`, the descriptor, the
      ANSWER_INTRO, a link list (site, LinkedIn, GitHub, Behance), and a one-line note per
      project. Follows the `llmstxt.org` convention.

- [ ] **Step 4: Run `pnpm build; node scripts/verify.mjs`** → the three file assertions PASS.

- [ ] **Step 5: Commit** — `feat(seo): robots.txt, sitemap.xml, llms.txt`

### Task 5: Social card image

**Files:** Create `public/og-image.png`; modify `.gitattributes`,
`vite-plugin-prerender.ts` (`ogImage` value in `META`).

- [ ] **Step 1: Capture the card.** Navigate the desktop browser to
      `https://www.designjoom.com/`, set the viewport to exactly **1200×630**, wait for
      fonts and the hero photo, and screenshot the viewport to `public/og-image.png`.
      Verify the PNG's IHDR reads 1200×630.

- [ ] **Step 2: Exempt it from LFS.** Append to the **end** of `.gitattributes`:
      `public/og-image.png filter= diff= merge= text` (blank line before it). Confirm with
      `git check-attr filter public/og-image.png` → the value must be **empty**, not `lfs`
      (attribute order matters: later `*.png` rules override earlier ones).

- [ ] **Step 3: Point `META.ogImage` at the absolute URL** `https://www.designjoom.com/og-image.png`.

- [ ] **Step 4: Run `git add --renormalize public/og-image.png; pnpm build; node scripts/verify.mjs`**
Expected: the og-image assertions PASS (real PNG bytes, 1200×630, in `dist/assets/`),
and the `git-lfs` grep assertion PASSes.

- [ ] **Step 5: Commit** — `feat(seo): 1200x630 social card, raw (not LFS)`

### Task 6: Render the same answer content in the UI

**Files:** Modify `src/App.tsx`.

Rationale: the prerendered HTML and the hydrated UI must show the same content. If the
FAQ exists only in the build output, that is cloaking — which is both an SEO penalty and
dishonest.

**Interfaces:** Consumes `COPY`, `QUICK_FACTS`, `RESULTS`, `FAQ`, `ANSWER_INTRO`, `IDENTITY`
from `src/seo.ts`.

- [ ] **Step 1: Replace the hardcoded About paragraph and positioning strings in
      `App.tsx` with `COPY.aboutParagraph` / `COPY.positioning`** (no visual change).

- [ ] **Step 2: Add a `<QuickFacts>` section** — the six `QUICK_FACTS` rows as a `<dl>`,
      placed directly after the hero.

- [ ] **Step 3: Add a `<ResultsTable>` section** — `RESULTS` as a real `<table>` with
      `<caption>`, `<thead>`, and labels that name the units (the existing charts mix
      views/users/clicks without labels — this table is the fix).

- [ ] **Step 4: Add an `<Faq>` section** — `FAQ` as `<details>`/`<summary>` (accessible
      disclosure, no JS state) or `<h3>` + `<p>`. Add the section to the `SideNav`
      target list only if it earns a slot; keep the SideNav at its current length
      otherwise.

- [ ] **Step 5: Respect reduced motion** — any animation added here is either CSS with the
      existing `@media (prefers-reduced-motion: reduce)` backstop or a framer component
      under the existing `MotionConfig reducedMotion="user"`.

- [ ] **Step 6: Verify** — `npx tsc --noEmit; pnpm build; node scripts/verify.mjs` all
      green, then load production and confirm the FAQ, table and quick facts are visible,
      keyboard-accessible, and that the `<details>` toggles without JS errors in the
      console.

- [ ] **Step 7: Commit** — `feat(seo): visible quick facts, results table and FAQ (matches prerendered HTML)`

### Task 7: Search-console verification tags

**Files:** Modify `vite-plugin-prerender.ts`.

- [ ] **Step 1: Add `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` reads** —
      from `process.env` at build time, defaulting to empty string.

- [ ] **Step 2: Emit `google-site-verification` and `msvalidate.01` metas ONLY when
      non-empty.** Verify both branches:

Run: `pnpm build; node -e "const h=require('fs').readFileSync('dist/index.html','utf8');console.log('unset:', h.includes('google-site-verification'));"`
Expected: `unset: false`.
Run: `$env:GOOGLE_SITE_VERIFICATION='test123'; pnpm build; node -e "const h=require('fs').readFileSync('dist/index.html','utf8');console.log('set:', h.includes('test123'))"`
Expected: `set: true`. Then clear the env var.

- [ ] **Step 3: Commit** — `feat(seo): optional GSC/Bing verification meta from env`

### Task 8: GEO prompt panel

**Files:** Create `docs/geo-prompt-panel.md`.

- [ ] **Step 1: Write the 12 fixed prompts** — the four name queries ("Who is A V Ajay
      Kiran?", "A V Ajay Kiran AI growth leader", "Ajay Kiran digital transformation
      Hyderabad", "What does A V Ajay Kiran do?") and eight discovery queries ("AI growth
      leaders in Hyderabad", "AI + UX transformation consultants UAE", "digital
      transformation consultants India e-waste", "AI growth consultant for pharma",
      "UX strategist for AI products", "best AI growth case studies", "who does AI video
      automation", "AI workflow architects India").

- [ ] **Step 2: Add the log table** — columns: date · engine (ChatGPT / Perplexity /
      Gemini / Copilot / Google AI Overview) · prompt · cited? (Y/N) · quoted phrase ·
      which URL was cited. Seed one row dated 2026-10-12 recording the measured baseline:
      **LinkedIn only, site never cited.**

- [ ] **Step 3: Commit** — `docs: GEO prompt panel (12 prompts + monthly citation log)`

### Task 9: Production verification

**Files:** none.

- [ ] **Step 1: Verify the deployed page as a non-JS crawler** — fetch
      `https://www.designjoom.com/` with a bot User-Agent and assert the h1, all 9 project
      names, the 4 employers, the 8 FAQ questions and every RESULTS metric are present in
      the **raw** HTML, and that the JSON-LD parses. This is the whole point of the
      sub-plan: if it fails here, the sub-plan is not done.

- [ ] **Step 2: Verify the assets live** — `robots.txt` (200, contains `Sitemap:`),
      `sitemap.xml` (200, valid), `llms.txt` (200), the OG image (200, `image/png`, 1200×630).

- [ ] **Step 3: Verify a real browser still renders everything** — open
      `https://www.designjoom.com/`, confirm zero console errors, and screenshot the
      quick-facts block, results table and FAQ.

- [ ] **Step 4: Record the outcome in the master roadmap** — tick SP1 and note the new
      baseline for the GEO panel.

---

## Self-Review

**Spec coverage:** every baseline failure in the master roadmap's table maps to a task —
0 h1/0 text → Task 3; missing name in title → Task 3; 0 JSON-LD → Task 3; four 404 assets
→ Tasks 4–5; entity contradiction → addressed structurally by `IDENTITY` (one canonical
string consumed by title, h1 and schema) with the LinkedIn half tracked in the master
off-site checklist; "site loses to LinkedIn" → Task 8 measures it and the off-site
checklist attacks it. Answer-shaped content → Tasks 2 and 6. Measurement → Tasks 7–8.

**Step scan:** every step yields one checkable artifact or one command with an expected
output. Content rules are given as fixed values (copy rules the implementer cannot
derive); no function bodies appear anywhere, because the signature plus the assertions
determine each body.

**Type consistency:** `IDENTITY`/`META`/`COPY`/`QUICK_FACTS`/`RESULTS`/`FAQ`/`ANSWER_INTRO`
are declared once in the Interfaces block and consumed under those exact names in Tasks 2,
3, 5, 6 and 7. `prerender()` is the single plugin export, named identically in the
Interfaces block and Task 3.

**Review Focus coverage:** crawler-with-no-JS → Task 1 + Task 9. Slow connection/CLS →
explicit `width`/`height` on every image (existing pattern, re-asserted in Task 5). Reduced
motion → Task 6 Step 5. Bot form abuse → owned by SP2, not this sub-plan. Missing
asset/degenerate data → Task 1's `git-lfs` grep plus Task 5's PNG-header assertion, and
SP3's styled card fallback.

**Proportion:** no code bodies; assertions and signatures only. Tasks are ordered so each
one is independently reviewable and the harness fails before each implementation step.
