# Sub-plan 1 (Astro): Migration + AEO/SEO/GEO Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development`
> (chosen by Ajay). A fresh subagent implements each task; a fresh reviewer checks it
> before the next starts; one whole-branch review at the end.
>
> Parent roadmap: `2026-10-12-portfolio-master.md` (Global Constraints + Review Focus apply).
> **Fallback path:** `2026-10-12-sp1-aeo-seo-geo-foundation.md` — the Vite + prerender
> version of this same foundation. It stays on disk as the revert option. Do not delete it.
>
> **Announce at session start:** "Using the writing-plans plan for SP1-Astro; executing
> subagent-driven."

**Goal:** Rebuild `designjoom.com` as a zero-JS-by-default Astro site that ships real HTML
to crawlers, drops React entirely unless something resists, and carries the entity,
schema and answer content that answer engines need — while preserving every fix already
bought in this project (photo, LFS handling, a11y, content rules, links).

**Architecture:** Astro renders every section to static HTML at build time. Interactivity
that was React is replaced by: pure CSS (marquee), one small IntersectionObserver script
(reveal), one rAF script (counters), one canvas script (neural background), and
build-time inline SVG (the Recharts dashboard). Case studies become Astro content
collection entries, so `/case-study/<slug>/` is a real static route. One server route
(`/api/contact`) is the only dynamic thing on the site. Vite is Astro's bundler, so the
existing Tailwind v4 + `@tailwindcss/vite` setup carries over unchanged.

**Tech Stack:** Astro (latest stable), `@astrojs/sitemap`, `@astrojs/vercel` (only needed
from SP2), Tailwind v4 via `@tailwindcss/vite`, plain CSS/vanilla JS for interaction.
**Removed:** `react`, `react-dom`, `framer-motion`, `recharts`, `lucide-react`, `lenis`,
`@vitejs/plugin-react`, `@astrojs/react` (not installed unless a task needs it).

**Spec:** this plan + `docs/superpowers/specs/2026-10-12-profile-design.md`.

---

## Read this before starting: what the migration costs

**Measured payoff** (from the current build, `dist/`):
| | Today | Target |
|---|---|---|
| Main JS | 380.87 kB (gzip 119.32) | **< 30 kB** (gzip < 12) — scripts only |
| Charts chunk | 436.95 kB (gzip 123.89) | **0** — build-time SVG |
| Hydration | full React tree | **none** |
| Crawler-visible content | 0 characters | the whole page |

**What you give up:** the Figma Make publish/edit loop. Figma Make expects a Vite React
app at the repo root (`index.html` + `src/main.tsx` + `.figma/make/site.json`); an Astro
project is not that shape, so **the "update from Figma Make" flow stops working.** Editing
after this point happens in the repo (which is also how the case studies, form and SEO
work must happen anyway). This is the single irreversible cost of choosing Astro — confirm
it is accepted before Task 1.

**Revert plan:** the Vite app stays intact and building until Task 11. Rollback = revert
the Vercel preset and the branch, and the old site is live again in one deploy.

---

## File Structure

```
astro.config.mjs                     (create)  react-free; react(), tailwindcss(), sitemap()
src/layouts/Base.astro               (create)  <html lang="en">, all head tags, JSON-LD slot, fonts
src/pages/index.astro                (create)  composes the sections in order
src/pages/api/contact.ts             (SP2)     the only dynamic route
src/pages/case-study/[slug].astro    (SP4)     content-collection route
src/content/config.ts                (SP4)     case-study schema (build fails on bad frontmatter)
src/components/*.astro               (create)  one file per section, see Task 4/5/6
src/scripts/*.ts                     (create)  reveal / counters / canvas / typewriter (~15 lines each)
src/seo.ts                           (create)  identity, meta, quick facts, results, FAQ, copy
src/data.ts                          (keep)    projects, experience, skills — unchanged
src/index.css                        (keep)    Tailwind v4 + global CSS + reduced-motion backstop
public/robots.txt, llms.txt, og-image.png (create)
public/sitemap.xml                   (delete)  replaced by @astrojs/sitemap
scripts/parity.mjs                   (create)  the migration safety net (Task 1)
scripts/verify.mjs                   (create)  the SEO/AEO assertions (Task 3+)
index.html, src/main.tsx, src/App.tsx, vite.config.ts, src/Reveal.tsx, src/Charts.tsx
                                     (delete at Task 11, only after production parity passes)
```

