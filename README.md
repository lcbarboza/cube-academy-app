# Cube Academy

A multi-language Rubik's Cube learning app with tutorials, structured lessons, and tools for cubers.

## Features

- Step-by-step tutorials (beginner to advanced)
- Algorithm library and practice drills
- User progress tracking
- Multi-language support (pt-BR, en)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Backend | Node.js, Fastify, TypeScript |
| Tooling | Biome (lint/format), Docker |
| Monorepo | npm workspaces |

## Project Structure

```
cube-academy-app/
├── apps/
│   ├── api/          # Fastify backend
│   └── web/          # React frontend
├── openspec/         # Spec-driven development
└── .agents/          # AI agent skills
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional, for containerized dev)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cube-academy-app

# Install dependencies
npm install

# Start development servers
npm run dev
```

### Development

```bash
# Run frontend only
npm run dev -w apps/web

# Run backend only
npm run dev -w apps/api

# Lint and format
npm run lint
npm run format
```

## Code Style

- TypeScript strict mode enabled
- Biome for linting and formatting
- 2-space indentation, single quotes
- Functional React components with hooks

## Contributing

1. Create a feature branch: `feat/your-feature`
2. Follow conventional commits: `feat:`, `fix:`, `chore:`
3. Keep commits small and focused
4. Include tests for new behavior

## License

Private - All rights reserved.
