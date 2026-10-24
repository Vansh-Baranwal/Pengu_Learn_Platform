# Pengu Learn Platform 🐧

Interactive learning platform and desktop suite designed for deep conceptual mastery, visual algorithm simulations, adaptive quests, and zero-distraction offline study.

## Core Features

- **Interactive Visual Labs**: Real-time sandboxes for science, algorithms, and logic.
- **Adaptive Quest Engine**: Gamified difficulty progression tuning to learner retention.
- **Zero-Cloud Offline Desktop Suite**: Fast native performance on Windows, macOS, and Linux.
- **Gated Product Downloads**: UPI QR payment submission with manual review, and free access using promo code PENGUNEW.
- **Interactive Pengu Buddy**: Cheerful mascot providing context-sensitive tips and guidance.

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy the web app to Vercel
1. Import this repository in Vercel and keep the project root set to the repository root.
2. Vercel uses `vercel.json` to install with `npm ci`, run `npm run build`, publish `dist`, and route client-side pages back to `index.html`.
3. The QR is served from `public/payment-qr.jpeg`. Entering the `PENGUNEW` promo code redirects to its Google Drive file.
4. Redeploy after changing environment variables. Vite embeds `VITE_*` values during the build.

No Google Auth, Render service, Supabase setup, or promo download environment variable is needed for this panel.

## Tech Stack

- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Icons**: Lucide React
- **Typography**: Sora, Urbanist, Georgia Pro


## FalkorDB usage

FalkorDB uses the Redis protocol on port `6379`. Open `http://127.0.0.1:3000` for the FalkorDB Browser and run Cypher against graph `socratic_tutor`. For example:

```cypher
MATCH (n)
RETURN labels(n) AS labels, count(*) AS count
```

```cypher
MATCH (s:Student {id: 'local-user'})-[m:MASTERED]->(c:Concept)
RETURN c.id AS concept, m.score AS mastery, m.due_date AS due_date
ORDER BY mastery ASC
```

```cypher
MATCH (s:Student {id: 'local-user'})-[:ATTEMPTED]->(a:Attempt)-[:FOR_LESSON]->(l:Lesson)
OPTIONAL MATCH (a)-[:MADE_MISTAKE]->(m:Mistake)
RETURN a.timestamp, l.title, a.passed, m.id
ORDER BY a.timestamp DESC
```

Python code can use the same graph through the repository helpers:

```python
from graph.schema import get_client, get_graph, init_schema

client = get_client(host="localhost", port=6379)
graph = get_graph(client, graph_name="socratic_tutor")
init_schema(graph)  # safe to call more than once
result = graph.query("MATCH (c:Concept) RETURN c.id, c.name LIMIT 10")
print(result.result_set)
```

Run that snippet from `daemon/` (or set `PYTHONPATH=daemon` from the repository root). `daemon/graph/ingest.py` contains the lesson ingestion, attempt recording, and mastery update functions. Lesson ingestion reads each lesson's `lesson.yaml` and optional `README.md`. The UI reads progress and graph data through the daemon API; normally, the app handles these writes for you.

Useful lifecycle commands:

```sh
docker compose logs -f falkordb
docker compose stop falkordb
docker compose down                 # retains the named data volume
docker compose down -v              # deletes graph data in the volume
```

## Graph data model

Node identity is the `id` property. Schema initialization creates uniqueness constraints for `Student`, `Lesson`, `Concept`, and `Mistake`, and a vector index on `Chunk.embedding` (768 dimensions, cosine similarity).

| Node | Role and typical properties |
| --- | --- |
| `Student` | Learner profile: `id`, `name` |
| `Lesson` | Curriculum unit: `id`, `title`, `track`, `difficulty`, `estimated_minutes`, `languages` |
| `Concept` | Skill or topic: `id`, `name`, `track` |
| `Mistake` | Recognized misconception: `id`, `signals`, `seed_questions` |
| `Chunk` | Text excerpt for retrieval: `id`, `content`, `lesson_id`, `chunk_index`, optional `embedding` |
| `Attempt` | A student submission: `id`, `student_id`, `lesson_id`, `passed`, `timestamp` |

Relationships encode curriculum and learning history:

| Relationship | Direction | Meaning |
| --- | --- | --- |
| `REQUIRES` | `Concept → Concept` | The source concept depends on the target prerequisite |
| `TEACHES` | `Lesson → Concept` | The lesson teaches the concept |
| `REQUIRES` | `Lesson → Concept` | The lesson assumes the prerequisite concept |
| `INVOLVES` | `Mistake → Concept` | The misconception relates to this concept |
| `EXPLAINS` | `Chunk → Lesson` | The chunk contains explanatory material for the lesson |
| `ATTEMPTED` | `Student → Attempt` | The learner made this attempt |
| `FOR_LESSON` | `Attempt → Lesson` | The attempt belongs to the lesson |
| `MADE_MISTAKE` | `Attempt → Mistake` | The attempt exhibited this mistake (optional) |
| `MASTERED` | `Student → Concept` | Mastery state stored on the relationship |

`MASTERED` relationships store `score` (0–1), `streak`, `review_count`, `last_reviewed`, `due_date`, `interval_hours`, and `last_passed`. A passing result adds 0.10 and a failure subtracts 0.15, clamped to the 0–1 range; the graph ingestion code calculates the next review time from the score and successful recall streak.
