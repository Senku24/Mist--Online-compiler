# Mist

- Mist is a focused online compiler for writing, running, and inspecting code in a clean browser workspace.
- Supports multiple languages.
- Redis queue ──► Execution worker runtime.
- Submit a snippet, execute it through the appropriate runtime, and get the result back in the console.

## Stack

- Frontend: React 19, TypeScript, Bun, Tailwind CSS, Lucide
- API: Express 5, TypeScript, Bun
- Queue: Redis
- Persistence: PostgreSQL with Prisma Contract
- Runtimes: Node.js, Python 3, and g++
- Database: Prisma 8 ,PostgreSQL

## Architecture

```text
Browser
   │  POST /submition
   ▼
Express API ──► Redis queue ──► Execution worker
   ▲                                  │
   └──── GET /submition/:id ◄─────────┘
                    │
                PostgreSQL
```

The API records each submission as `Processing` and pushes it to Redis. The worker executes JavaScript, TypeScript, Python, or C++, then persists the status and output. The frontend polls the submission endpoint until execution completes.
## Screeenshot:
![alt text](<Screenshot 2026-09-06 at 8.04.02 AM.png>)

## Requirements

- [Bun](https://bun.sh/)
- Redis
- PostgreSQL
- Node.js, Python 3, and g++ for code execution

Set `DATABASE_URL` in both `backend/.env` and `worker/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mist"
```

## Run locally

Install dependencies in each package:

```bash
cd frontend && bun install
cd ../backend && bun install
cd ../worker && bun install
```

Start the services in separate terminals:

```bash
# terminal 1
cd backend && bun run index.ts

# terminal 2
cd worker && bun run index.ts

# terminal 3
cd frontend && bun dev
```

The frontend runs on `http://localhost:3003` and the API on `http://localhost:3000`.

## Project layout

```text
frontend/   Browser workspace and compiler console
backend/    Submission API and queue producer
worker/     Queue consumer and language runners
```