---

## Interfaces

```ts
// src/seo.ts — consumed by Base.astro, index.astro, the section components, and the plugin-free head
export const IDENTITY: {
  name: string;            // "A V Ajay Kiran" — canonical in title, h1, schema
  alternateNames: string[];// ["Ajay Kiran", "Av. Ajay Kiran"] — disambiguation
  descriptor: string;      // "AI Growth & Digital Transformation Leader" — ONE string, verbatim everywhere
  jobTitle: string; employer: string;   // must match LinkedIn after Ajay aligns it
  location: { city: string; country: string };
  email: string; phone: string;
  sameAs: string[];        // [linkedin, github, behance] — exactly 3
  image: string;
};
export const META: { title: string; description: string; canonical: string; ogImage: string; themeColor: string };
export const COPY: { heroTagline: string; aboutParagraph: string; positioning: string };
export const QUICK_FACTS: { label: string; value: string }[];              // 6
export const RESULTS: { metric: string; client: string; period: string }[];// 7, verified only
export const FAQ: { q: string; a: string }[];                              // 8, answers 40–60 words
export const ANSWER_INTRO: string;   // definitional, must survive lifting out of context

// scripts/parity.mjs — no exports; asserts parity against a running site and exits non-zero.
// Invoked as: node scripts/parity.mjs <baseUrl>
```

---

## Tasks

### Task 1: Parity harness — build the net before touching the trapeze

**Files:** Create `scripts/parity.mjs`.

**Why first:** the whole migration is a relocation of working code. Without a harness that
pins today's behaviour, every regression is found by a human noticing it.

- [ ] **Step 1: Write `scripts/parity.mjs`** taking a base URL, fetching `/` and `/assets/*`,
      and asserting (hardcoded expectations — an independent check, not a tautology):
  - the hero contains `A V Ajay Kiran`; the string `Av. Ajay` appears nowhere
  - all **9** project names present; the string `Rosh` appears **nowhere**
  - all 4 employers present (`DIGIT AI`, `Vigilare Bio Pharma`, `Logos GmbH`, `Vedic IT Solutions`)
  - the 3 live outbound links are correct: `https://www.recytronics.com`,
    `https://ir4ubyram.com`, `https://www.vigilarebp.com`
  - the a11y features that were already paid for still exist: `aria-label` on the side nav,
    `aria-hidden` on the decorative cursor and canvas, `role="img"` + text alternative on
    the charts, `scroll-margin-top` for `section[id]`
  - both images are real PNGs served as `image/png` with `content-length` > 10 000
    (catches an LFS pointer shipping as content — the bug that previously broke the photo)
  - zero console errors and zero console warnings on load

- [ ] **Step 2: Run it against the current production site and against a local `pnpm preview`**
Run: `node scripts/parity.mjs https://www.designjoom.com`
Expected: **PASS** on every assertion. (If anything fails, fix the harness, not the site —
it must describe the real current state before it can guard it.)

- [ ] **Step 3: Commit** — `test: parity harness pinning current site behaviour before Astro migration`

### Task 2: Astro scaffold, Vite app still live

**Files:** Create `astro.config.mjs`, `src/layouts/Base.astro` (skeleton), `src/pages/index.astro`
(placeholder); modify `package.json`, `.gitignore`.

**Interfaces:** Produces `pnpm astro build` → `dist/`, coexisting with the existing
`pnpm build`.

- [ ] **Step 1: Install Astro and record the resolved version**
Run: `pnpm add astro @astrojs/sitemap`
Expected: `astro@5.x` (or newer) in `dependencies`; note the exact version in the commit body.

- [ ] **Step 2: Write `astro.config.mjs`** — `site: "https://www.designjoom.com"`,
      `integrations: [sitemap()]`, `vite: { plugins: [tailwindcss()] }`, and
      `vite: { configFile: false }` **if** Astro picks up the old root `vite.config.ts`
      (verify in Step 4; Astro normally ignores it, and a stray config here is a silent
      source of half-applied plugins).
      Do NOT add `@astrojs/react` — nothing should need it. If a later task hits a wall
      that genuinely needs React, add the integration *then* and record why.

