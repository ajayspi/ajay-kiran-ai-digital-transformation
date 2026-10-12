# Massive Portfolio — Master Roadmap

> **For agentic workers:** This is the index. Each sub-plan is written and executed
> on its own (they are independent subsystems). **Sub-plan 1 is written in full at
> `2026-10-12-sp1-astro-migration.md`** (Astro migration + the AEO/SEO/GEO foundation,
> 12 tasks). Sub-plans 2–5 get their own detailed file immediately before execution,
> using the scope fixed here.
>
> `2026-10-12-sp1-aeo-seo-geo-foundation.md` is the **fallback** — the same foundation
> built on Vite with a build-time prerender plugin instead of Astro. Keep it: it is the
> revert path if the Astro cost (below) is not accepted.
>
> Plan files live in `C:\Users\vigilare\.opencode\plan\` because Plan mode restricts
> writes there. During execution, move them to `docs/superpowers/plans/` in the repo.

**Goal:** Turn `designjoom.com` from a one-page profile into a citable, verifiable
personal-brand platform: readable by non-JS crawlers and answer engines, capturing
inbound messages, showcasing real project visuals, and carrying enough proof content
(case studies, testimonials, results) that a recruiter, an algorithm, or an LLM
resolves "A V Ajay Kiran" to one specific, well-evidenced entity.

**Repo:** `C:\Users\vigilare\Designjoom\ajay-profile` (React 19 + Vite 8 + Tailwind v4,
pnpm, deployed to Vercel from `main`, live at `https://www.designjoom.com`).

**Tech stack:** Vite 8 (rolldown), React 19, Tailwind v4, framer-motion, lenis,
recharts (lazy chunk). Vercel: framework preset `vite`, Node 24 — files in `/api/*`
deploy as serverless functions with zero config.

---

## Measured baseline (2026-10-12, verified against production)

| Check | Result |
|---|---|
| Raw HTML for a non-JS crawler | `<div id="root"></div>` — **0 h1, 0 h2, 0 characters of text** |
| `<title>` contains the name | **No** |
| JSON-LD blocks | **0** |
| `robots.txt` / `sitemap.xml` / `llms.txt` / `og-image` / `favicon.ico` | **all 404** |
| Search `"A V Ajay Kiran" AI growth` | his **LinkedIn** is the only result; the site does not appear |
| Search `Ajay Kiran … Hyderabad` | **6+ other Ajay Kirans** (Blue Yonder, ValueMomentum, Cognizant, Citi, Lanware, an SEO strategist) — he ranks for none |
| Head metadata present | canonical, theme-color, description, skip links (fixed earlier) |
| Main bundle | 380KB (gzip 119KB) + lazy `Charts` chunk 437KB (gzip 124KB) |

**Root cause #1:** GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot and
CCBot **do not execute JavaScript**. They receive an empty div. Every AEO/GEO
investment is decoration until the content exists as HTML in the response.
Googlebot renders JS, so classic SEO is only half-broken; the answer engines are fully blind.

**Root cause #2:** the site loses to its own LinkedIn profile. LinkedIn has the
authority; the site has none. LinkedIn is the amplifier, the site must be the anchor.

**Entity contradiction found (measured):** site says role *"Growth Leader / AI Growth &
Digital Strategy Lead"* at *"DIGIT AI"*; LinkedIn says *"Head of Digital"* at
*"DigitAI"*, headline *"Driving digital innovation with AI and UX expertise"*.
Sources that disagree produce low entity confidence, and low confidence produces no citation.

---

## Global Constraints (every task implicitly includes these)

- **Honesty rule (non-negotiable):** no invented metrics, logos, testimonials, demos,
  or credentials. Every number and quote must trace to a verified source or to Ajay
  directly. If a fact is unavailable, the element is omitted, not approximated.
- **Rosh Elevators stays excluded.** No mention anywhere, in copy, schema, or metadata.
- **One source of truth:** content lives in `src/data.ts` (+ `src/seo.ts` from SP1).
  Components and the prerenderer both read from them; no string is duplicated between
  `App.tsx` and the build output.
