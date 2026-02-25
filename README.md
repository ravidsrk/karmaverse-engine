# @karmaverse/engine

> The Karma Engine — action, consequence, and growth intelligence for AI agents.
>
> Built with [Mastra](https://mastra.ai) — the TypeScript AI agent framework.

## What Is This

15 tools across 3 layers, exposed via MCP and REST API. Any AI agent can plug into KarmaVerse to give their users:

- **Ground** 🧘 — Mindfulness, breathwork, meditation, wisdom from 4 traditions
- **Decide** 🧭 — Decision frameworks, cognitive bias detection, wisdom counsel
- **Reflect** 🪞 — Outcome tracking, pattern detection, reflection reports

## Quick Start

### MCP Server (Claude / OpenClaw / Cursor)

```json
{
  "mcpServers": {
    "karmaverse": {
      "command": "npx",
      "args": ["tsx", "src/mcp/stdio.ts"]
    }
  }
}
```

### REST API

```bash
# Start the API server
npx tsx src/api/start.ts

# Verse of the day (no auth)
curl http://localhost:3737/api/v2/verse-of-day

# Wisdom search
curl "http://localhost:3737/api/v2/wisdom/search?q=anxiety&mood=anxious"

# Mindfulness check-in
curl -X POST http://localhost:3737/api/v2/mindfulness/check-in \
  -H "Content-Type: application/json" \
  -d '{"mood":"anxious","energy":"high","context":"deadline pressure"}'

# Decision framework
curl -X POST http://localhost:3737/api/v2/decide/framework \
  -H "Content-Type: application/json" \
  -d '{"decision":"Should I quit my job?","options":["Quit","Stay"]}'
```

## Architecture

```
┌─────────────────────────────────────────┐
│          DISTRIBUTION LAYER              │
│                                          │
│  ┌──────────┐  ┌──────────┐             │
│  │ MCP      │  │ REST API │             │
│  │ Server   │  │ (Hono)   │             │
│  │ (stdio)  │  │ Port 3737│             │
│  └────┬─────┘  └────┬─────┘             │
│       └──────┬───────┘                   │
└──────────────┼───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│          MASTRA AGENT LAYER              │
│                                          │
│  ┌────────────┐ ┌────────────┐           │
│  │ Ground     │ │ Decide     │           │
│  │ Agent      │ │ Agent      │           │
│  └────────────┘ └────────────┘           │
│  ┌────────────┐ ┌────────────┐           │
│  │ Reflect    │ │ Karma      │           │
│  │ Agent      │ │ Engine     │ ← unified │
│  └────────────┘ └────────────┘           │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│          15 MASTRA TOOLS                  │
│                                          │
│  Ground (7)  │ Decide (4)  │ Reflect (4) │
│  ───────────   ──────────   ──────────── │
│  search_wisdom  create_framework  log_outcome    │
│  get_verse      detect_biases     detect_patterns│
│  get_meditation log_decision      gen_reflection │
│  get_breathing  get_counsel       get_pending    │
│  get_affirmation                                 │
│  check_in                                        │
│  verse_of_day                                    │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│          CURATED CONTENT                  │
│                                          │
│  23 wisdom verses (4 traditions)          │
│  6 breathwork exercises                   │
│  14 affirmations                          │
│  5 meditation templates                   │
│  12 cognitive biases                      │
└──────────────────────────────────────────┘
```

## 15 Tools

### Ground Layer 🧘

| Tool | Description |
|------|-------------|
| `search_wisdom` | Search across 4 traditions by query, mood, or topic |
| `get_verse` | Fetch specific verse with interpretation |
| `get_meditation` | Generate guided meditation script |
| `get_breathing_exercise` | Structured breathwork with step-by-step timing |
| `get_affirmation` | Context-aware daily affirmation |
| `mindfulness_check_in` | Complete grounding: breathing + wisdom + affirmation |
| `verse_of_the_day` | Daily rotating wisdom verse |

### Decide Layer 🧭

| Tool | Description |
|------|-------------|
| `create_decision_framework` | Multi-lens analysis: values, fear/growth, regret, reversibility |
| `detect_biases` | Scan reasoning for 12 cognitive biases |
| `log_decision` | Store decision for future reflection |
| `get_wisdom_counsel` | Cross-tradition perspectives on a dilemma |

### Reflect Layer 🪞

| Tool | Description |
|------|-------------|
| `log_outcome` | Record what actually happened |
| `detect_patterns` | Find recurring behavioral patterns |
| `generate_reflection` | Weekly/monthly/quarterly reflection reports |
| `get_pending_reflections` | List decisions due for review |

## Mastra Agents

4 agents with different scopes:

| Agent | Tools | Use Case |
|-------|-------|----------|
| `groundAgent` | 7 Ground tools | Mindfulness-focused interactions |
| `decideAgent` | 4 Decide + 1 Ground | Decision support with grounding |
| `reflectAgent` | 4 Reflect + 1 Ground | Reflection and growth tracking |
| `karmaEngineAgent` | All 15 tools | Full Karma Cycle orchestration |

## Content

### Wisdom Traditions (23 verses)
- **Bhagavad Gita** (7): Duty, action, non-attachment, dharma
- **Stoic Philosophy** (6): Control, acceptance, virtue, resilience
- **Buddhist Wisdom** (4): Mindfulness, impermanence, suffering
- **Yoga Sutras** (3): Mind control, practice, clarity

### Breathwork (6 exercises)
Box Breathing, 4-7-8 Relaxation, Coherent 5-5, Kapalabhati, Alternate Nostril, Belly Breathing

### Cognitive Biases (12)
Sunk Cost, Status Quo, Confirmation, Anchoring, Loss Aversion, Recency, Availability, Bandwagon, Dunning-Kruger, Planning Fallacy, Hindsight, Framing Effect

## Development

```bash
npm install
npm run test        # Run all 15 tools
npm run dev         # Dev server with watch
npm run mcp         # Start MCP server (stdio)
npm run build       # Build with tsup
```

## Tech Stack

- **Framework:** [Mastra](https://mastra.ai) 1.x — agents, tools, MCP
- **Runtime:** Node.js 22 / TypeScript
- **MCP:** `@mastra/mcp` — stdio transport
- **API:** Hono (lightweight HTTP framework)
- **Build:** tsup (fast ESM bundler)
- **Validation:** Zod schemas on all inputs/outputs