- [ ] **Step 3: Point the build scripts at Astro without losing the old path** — add
      `"build:astro": "astro build"`, `"dev:astro": "astro dev"`, leave `"build"` and
      `"dev"` on Vite for now. Add `"build": "astro build"` only at Task 11.

- [ ] **Step 4: Verify both toolchains run**
Run: `pnpm build:astro` (expect a `dist/` with the placeholder page and a sitemap),
then `pnpm build` (expect the existing Vite build to still produce the 380 kB main bundle).
Expected: both succeed. Also confirm the Astro output is not polluted by the Vite config —
grep the Astro build log for plugin names belonging to the Vite app.

- [ ] **Step 5: Commit** — `chore(astro): scaffold Astro alongside the Vite app (parallel-run migration)`

### Task 3: `src/seo.ts` + the Base layout (entity, schema, answer content)

**Files:** Create `src/seo.ts`; flesh out `src/layouts/Base.astro`; create `scripts/verify.mjs`;
modify `package.json`.

**Interfaces:** Produces everything in the Interfaces block; consumes nothing.

- [ ] **Step 1: Write `src/seo.ts`** exactly as typed above.

  Fixed values (copy rules the implementer cannot derive):
  - `name = "A V Ajay Kiran"`, `alternateNames = ["Ajay Kiran", "Av. Ajay Kiran"]`
  - `descriptor = "AI Growth & Digital Transformation Leader"` — appears verbatim in the
    title, the h1 and the schema `description`
  - `META.title = "A V Ajay Kiran — AI Growth & Digital Transformation Leader"` (≤ 60 chars)
  - `META.description` 120–158 chars, contains the name and one verified number
  - `COPY.aboutParagraph` — moved from `src/App.tsx` **verbatim**, not rewritten
  - `RESULTS` — 7 rows, each already verified: Dr. Gopichand +99% website traffic ·
    Dr. Gopichand +93% new users · Dr. Khalilullah 1,400+ users · Logos GmbH 180%+ organic
    growth · IR4U 2,534 new users · Vigilare 14K LinkedIn followers · Vigilare 33,248
    impressions across 48 posts. `client`/`period` filled from `EXPERIENCE` in `data.ts`.
  - `FAQ` — 8 questions, answers **40–60 words, self-contained**. Who is A V Ajay Kiran? ·
    What does he do? · How many years of experience? · What results has he delivered? ·
    Where is he based and does he work remotely? · What tools does he use? · Is he
    available for roles? · How do I contact him?
  - `ANSWER_INTRO` — one definitional sentence: name, descriptor, years, location.
  - **No invented facts. No "Rosh" anywhere.**

- [ ] **Step 2: Write `src/layouts/Base.astro`** — `<html lang="en">`, `<slot />`, and head:
  title, description, canonical, the full `og:` set (`type`, `title`, `description`, `url`,
  `image`, `site_name`, `locale`), `twitter:card=summary_large_image`, `themeColor`,
  font preconnect + preload, and four JSON-LD blocks built from `seo.ts`: `Person` (with
  `@id`, `name`, `alternateName`, `jobTitle`, `description`, `image`, `url`, `sameAs`,
  `knowsAbout` from the skill arrays in `data.ts`, `worksFor`, `address`, `email`),
  `WebSite`, `ProfilePage` (`mainEntity` → Person `@id`), `FAQPage` (`mainEntity` from `FAQ`).
  Include `google-site-verification` / `msvalidate.01` metas **only when their env values
  are non-empty**.

- [ ] **Step 3: Write `scripts/verify.mjs`** — the AEO/SEO assertions, hardcoded, non-zero exit on failure:
  - `<html lang="en">`; `<title>` contains `A V Ajay Kiran` and is ≤ 60 chars
  - description present, 120–158 chars, contains the name
  - canonical is exactly `https://www.designjoom.com/`
  - every `og:`/`twitter:` tag listed above is present; `og:image` is absolute
  - exactly one `<h1>`, containing the full name
  - raw HTML contains all 9 project names, all 4 employers, all 8 FAQ questions, and every
    `RESULTS` metric string
  - one `<table>` with ≥ 7 rows
  - every JSON-LD block parses; one `Person` with `sameAs.length === 3`; one `FAQPage` with
    `mainEntity.length === 8`; one `WebSite`
  - `dist/robots.txt` contains `Sitemap:` and `GPTBot`; `dist/llms.txt` contains the name
  - `dist/sitemap-index.xml` (or `sitemap-0.xml`) contains the canonical URL
  - the OG image is a real PNG whose IHDR reads **1200×630**
  - no file under `dist/` contains `git-lfs`

