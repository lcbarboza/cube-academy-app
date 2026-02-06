---
description: Build a backend API endpoint or service following Node.js best practices for the Cube Academy project.
---
# Build API Endpoint

You are building a backend API endpoint or service for the Cube Academy project.

<APIRequest>
  $ARGUMENTS
</APIRequest>

## Instructions

**REQUIRED SKILL:** Use the `nodejs-backend-patterns` skill from `.agents/skills/nodejs-backend-patterns/SKILL.md`

**Announce at start:** "I'm using the nodejs-backend-patterns skill to build this API endpoint."

## Project Architecture

The backend follows a **layered architecture**:

```
apps/api/
├── src/
│   ├── routes/         # HTTP endpoints (Fastify routes)
│   ├── services/       # Business logic (no HTTP concerns)
│   ├── repositories/   # Data access layer (when using DB)
│   ├── utils/          # Pure utility functions (no side effects)
│   ├── types/          # TypeScript types/interfaces
│   ├── config/         # Configuration and environment
│   └── middleware/     # Fastify middleware
```

## Implementation Pattern

### 1. Route Layer (HTTP)
```typescript
// routes/example.route.ts
import { FastifyInstance } from 'fastify'
import { ExampleService } from '../services/example.service'

export async function exampleRoutes(fastify: FastifyInstance) {
  const service = new ExampleService()

  fastify.get('/examples', async (request, reply) => {
    const result = await service.getAll()
    return reply.send(result)
  })
}
```

### 2. Service Layer (Business Logic)
```typescript
// services/example.service.ts
export class ExampleService {
  async getAll(): Promise<Example[]> {
    // Business logic here
  }
}
```

### 3. Types
```typescript
// types/example.types.ts
export interface Example {
  id: string
  name: string
}

export interface CreateExampleDTO {
  name: string
}
```

## Required Patterns

Following `nodejs-backend-patterns` skill:

### Error Handling
- Use custom error classes (ValidationError, NotFoundError, etc.)
- Global error handler middleware
- Never leak internal errors to clients

### Validation
- Use Zod or Fastify schemas for input validation
- Validate at the route level before calling services

### Authentication (when needed)
- Authenticate in middleware or at route level
- Never trust client-provided user IDs

### Responses
- Consistent response format
- Proper HTTP status codes
- Include pagination for lists

## Project Constraints

- **TypeScript:** strict mode, explicit types at boundaries
- **Framework:** Fastify
- **Formatting:** Biome (2-space, single quotes)
- **i18n:** Error messages should be translation-ready
- **Testing:** Integration tests for routes, unit tests for services

## Output

1. **Types** (types/*.types.ts)
2. **Service** (services/*.service.ts)
3. **Route** (routes/*.route.ts)
4. **Tests** (tests/*.test.ts)

## After Building

Ask:
- "Want me to add validation schemas?"
- "Want me to add authentication middleware?"
- "Want me to create tests for this endpoint?"
