# Gap Analysis: Full Docs Audit vs. Implementation

> Audit date: 2026-02-26
> Docs reviewed: ALL 15 docs + specs/api-schema.md + brand/positioning.md
> Engine repo: karmaverse-engine (15 tools, 4 agents, MCP + REST)

---

## Executive Summary

The **tool architecture is correct** — all 15 Phase 1-3 tools exist and pass tests. The critical gaps are:
1. **No AI Interpreter layer** — spec calls for LLM-powered personalization; we return static text
2. **No database** — decisions vanish on restart
3. **Content is a demo set** — 34 items vs. 1,000+ spec'd
4. **Half the REST API missing** — 14/~30 endpoints
5. **No landing page** — fully spec'd 10-section page, not built

---

## LAYER-BY-LAYER PARITY

### ✅ Tool Count: MATCHING

| Layer | Spec'd Tools | Built | Match |
|-------|-------------|-------|-------|
| Ground | 7 | 7 | ✅ |
| Decide | 4 | 4 | ✅ |
| Reflect | 4 | 4 | ✅ |
| Reputation | 1 (`get_karma_score`) | 0 (embedded in `generate_reflection`) | ❌ |
| **Total** | **16** | **15 + 1 embedded** | 🟡 |

---

## 🔴 CRITICAL GAPS

### 1. AI Interpreter Layer — NOT BUILT

**Source:** `02-technical-architecture.md` §Layer 1, `03-mcp-server-spec.md`

The spec describes an **AI Interpreter** shared across all layers:

```
Input:  Raw verse (Gita 2.47) + user context ("anxious about deadline")
Output: Personalized interpretation connecting the verse to their specific situation
```

With 3 personas (Teacher/Friend/Monk) that change interpretation style.

**What's built:** Static pre-written interpretations. No LLM calls. No persona support. The `persona` and `user_context` params from the spec are completely absent.

**Impact:** Every tool returns the same canned interpretation regardless of user context. This is the difference between "a database lookup" and "an AI-powered wisdom engine."

**Fix:** Add an LLM interpretation layer that takes (verse + user context + persona) → personalized interpretation. Use Anthropic Claude via `ANTHROPIC_API_KEY` (available in env).

### 2. No Database Persistence