- [ ] **Step 4: Run the harness and confirm it fails for the right reasons**
Run: `pnpm build:astro; node scripts/verify.mjs`
Expected: FAIL only on the assets that Tasks 9–10 create (og image, robots, llms) plus any
body content not yet ported. No failure may be caused by a *missing assertion* — check
that each failing line corresponds to work that is genuinely not done yet.

- [ ] **Step 5: Commit** — `feat(astro): Base layout — head, JSON-LD entity, verify harness`

### Task 4: Static content sections

**Files:** Create `src/components/{QuickFacts,About,Experience,Skills,Results,Faq,Footer,Contact}.astro`;
modify `src/pages/index.astro`.

- [ ] **Step 1: Port each section** from `src/App.tsx` into a `.astro` component, keeping the
      markup, class names and inline styles **visually identical**. Mechanical translation only:
      `className` → `class`, `style={{ a: "b" }}` → `style="a: b"`, `{PROJECTS.map(...)}` →
      `.map()` inside the template, React conditional rendering → Astro `{cond && ...}`.
      `Contact.astro` is the static half (email/phone/maps chips, logo, socials) — the form
      is SP2 and must not be added here.

- [ ] **Step 2: Add the two new sections** — `QuickFacts.astro` (a `<dl>` of the 6 rows,
      directly after the hero) and `Results.astro` (a real `<table>` with `<caption>`,
      `<thead>`, and **units named in the labels** — the existing charts mix
      views/users/clicks unlabelled, which is unreadable to both humans and models),
      `Faq.astro` (`<details>`/`<summary>` per question — accessible disclosure, no JS).

- [ ] **Step 3: Compose `src/pages/index.astro`** in the current order: SideNav, Hero,
      CrawlStrip, QuickFacts, About, Experience, Projects, Skills, Results, Faq, Metrics,
      Contact, Footer.

- [ ] **Step 4: Verify content parity and crawler visibility**
Run: `pnpm build:astro; node scripts/verify.mjs; node scripts/parity.mjs file://$PWD/dist/index.html`
Expected: all content assertions PASS in the **raw** HTML — this is the point of the
migration. Remaining failures are limited to interactivity (Task 7) and assets (Tasks 9–10).

- [ ] **Step 5: Commit** — `feat(astro): port content sections + quick facts, results table, FAQ`

### Task 5: Hero and navigation

**Files:** Create `src/components/Hero.astro`, `src/components/SideNav.astro`,
`src/components/CrawlStrip.astro`; create `src/scripts/{typewriter,canvas,cursor}.ts`.

- [ ] **Step 1: Port `Hero.astro`** — the name, descriptor, `ANSWER_INTRO`, the photo
      (`<img>` with explicit `width`/`height`, `fetchPriority="high"`, real alt text), the
      certification strip, and the scroll cue. The photo must keep its current intrinsic
      dimensions; a wrong aspect ratio is exactly what squeezed the logo earlier.

- [ ] **Step 2: Move the three decorative behaviours into plain scripts** —
      `typewriter.ts` (respects `prefers-reduced-motion`: static text instead of typing, and
      the text must be present in the HTML for crawlers — do not inject the hero name from JS),
      `canvas.ts` (the neural background, `IntersectionObserver` to pause off-screen,
      `aria-hidden`), `cursor.ts` (the follower, gated to `pointer: fine` and
      `prefers-reduced-motion: no-preference`). Each is a ~15-line module imported with a
      `<script>` in the component. These must not be able to remove or replace the page's
      text content.