- **Images must not be Git LFS pointers.** `*.png`/`*.jpg` are LFS-tracked; every
  site-critical image needs an explicit raw exception appended to `.gitattributes`
  (LFS exceptions must be at the END of the file — later `*.png` rules override earlier ones).
- **No new runtime dependencies** unless a sub-plan names one explicitly and justifies it.
- **`prefers-reduced-motion: reduce` is respected** by every animation added (framer
  `MotionConfig reducedMotion="user"` is already wired; CSS-only animations need the
  global backstop or an explicit media query).
- **Bundle budget:** main JS stays ≤ 420KB uncompressed (gzip ≤ 130KB). Anything
  heavier must be a lazy chunk.
- **Package manager is pnpm** (§`pnpm build`, `npx tsc --noEmit`). Repo is
  `"type": "module"` → ad-hoc node scripts must be `.mjs`/`.cjs`.
- **Verification is behavioural, never "looks right":** every task ends by running
  `pnpm build` + `node scripts/verify.mjs` (from SP1) and asserting on `dist/`, plus a
  live check on production where the task touches the deployed surface.
- **Deployment URLs are SSO-protected** (`ssoProtection: all_except_custom_domains`),
  so preview deployments cannot be tested anonymously — server-side features are
  verified on production after merge, or by temporarily disabling protection.
- Shell is **Windows PowerShell**: `Remove-Item` has no `-File` parameter, there is no
  `tail`, and nested quotes in `ssh`/inline commands mangle — write script files instead.

---

## Review Focus (uncovered input classes most likely to bite a real user)

The spec is silent on these; each one gets a test added to the owning task.

1. **A crawler with JavaScript disabled** — expects the full page content in the first
   byte. Owning task's test: fetch the deployed URL with a bot User-Agent and assert
   the h1, all 9 project names, and the FAQ questions appear in the raw HTML.
2. **A user on a slow connection / mid-range phone** — expects the page to be usable
   before images finish. Test: all images have explicit `width`/`height` (no CLS) and
   below-fold images are `loading="lazy"`.
3. **A `prefers-reduced-motion: reduce` user** — expects no motion, and expects the
   content to still be present and readable. Test: emulated reduced motion renders all
   sections, content present, zero transforming elements that move on their own.
4. **A bot submitting the contact form** — expects to be rejected without learning the
   rule. Test: honeypot filled → `200` but **no row inserted**; 6th request in an hour
   from one IP → `429`.
5. **A missing/degenerate asset** — a project with no screenshot, an image that 404s,
   a case study with no copy. Test: the card renders a styled fallback, no broken-image
   icon, no layout collapse; the build fails loudly if a referenced asset is absent.

---

## Sub-plans (each produces working, testable software on its own)

| # | Sub-plan | Ships | Depends on |
|---|---|---|---|
| **1** | **Astro migration + AEO/SEO/GEO foundation** — written in full at `2026-10-12-sp1-astro-migration.md` | Zero-JS-by-default Astro site: all content as static HTML for non-JS crawlers; `Person`/`FAQPage`/`WebSite` schema; name-forward title; quick-facts + FAQ + results `<table>` visible; `robots.txt`, `llms.txt`, sitemap, OG image; React/framer/recharts/lucide/lenis **removed** (main JS 380 kB → < 30 kB, 437 kB chart chunk → 0); `scripts/parity.mjs` + `scripts/verify.mjs` harnesses | — |
| **2** | **Contact form** | `POST /api/contact` + Supabase `messages` table + Resend notification; validated, rate-limited, honeypot + timing gates; a11y-complete form UI in the Contact section | — (independent) |
| **3** | **Project visuals** | Real 1280×800 homepage captures (6 live sites) + GitHub OG cards (3 repo-only) + styled placeholder (Precious Jewels); card thumbnail layout, hover, link-on-image; committed raw (no LFS) | — |
| **4** | **Content depth** | 3 case-study pages at real `/case-study/<slug>/` URLs (multi-page build, prerendered); testimonials block; CV download; insights/writing block; video showcase; press/bio kit; extended results ledger | 1 (prerender + routes), 3 (screenshots) |
| **5** | **Measurement & polish** | GSC + Bing verification tags, Vercel Web Analytics + Speed Insights, the 12-prompt GEO panel doc, final a11y/perf audit, Core Web Vitals pass | 1 |