**Source:** `02-technical-architecture.md` §Data Layer (12 tables spec'd)

**Spec'd tables:**
```
gita_verses, user_profiles, user_sessions, user_favorites,
breathwork_exercises, meditation_templates, affirmations, wisdom_texts,
api_usage, decisions, decision_outcomes, user_patterns, reflections, karma_scores
```

**Built:** `Map<string, any>` in memory. All decisions, outcomes, patterns lost on restart.

**Fix:** Use Neon Postgres (`DATABASE_URL` available). Create minimum viable schema: `decisions`, `decision_outcomes`, `karma_scores`.

### 3. Content Volume — 34 items vs. 1,000+ spec'd

**Source:** `05-content-strategy.md`, `01-pivot-plan.md`

| Content Type | Spec'd | Built | Gap |
|-------------|--------|-------|-----|
| Gita verses | 701 (full text exists in v1 Supabase) | 7 | 99% missing |
| Stoic passages | 100 curated | 6 | 94% missing |
| Buddhist verses | 50+ (Dhammapada + teachings) | 4 | 92% missing |
| Yoga Sutras | 30+ key sutras | 3 | 90% missing |
| Affirmations | 140 (20 × 7 categories) | 14 (2 × 7) | 90% missing |
| Meditation templates | 21 (7 categories × 3 durations) | 5 | 76% missing |
| Breathwork | 6 | 6 | ✅ |
| Cognitive biases | 12 | 12 | ✅ |

**Additional content gaps from `05-content-strategy.md`:**
- Missing `letting_go` affirmation category (spec has 8 categories, built has 7)
- Missing `loving_kindness` and `evening_wind_down` meditation categories
- Breathwork exercises missing: `preparation`, `tips`, `science`, `contraindications`, `cycles_by_duration` fields
- No cross-tradition concept mapping (Gita 2.47 ↔ Stoic Dichotomy of Control ↔ Buddhist non-attachment)
- No Gita Paths (curated verse sequences: "Dealing with Loss", "Finding Purpose", etc.)

### 4. Missing REST API Endpoints — 14/~30

**Source:** `specs/api-schema.md`, `07-decide-module.md`, `08-reflect-module.md`

**Missing endpoints:**

| Endpoint | Source Doc |
|----------|-----------|
| `GET /api/v2/wisdom/verse/:tradition/:reference` | api-schema.md |
| `GET /api/v2/wisdom/traditions` | api-schema.md |
| `GET /api/v2/wisdom/cross-tradition/:concept` | api-schema.md |
| `GET /api/v2/breathwork/exercises` | api-schema.md |
| `GET /api/v2/breathwork/exercise/:slug` | api-schema.md |
| `GET /api/v2/breathwork/recommend` | api-schema.md |
| `POST /api/v2/meditation/generate` (structured response) | api-schema.md |
| `GET /api/v2/meditation/styles` | api-schema.md |
| `POST /api/v2/affirmation/generate` | api-schema.md |
| `GET /api/v2/affirmation/categories` | api-schema.md |
| `POST /api/v2/check-in` (alternate path) | api-schema.md |
| `GET /api/v2/decide/decisions/:user_id` | 07-decide-module.md |
| `GET /api/v2/decide/decision/:id` | 07-decide-module.md |
| `GET /api/v2/reflect/history/:user_id` | 08-reflect-module.md |
| `GET /api/v2/karma-score/:user_id` | api-schema.md |
| `GET /api/v2/health` | api-schema.md |
| `GET /api/v2/gita/chapters` | api-schema.md (legacy) |
| `GET /api/v2/gita/chapter/:number` | api-schema.md (legacy) |
| `GET /api/v2/gita/verse/:chapter/:verse` | api-schema.md (legacy) |
| `GET /api/v2/gita/paths` | api-schema.md (legacy) |

### 5. Landing Page — NOT BUILT

**Source:** `10-landing-page.md` — Fully spec'd 10-section page:
1. Hero with CTA
2. 5-layer Karma Engine visualization
3. Quick Start (3-line install)
4. Live Demo (interactive API call)
5. 16 Tools catalog
6. Use Cases (4 agent personas)
7. Pricing (Free/Standard/Premium)
8. $KARMA Token info
9. Ecosystem (5 distribution channels)
10. Footer

**Technical spec:** Next.js or Astro, Tailwind, dark theme, Lighthouse 95+

---

## 🟡 MEDIUM GAPS

### 6. MCP Tool Schema Mismatches

| Tool | Missing Params (from spec) | Impact |
|------|--------------------------|--------|
| `get_verse` | `persona` (teacher/friend/monk), `user_context` | No personalized interpretations |
| `get_meditation` | `style` (6 options vs 5 categories), `time_of_day`, structured `script` response (intro/body/closing vs flat string) | Meditation response format wrong |
| `get_breathing_exercise` | `duration_minutes` (adjusts cycles), `preparation`, `tips` in response | Missing helpful guidance |
| `get_affirmation` | `user_context` for personalization, `inspired_by` with connection text in response | Simpler than spec'd |
| `mindfulness_check_in` | `energy_level` has 5 levels in spec (very_low/low/medium/high/very_high) vs 3 built, `time_available_minutes` | Less granular |
| `search_wisdom` | `persona`, `original_text` (Sanskrit), numeric `relevance_score` (0-1) vs string reason | Missing fields |
| `detect_patterns` | `focus_area` param (career/relationships/health/financial/personal_growth/all) | Can't filter by life area |
| `generate_reflection` | `include_wisdom` param, `mindfulness_activity` tracking in response | Missing tracking data |
| `get_pending_reflections` | `total_completed`, `completion_rate` in response | Missing completion metrics |

### 7. `get_karma_score` — Standalone Tool Missing

**Source:** `09-reputation-ethics.md`, `03-mcp-server-spec.md` (tool index), `10-landing-page.md` (lists 16 tools)

Spec'd as standalone MCP tool with:
- Full score with 5-component breakdown
- Level labels with exact thresholds: 0-20 Beginning, 21-40 Awakening, 41-60 Growing, 61-80 Flourishing, 81-100 Mastery
- `include_breakdown` param
- `next_milestone` and `suggestion` in response

**Built:** Score calculation exists INSIDE `generate_reflection` but uses different level thresholds (0/25/45/65/85 vs spec's 0/21/41/61/81). Not exposed as standalone tool.

### 8. MCP Resources (5 spec'd, 0 built)

**Source:** `03-mcp-server-spec.md` §Resources

```
karmaverse://traditions         — List available traditions
karmaverse://gita/chapters      — Chapter index
karmaverse://gita/verses/{ch}/{v} — Specific verse
karmaverse://breathwork/catalog — Exercise catalog
karmaverse://meditation/styles  — Style catalog
```

### 9. MCP Prompts (3 spec'd, 0 built)

**Source:** `03-mcp-server-spec.md` §Prompts

```
morning_routine       — verse + intention + breathing + affirmation
stress_intervention   — breathing + grounding verse + short meditation
evening_reflection    — gratitude + calming verse + wind-down breathing
```

### 10. No Auth / Rate Limiting / Error Codes

**Source:** `03-mcp-server-spec.md` §Rate Limits, `specs/api-schema.md` §Authentication

- 3 tiers: Free (10/day), Standard (1,000/day), Premium (10,000/day)
- API key registration
- Structured error format with codes: `RATE_LIMIT_EXCEEDED`, `UNAUTHORIZED`, `VERSE_NOT_FOUND`, etc.
- `quota` object in responses showing usage

### 11. Karma Score Level Thresholds DON'T MATCH

**Spec (09-reputation-ethics.md):** 0-20, 21-40, 41-60, 61-80, 81-100
**Built:** 0, 25, 45, 65, 85

### 12. Design System — NOT IMPLEMENTED

**Source:** `11-ui-ux-design-system.md` — Full design system spec:
- Color tokens (layer-mapped: Ground=Emerald, Decide=Amber, Reflect=Indigo, Reputation=Purple, Ethics=Rose)
- Typography (Inter + JetBrains Mono)
- Spacing scale (4px base)
- Component specs (cards, badges, code blocks, tool cards)
- Dark theme by default

---

## 🟢 LOW PRIORITY GAPS (Phase 2+)

| # | Gap | Phase | Source Doc |
|---|-----|-------|------------|
| 13 | SSE MCP transport | Phase 2 | 02-technical-architecture.md |
| 14 | x402 USDC payments | Phase 1-2 | 06-token-economics.md |
| 15 | $KARMA token verification | Phase 2+ | 06-token-economics.md |
| 16 | Telegram bot | Phase 2 | 01-pivot-plan.md, 12-user-flows.md |
| 17 | MoltBook agent | Phase 2 | 01-pivot-plan.md |
| 18 | ACP integration | Phase 3 | 04-acp-integration.md |
| 19 | npm publishing + registry submissions | Phase 1 | 01-pivot-plan.md |
| 20 | Embeddings + semantic search (pgvector) | Phase 2 | 02-technical-architecture.md |
| 21 | User profiles + streaks + favorites | Phase 2 | 02-technical-architecture.md |
| 22 | API usage tracking | Phase 2 | 02-technical-architecture.md |
| 23 | Gita Paths (curated sequences) | Phase 2 | 05-content-strategy.md |
| 24 | Cross-tradition concept mapping | Phase 2 | 05-content-strategy.md |
| 25 | Agent Karma Score (for ACP) | Phase 4 | 09-reputation-ethics.md |
| 26 | Ethics Layer (Layer 5) | Phase 5 | 09-reputation-ethics.md |
| 27 | Journaling prompts module | Phase 4 | 01-pivot-plan.md |
| 28 | Sleep & grounding module | Phase 4 | 01-pivot-plan.md |

---

## ✅ WHAT'S CORRECT / BETTER THAN SPEC

1. **Mastra framework** — Not in spec. Gives us agents, tool composition, MCP server for free.
2. **4 Mastra agents** — Spec describes tools individually. We have orchestration agents.
3. **129 tests, 93.7% coverage** — Not spec'd. Solid engineering foundation.
4. **Hono API server** — Lightweight, fast. Spec assumed Supabase Edge Functions.
5. **Breathwork slug-based access** — More REST-friendly than spec's `type` param.
6. **detect_patterns at 3 decisions** — More usable than spec's 5 threshold.
7. **tsup build pipeline** — Clean ESM output with type declarations.
8. **GitHub repo** — Code is version-controlled and pushed.

---

## PRIORITY FIX ORDER

### Must-fix for credible Phase 1:

1. **🔴 AI Interpreter** — Add LLM personalization layer with persona support
2. **🔴 Database** — Connect Neon Postgres, create schema, migrate from in-memory
3. **🔴 Content expansion** — Import v1 Gita data, curate 200+ items minimum
4. **🔴 Missing REST endpoints** — Add the 20 missing routes
5. **🔴 `get_karma_score` standalone tool** — Extract + fix level thresholds
6. **🔴 Landing page** — Build the spec'd 10-section page

### Should-fix for quality:

7. **🟡 MCP tool schema alignment** — Add all missing params
8. **🟡 Structured meditation response** — intro/body/closing format
9. **🟡 MCP Resources + Prompts** — 5 resources + 3 prompts
10. **🟡 Auth + rate limiting** — API key + tier enforcement
11. **🟡 Error code standardization** — Match spec'd error format
12. **🟡 Design system implementation** — For landing page
