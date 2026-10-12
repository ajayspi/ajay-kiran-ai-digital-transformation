# GEO prompt panel

Answer engines do not rank pages; they *answer* questions and cite what they trust.
This panel is the only honest way to know whether that is happening: 12 fixed prompts,
asked monthly, logged by hand. No paid rank tracker — the signal is the citation, and
you can read it yourself.

**Run it monthly, on the 1st.** Ask each prompt as if you were a person (no site name,
no URL in the prompt — that would bias the answer). Log exactly what came back.

---

## The 12 prompts

### Name / entity resolution (4)

These test whether the engines resolve "A V Ajay Kiran" to *this* person. Baseline
2026-10-12: LinkedIn was the only result; this site was never cited.

1. Who is A V Ajay Kiran?
2. A V Ajay Kiran AI growth leader
3. Ajay Kiran digital transformation Hyderabad
4. What does A V Ajay Kiran do?

### Discovery / category queries (8)

These test whether the site surfaces for category-shaped searches, alongside larger
incumbents. These are the queries a client or recruiter would actually type.

5. AI growth leaders in Hyderabad
6. AI + UX transformation consultants UAE
7. digital transformation consultants India e-waste
8. AI growth consultant for pharma
9. UX strategist for AI products
10. best AI growth case studies
11. who does AI video automation
12. AI workflow architects India

---

## Log

| Date | Engine | Prompt # | Cited? | Quoted phrase | URL cited |
|---|---|---|---|---|---|
| 2026-10-12 | ChatGPT | 1–4 | No | — | LinkedIn only; site never cited |
| 2026-10-12 | Perplexity | 1–4 | No | — | LinkedIn only; site never cited |
| 2026-10-12 | Google AI Overview | 1 | No | — | LinkedIn |
| | | | | | |

Engine names in use: ChatGPT, Perplexity, Gemini, Microsoft Copilot, Google AI Overview.
Log per engine per prompt — an engine that cites LinkedIn while another cites the site
tells you more than a single blended answer.

---

## What counts as a win

- **Entity resolution (1–4):** the site is cited *and* the answer attributes the right
  role, company and location. A citation with the wrong company is worse than none —
  it is a wrong entity.
- **Discovery (5–12):** the site appears at all. Position matters less than presence.

## What to do when it does not show up

Ranked by expected effect, cheapest first:

1. **LinkedIn alignment** — the site says "Growth Leader / AI Growth & Digital Strategy
   Lead" at "DIGIT AI"; LinkedIn says "Head of Digital" at "DigitAI". Sources that
   disagree produce low confidence, and low confidence produces no citation. Pick one
   and make both match. This is the single highest-value off-site action.
2. **Backlinks from work you built** — a one-line credit with your name linking the site,
   on any client site you control (aura-makeover, ir4ubyram, vigilarebp, recytronics,
   erevival). Topically matched, explicit author attribution.
3. **Bing Webmaster Tools** — matters specifically for GEO: ChatGPT's browsing runs on
   Bing's index. Verify the site there even if you only care about Google for classic SEO.
4. **GitHub profile README** — high-trust for language models, and cheap.
5. **Case studies as LinkedIn articles** — LinkedIn is heavily crawled; each article
   links its `/case-study/<slug>/` URL.

## Do not

- Buy backlinks or guest-post on directories. Harmful, not neutral.
- Stuff the FAQ with questions nobody asks. One page of genuinely useful answers beats
  forty generated ones, and generated ones are detectable.
- Serve content to crawlers that users cannot see. The FAQ and results table on the site
  are visible for exactly this reason.