**Why this order:** SP1 is the gate — it makes the content readable, which is what
SP4 depends on and what makes any off-site effort pay off. SP2 and SP3 are
independent and can run in any order. SP5 is last because it measures everything else.

**Off-site work is not software** — it is a checklist in this file (below), because
it is Ajay's actions, not code.

---

## Decisions blocking execution

1. ~~**Architecture:** Vite + prerender, or Astro?~~ **DECIDED 2026-10-12: Astro.**
   Ajay chose Astro over the recommended Vite+prerender path, with subagent-driven
   execution. Consequence stated and accepted at decision time: the **Figma Make
   publish/edit loop stops working** (Figma Make expects a Vite React app at the repo
   root). Payoff: static HTML for non-JS crawlers, real `/case-study/<slug>/` routes,
   no hydration, main JS 380 kB → < 30 kB, the 437 kB Recharts chunk deleted.
   Execution plan: `2026-10-12-sp1-astro-migration.md`. Revert path (Vite + prerender):
   `2026-10-12-sp1-aeo-seo-geo-foundation.md`; the Vite app is preserved in git until
   migration Task 11 tags it `pre-astro-vite`.
2. **Testimonials:** real quotes available from named people, or omit the section
   entirely? Fake quotes are excluded by the honesty rule.
3. **Backlink credits:** which of the sites he built can Ajay actually edit
   (aura-makeover, ir4ubyram, vigilarebp, recytronics, erevival)? Each editable one is
   a free, topically-matched backlink with explicit author attribution.
4. **Domain:** keep `designjoom.com` (brand recognition, but the domain names a company
   while the site sells a person — an entity-ambiguity cost) or move to a name domain
   and 301. Recommendation: **keep**, and resolve ambiguity via schema `alternateName`
   + the canonical descriptor string, which SP1 already does.

---

## Off-site checklist (Ajay's actions, not code — SP5 measures the effect)

- [ ] LinkedIn: canonical title/employer spelling/descriptor aligned with the site
      (kills the contradiction in the baseline table above).
- [ ] LinkedIn: site URL in profile contact + Featured section.
- [ ] LinkedIn: publish each case study as a LinkedIn *article* linking its
      `/case-study/<slug>/` URL (LinkedIn is heavily crawled by LLMs).
- [ ] GitHub profile README: name, descriptor, links (GitHub is high-trust for models).
- [ ] Behance profile: name matches the canonical descriptor.
- [ ] Footer credit on every client site he controls — one line, links the site,
      binds person to work.
- [ ] Google Search Console + Bing Webmaster verified (verification tags shipped in SP1;
      **Bing matters for GEO specifically** — ChatGPT's browsing runs on Bing's index).
- [ ] Wikidata item — stretch goal; depends on independent press coverage to survive
      notability rules. Do not attempt without sources, it will be deleted.

---

## Deliberately excluded (and why)

- **Blog platform** — three stale posts read worse than no blog. LinkedIn articles
  (off-site checklist) cover the same need with none of the maintenance.
- **Directory / listicle backlinks** — harmful, not neutral.
- **Paid rank trackers** — GSC plus the 12-prompt GEO panel is sufficient at this scale.
- **`Article` schema on the profile page** — wrong type, invites spam signals.
- **hreflang for the country tags** — no translated content exists to point it at.
- **Admin UI for messages** — the Supabase table view is the inbox; a public read
  endpoint is an attack surface with no benefit.
- **CAPTCHA on day one** — honeypot + timing + rate limit first (SP2). Add Turnstile
  only if spam actually appears.
