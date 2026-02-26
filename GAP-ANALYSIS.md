# Gap Analysis: Docs vs. Implementation

> Audit date: 2026-02-26
> Docs repo: karmaverse-v2 (14 docs + 1 API spec)
> Engine repo: karmaverse-engine (15 tools, 4 agents, MCP + REST)

---

## Summary

| Area | Spec'd | Built | Parity | Severity |
|------|--------|-------|--------|----------|
| Ground tools (7) | 7 | 7 | ✅ 100% | — |
| Decide tools (4) | 4 | 4 | ✅ 100% | — |
| Reflect tools (4) | 4 | 4 | ✅ 100% | — |
| Reputation tools (1) | 1 | 0 | ❌ 0% | 🟡 Medium |
| MCP server | Yes | Yes | ✅ stdio only | 🟡 Medium |
| REST API endpoints | ~30 | 14 | 🟡 ~47% | 🔴 High |
| Content: Gita verses | 701 | 7 | 🔴 1% | 🔴 High |
| Content: Stoic passages | 100 | 6 | 🔴 6% | 🔴 High |
| Content: Buddhist verses | 50+ | 4 | 🔴 8% | 🔴 High |
| Content: Yoga Sutras | 30+ | 3 | 🔴 10% | 🔴 High |
| Content: Affirmations | 140 (20×7) | 14 (2×7) | 🔴 10% | 🟡 Medium |
| Content: Meditations | 21 (7×3) | 5 | 🟡 24% | 🟡 Medium |
| Content: Breathwork | 6 | 6 | ✅ 100% | — |
| Content: Biases | 12 | 12 | ✅ 100% | — |
| Auth/rate limiting | Spec'd | None | ❌ 0% | 🟡 Medium |
| x402 payments | Spec'd | None | ❌ 0% | 🟢 Low (Phase 2) |
| Database/persistence | Postgres/Supabase | In-memory Map | 🔴 0% | 🔴 High |
| MCP Resources | 5 spec'd | 0 | ❌ 0% | 🟡 Medium |
| MCP Prompts | 3 spec'd | 0 | ❌ 0% | 🟡 Medium |
| SSE transport | Spec'd | None | ❌ 0% | 🟢 Low |
| Telegram bot | Spec'd | None | ❌ 0% | 🟢 Low (Phase 2) |
| MoltBook agent | Spec'd | None | ❌ 0% | 🟢 Low (Phase 2) |

---

## 🔴 CRITICAL GAPS (must fix for a credible Phase 1)

### 1. Content Volume — 20 verses vs. 880+ spec'd

**Spec (05-content-strategy.md):**
- Gita: 701 verses (full text exists in v1)
- Stoic: 100 curated passages
- Buddhist: 50+ (Dhammapada core + key teachings)
- Yoga Sutras: 30+ key sutras
- Affirmations: 140 (20 per category × 7 categories)
- Total: ~1,000+ content items

**Built:**
- Gita: 7 verses
- Stoic: 6 passages
- Buddhist: 4 verses
- Yoga Sutras: 3 sutras
- Affirmations: 14 (2 per category × 7)
- Total: 34 items

**Impact:** An agent calling `search_wisdom` with any non-trivial query will get poor results. The current 23 verses are a demo set, not a viable product. The search/matching logic works, but content is the product.

**Fix:** Import the existing 701 Gita verses from v1 database. Curate minimum 30 Stoic, 20 Buddhist, 15 Yoga Sutras. Expand affirmations to 10 per category minimum.

### 2. No Persistence — In-memory decisions evaporate on restart

**Spec (02-technical-architecture.md):**
- Supabase/PostgreSQL for decisions, outcomes, patterns
- Full data model spec'd in 00-vision.md (decisions, decision_outcomes, user_patterns, reflections tables)

**Built:**
- `Map<string, any>` in `log-decision.ts` — all data lost on process restart
- No database connection at all

**Impact:** The entire Decide → Reflect cycle is broken in production. A user logs a decision, the server restarts, the decision is gone. Pattern detection and reflections become meaningless.

**Fix:** Connect to Neon Postgres (DATABASE_URL is available). Create tables matching the spec'd schema. Replace in-memory Map with database queries.

### 3. Missing REST API Endpoints — 14/~30 built

**Spec'd but not built:**

| Missing Endpoint | Description |
|-----------------|-------------|
| `GET /api/v2/wisdom/verse/:tradition/:reference` | Path-param verse lookup |
| `GET /api/v2/wisdom/traditions` | List traditions with metadata |
| `GET /api/v2/wisdom/cross-tradition/:concept` | Cross-tradition concept comparison |
| `GET /api/v2/breathwork/exercises` | List all exercises |
| `GET /api/v2/breathwork/exercise/:slug` | Get exercise by slug |
| `GET /api/v2/breathwork/recommend` | Auto-recommend exercise |
| `GET /api/v2/meditation/styles` | List meditation styles |
| `GET /api/v2/affirmation/categories` | List affirmation categories |
| `GET /api/v2/decide/decisions/:user_id` | List user's decisions |
| `GET /api/v2/decide/decision/:id` | Get specific decision |
| `GET /api/v2/reflect/history/:user_id` | Full reflection history |
| `GET /api/v2/karma-score/:user_id` | Karma Score endpoint |
| `GET /api/v2/usage` | Usage stats |
| `GET /api/v2/health` | Health check |
| `POST /api/v2/api-keys` | API key management |
| `GET /api/v2/gita/chapters` | Legacy Gita endpoints |
| `GET /api/v2/gita/verse/:chapter/:verse` | Legacy Gita verse |