- [ ] **Step 3: `CrawlStrip.astro` as pure CSS** — replace the framer `motion.div` marquee with
      a keyframe animation (duplicate the list, `transform: translateX(-50%)`, `linear`
      `infinite`). `aria-hidden="true"` stays. The existing global
      `@media (prefers-reduced-motion: reduce)` backstop already kills it — no JS needed.
      This removes a React island and a framer dependency for zero behaviour change.

- [ ] **Step 4: `SideNav.astro`** — links only, plus a small script for
      active-section tracking and `aria-label` on the nav. Keyboard focus ring must remain
      visible (the `sidenav-btn` focus-visible rule in `index.css` already does this).

- [ ] **Step 5: Verify parity under both motion preferences**
Run: `pnpm build:astro; node scripts/parity.mjs <local preview url>` with reduced motion
emulated **and** with it off.
Expected: PASS in both; hero name present in the raw HTML; zero console errors/warnings.

- [ ] **Step 6: Commit** — `feat(astro): hero, nav, CSS marquee, vanilla canvas/typewriter/cursor`

### Task 6: Projects section

**Files:** Create `src/components/Projects.astro`; modify `src/data.ts` only if a field is missing.

- [ ] **Step 1: Port the 9 project cards** from the current grid, including the accent
      border, the hover glow, the ↗ link (`aria-label` per card), the 4 metric chips and the
      tags. Card content comes from `PROJECTS` in `data.ts` — do not retype it.
      Keep the Verified links exactly as they are today, including
      `https://www.recytronics.com` (www subdomain; the bare domain's TLS is dead) and the
      GitHub links for the three repo-only projects.

- [ ] **Step 2: Leave a documented image slot** — each card reserves a 16:10 thumbnail
      position, rendering nothing until SP3 provides `src/imports/projects/<slug>.webp`.
      No fake placeholder image; an empty slot is honest, a stock photo is not.

- [ ] **Step 3: Verify** — `pnpm build:astro; node scripts/verify.mjs`
Expected: all 9 project names and their metric strings appear in the raw HTML.

- [ ] **Step 4: Commit** — `feat(astro): project cards (screenshot slot reserved for SP3)`

### Task 7: Reveal-on-scroll and counters as plain scripts

**Files:** Create `src/components/Reveal.astro` (a `div`/`section` wrapper emitting
`data-reveal`), `src/scripts/{reveal,counters}.ts`; add the reveal CSS to `src/index.css`;
delete `src/Reveal.tsx` usage.

- [ ] **Step 1: Replace the framer `Reveal` with `data-reveal` + CSS + one observer script.**
      ~15 lines: observe `[data-reveal]`, add `.in` on intersect, stop observing.
      CSS: start at `opacity: 0; transform: translateY(16px)`, `.in` → `opacity: 1; none`,
      `transition` on both. **Critically:** the reveal must never be able to leave content
      invisible — if the script fails to load, the content must still be visible. Do that by
      gating the hidden state behind a class the script itself adds (e.g. `html.js [data-reveal]`),
      so a JS failure degrades to "no animation, content visible", never a blank page.

- [ ] **Step 2: Counters via one rAF script** on `[data-count]`, reading the final value from
      the element's own text (so the number is in the HTML for crawlers) and restoring it if
      reduced motion is set.

- [ ] **Step 3: Verify the failure mode explicitly** — build, then load the page with
      JavaScript disabled and with the script blocked (`request blocked` on the script URL).
Expected: content fully visible in both cases; parity harness PASSES with JS off for
everything except the interactive extras.

- [ ] **Step 4: Commit** — `feat(astro): CSS+observer reveal, rAF counters — framer removed from static content`

### Task 8: Charts as build-time SVG

**Files:** Create `src/components/Metrics.astro`, `src/components/ImpactDashboard.astro`
(renamed `Charts`), delete `src/Charts.tsx` usage; remove `recharts` from `package.json`.

**Decision recorded:** static charts do not need a 437 kB client-side charting library.
Astro can emit the SVG at build time. If the geometry resists (label collision at mobile
widths), the fallback is a `client:visible` React island with `@astrojs/react` — **only**
if it genuinely resists, not as a first move.

- [ ] **Step 1: Rebuild the growth chart and the funnel/radar as inline SVG** from the same
      numbers in `data.ts`, with `<title>`/`<desc>` for accessibility, real axis labels and
      **units on every series** (views / users / clicks get separate scales — the current
      chart plots them together unlabelled, which is a correctness problem, not just a
      formatting one).
- [ ] **Step 2: Remove `recharts`** and confirm nothing imports it.
- [ ] **Step 3: Verify** — `pnpm build:astro; node scripts/verify.mjs; node scripts/parity.mjs <preview>`
Expected: charts render as SVG in the raw HTML, accessible names present, **zero** JS chunks
of chart size, and the harness still green.
- [ ] **Step 4: Commit** — `feat(astro): charts as build-time SVG, recharts removed (-437 kB client JS)`

### Task 9: Crawler and social assets

**Files:** Create `public/robots.txt`, `public/llms.txt`, `public/og-image.png`;
modify `.gitattributes`.

- [ ] **Step 1: `public/robots.txt`** — `User-agent: *` / `Allow: /`, plus an explicit allow
      group for `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`,
      `Claude-User`, `Google-Extended`, `Applebot-Extended`, `CCBot`, and
      `Sitemap: https://www.designjoom.com/sitemap-index.xml`. Citation is the goal, so this
      is an opt-in statement, not a fence.
- [ ] **Step 2: `public/llms.txt`** — markdown per the `llmstxt.org` convention: `# A V Ajay
      Kiran`, the descriptor, `ANSWER_INTRO`, a link list (site, LinkedIn, GitHub, Behance),
      one line per project.
- [ ] **Step 3: `public/og-image.png`** — capture the live homepage at exactly **1200×630**
      (fonts and photo loaded) and save there. Verify the IHDR reads 1200×630.
- [ ] **Step 4: Exempt it from LFS** — append to the **END** of `.gitattributes`:
      blank line, then `public/og-image.png filter= diff= merge= text`. Confirm
      `git check-attr filter public/og-image.png` prints an **empty** value (not `lfs`) —
      attribute order matters, later `*.png` rules override earlier ones.
- [ ] **Step 5: Run `git add --renormalize public/og-image.png; pnpm build:astro; node scripts/verify.mjs`**
Expected: all asset assertions PASS; the `git-lfs` grep assertion PASSES.
- [ ] **Step 6: Commit** — `feat(astro): robots.txt, llms.txt, 1200x630 social card (raw, not LFS)`

### Task 10: Production cutover on a branch

**Files:** Modify `package.json` scripts, `.gitignore`, Vercel project settings.

- [ ] **Step 1: Flip the default build to Astro** — `"build": "astro build"`,
      `"dev": "astro dev"`, keep `"build:vite": "vite build"` as a one-command fallback
      until Task 11 completes.
- [ ] **Step 2: Deploy a preview and run the full harness against it.** Note: deployment URLs
      are SSO-protected (`ssoProtection: all_except_custom_domains`), so a preview cannot be
      fetched anonymously — either run the harness from an authenticated context, or
      temporarily relax protection for previews, or verify on production immediately after
      merge. Do not skip this; unverified means unverified.
- [ ] **Step 3: Update the Vercel project to the Astro preset** — framework `astro`, build
      `astro build`, output `dist`. The project is currently `framework: "vite"`; leaving it
      there risks Vercel serving the wrong output. Attempt via the Vercel API first, and fall
      back to the dashboard if the setting is not exposed.
- [ ] **Step 4: Merge to `main`, wait for the production deploy, then verify production with
      both harnesses**
Run: `node scripts/parity.mjs https://www.designjoom.com; node scripts/verify.mjs`
Expected: both PASS. Record the bundle numbers in the commit body — this is the payoff claim
and it must be measured, not asserted.
- [ ] **Step 5: Commit + merge** — `feat(astro): cut over production build to Astro`

### Task 11: Remove the Vite app

**Files:** Delete `index.html`, `src/main.tsx`, `src/App.tsx`, `src/Reveal.tsx`,
`src/Charts.tsx`, `vite.config.ts`; modify `package.json` (remove `react`, `react-dom`,
`framer-motion`, `lucide-react`, `lenis`, `@vitejs/plugin-react`), `pnpm-lock.yaml`.

- [ ] **Step 1: Confirm production has been stable on Astro** (at least one deploy cycle,
      harnesses green) **and** that the old site is preserved in git history — tag it first:
      `git tag pre-astro-vite` and push the tag. This is the revert path once the files are gone.
- [ ] **Step 2: Delete the files and prune the dependencies**, one dependency group per
      commit so a bad removal is isolated. After each removal: `pnpm build; node scripts/verify.mjs; node scripts/parity.mjs <preview>`.
- [ ] **Step 3: Verify the bundle claim**
Run: `pnpm build; node scripts/verify.mjs` then read the Astro output line for the client JS.
Expected: main JS **< 30 kB** (gzip < 12), no chart chunk. If it is not, find what is still
shipping and either justify it in the commit message or remove it.
- [ ] **Step 4: Commit** — `chore(astro): remove the Vite app and its dependencies`

### Task 12: Measurement

**Files:** Create `docs/geo-prompt-panel.md`; modify `docs/superpowers/plans/2026-10-12-portfolio-master.md`.

- [ ] **Step 1: Write the 12 fixed prompts** — 4 name queries ("Who is A V Ajay Kiran?",
      "A V Ajay Kiran AI growth leader", "Ajay Kiran digital transformation Hyderabad",
      "What does A V Ajay Kiran do?") and 8 discovery queries ("AI growth leaders in
      Hyderabad", "AI + UX transformation consultants UAE", "digital transformation
      consultants India e-waste", "AI growth consultant for pharma", "UX strategist for AI
      products", "best AI growth case studies", "who does AI video automation", "AI workflow
      architects India").
- [ ] **Step 2: Add the log table** — date · engine (ChatGPT / Perplexity / Gemini /
      Copilot / Google AI Overview) · prompt · cited? (Y/N) · quoted phrase · URL cited.
      Seed the first row with the measured baseline: **LinkedIn only; the site is never cited.**
- [ ] **Step 3: Tick SP1 in the master roadmap** and record the new measured baseline
      (bundle sizes, crawler-visible content, assets live).
- [ ] **Step 4: Commit** — `docs: GEO prompt panel + SP1 outcome recorded`

---

## Self-Review

**Spec coverage:** every item in the master's baseline table maps to a task — 0 chars for
crawlers → Tasks 4/5 (Astro renders it natively) plus Task 4 Step 4's assertion; name missing
from title → Task 3; 0 JSON-LD → Task 3; four 404 assets → Task 9; entity contradiction →
`IDENTITY` as the one canonical string in title/h1/schema, with the LinkedIn half in the
master's off-site checklist; performance/bundle → Tasks 7/8/11; measurement → Task 12.
The existing site's fixes are protected by Task 1's parity harness and re-verified in
Tasks 5, 7, 10.

**Step scan:** each step is one action with a checkable result; every task ends in a runnable
command with expected output. Content rules are given as fixed values (the implementer cannot
derive which metrics are verified); no function bodies appear — the script descriptions state
the observable behaviour, which is what the parity harness checks.

**Type consistency:** `IDENTITY`/`META`/`COPY`/`QUICK_FACTS`/`RESULTS`/`FAQ`/`ANSWER_INTRO`
are declared once and consumed under those exact names in Tasks 3–6, 9 and 12.
`scripts/parity.mjs` and `scripts/verify.mjs` keep their names and invocation form
throughout; both take the same "exit non-zero on failure" contract.

**Review Focus coverage:** crawler-with-no-JS → Task 4 Step 4, Task 10 Step 4. Slow
connection/CLS → explicit `width`/`height` (Task 5 Step 1). Reduced motion → Task 5 Steps 2/3,
Task 7 Step 2. Bot form abuse → SP2. Missing asset/degenerate data → Task 9 Step 5's `git-lfs`
grep + PNG-header check, Task 6 Step 2's honest empty slot, and SP4's content-collection
schema (build fails on missing required frontmatter).

**Proportion:** no code bodies; signatures, fixed values and assertions only. Eleven of the
twelve tasks are porting or removal — the plan is longer than the diff it describes only
because the *parity* requirements are long, which is the one thing a migration must never
be lazy about.

**One risk this plan cannot eliminate:** the Figma Make publish loop stops working at
Task 10 (see the cost section). That is a product decision, not a technical one, and it must
be confirmed by Ajay before Task 1 runs.