**Impact:** API consumers following the docs will hit 404s. The core CRUD flow works (create framework, log decision, log outcome, get reflections) but browsing/listing endpoints are missing.

---

## 🟡 MEDIUM GAPS (should fix for quality)

### 4. MCP Tool Schema Mismatches

**get_verse:**
- Spec has `persona` param (teacher/friend/monk) for interpretation style → Not implemented
- Spec has `user_context` param for personalized interpretation → Not implemented

**get_meditation:**
- Spec has `style` param with 6 options (guided, body_scan, loving_kindness, visualization, breath_focus, gratitude) → Built with `category` instead (morning, stress_relief, focus, gratitude, body_scan)
- Spec has `time_of_day` param → Not implemented
- Spec response has structured script (intro/body/closing) → Built returns flat script string

**get_breathing_exercise:**
- Spec has `type` param selecting specific technique → Built uses `useCase` + `slug` (actually better UX)
- Spec has `duration_minutes` param adjusting cycle count → Not implemented
- Spec response has `preparation` and `tips` fields → Not implemented

**get_affirmation:**
- Spec has `letting_go` category → Not in built affirmation categories
- Spec has `user_context` for personalization → Not implemented
- Spec response has `inspired_by` with connection text → Built returns simpler structure

**mindfulness_check_in:**
- Spec has `energy_level` with 5 levels (very_low, low, medium, high, very_high) → Built has 3 (low, medium, high)
- Spec has `time_available_minutes` param → Not implemented

**search_wisdom:**
- Spec response has `original_text` (Sanskrit), `relevance_score` (numeric), `persona`-adapted interpretation → Not implemented
- Built has `relevanceReason` (string) instead of numeric score

**detect_biases:**
- Spec response has `confidence` (numeric per bias) → Built has `severity` (low/medium/high) — different approach but reasonable

**detect_patterns:**
- Spec requires 5+ decisions → Built requires 3+ (actually more usable, but doesn't match spec)
- Spec has `focus_area` param (career, relationships, etc.) → Not implemented

**generate_reflection:**
- Spec has `include_wisdom` param → Not implemented (always includes)
- Spec response has `mindfulness_activity` tracking → Not implemented

### 5. Missing MCP Resources (5 spec'd)

```
karmaverse://traditions          → List traditions
karmaverse://gita/chapters       → Chapter index
karmaverse://gita/verses/{ch}/{v} → Verse access
karmaverse://breathwork/catalog  → Exercise catalog
karmaverse://meditation/styles   → Style catalog
```

None implemented. Resources let agents browse data without tool calls.

### 6. Missing MCP Prompts (3 spec'd)

```
morning_routine      → Complete morning mindfulness routine
stress_intervention  → Immediate stress relief combo
evening_reflection   → End-of-day reflection
```

None implemented. Prompts are pre-built templates that make agent integration easier.

### 7. get_karma_score Tool Missing

**Spec (09-reputation-ethics.md + 03-mcp-server-spec.md):**
- Listed in the Complete Tool Index as Phase 4
- REST endpoint: `GET /api/v2/karma-score/:user_id`

**Built:** Karma Score is calculated INSIDE `generate_reflection` but not exposed as a standalone tool.

**Impact:** Agents can't check a user's Karma Score without generating a full reflection report.

### 8. No Auth/Rate Limiting

Spec describes 3 tiers (Free/Standard/Premium) with call limits. No auth middleware exists.

---

## 🟢 LOW PRIORITY GAPS (Phase 2+)

### 9. SSE Transport — Only stdio built
### 10. x402 USDC Payments — Spec'd but Phase 2
### 11. $KARMA Token Integration — Phase 2+
### 12. Telegram Bot — Phase 2
### 13. MoltBook Agent — Phase 2
### 14. ACP Integration — Phase 3
### 15. Layers 4-5 (Reputation, Ethics) — Phase 4-5
### 16. Embeddings/Semantic Search — Spec'd, not built (using keyword matching instead)

---

## What's BETTER Than Spec

Some things were built smarter than spec'd:

1. **Mastra framework** — Not in original spec. Agents, tool composition, and MCP for free.
2. **Unified Karma Engine agent** — All 15 tools in one agent. Spec described tools individually but not a unified orchestration agent.
3. **detect_patterns at 3 decisions** — More usable than the spec'd 5. Users get value sooner.
4. **Breathwork slug-based access** — Spec uses `type` param. Slug is more REST-friendly.
5. **93.7% test coverage** — Not spec'd at all. 129 tests across all layers.
6. **Hono API server** — Lightweight and fast. Spec assumed Express.

---

## Recommended Priority Order

1. **🔴 Database persistence** — Connect Neon Postgres, create schema, migrate from in-memory
2. **🔴 Content expansion** — Import Gita v1 data, curate minimum viable Stoic/Buddhist/Yoga corpus
3. **🔴 Missing REST endpoints** — Add the 15+ missing endpoints
4. **🟡 MCP schema alignment** — Add persona, user_context, time_of_day params
5. **🟡 get_karma_score tool** — Extract from generate_reflection into standalone
6. **🟡 MCP Resources + Prompts** — Add browseable data and pre-built templates
7. **🟡 Auth + rate limiting** — API key registration, tier enforcement
8. **🟢 SSE transport** — For remote MCP connections
9. **🟢 Embeddings** — Replace keyword matching with semantic search
