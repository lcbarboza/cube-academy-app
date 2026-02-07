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

## Deployment

The application is automatically deployed to AWS Amplify when changes are pushed to the `main` branch.

### Prerequisites

- AWS Account with Amplify access
- GitHub repository with Actions enabled

### Initial AWS Amplify Setup

1. **Create Amplify App**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" > "Host web app"
   - Choose "Deploy without Git provider" (manual deployment)
   - Name your app (e.g., `cube-academy`)
   - Note the **App ID** from the app settings

2. **Create IAM User for Deployments**
   - Go to [IAM Console](https://console.aws.amazon.com/iam/)
   - Create a new user (e.g., `github-amplify-deploy`)
   - Attach the following inline policy:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "amplify:CreateDeployment",
           "amplify:StartDeployment",
           "amplify:GetApp",
           "amplify:GetBranch"
         ],
         "Resource": "arn:aws:amplify:*:*:apps/YOUR_APP_ID/*"
       }
     ]
   }
   ```
   - Generate access keys and save them securely

3. **Configure GitHub Secrets**
   - Go to your repository Settings > Secrets and variables > Actions
   - Add the following secrets:

   | Secret | Description |
   |--------|-------------|
   | `AWS_ACCESS_KEY_ID` | IAM user access key |
   | `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
   | `AWS_REGION` | AWS region (e.g., `us-east-1`) |
   | `AMPLIFY_APP_ID` | Amplify app ID from step 1 |
   | `AMPLIFY_BRANCH` | Branch name (e.g., `main`) |

### Deployment Triggers

- **Automatic**: Push to `main` branch triggers deployment
- **Manual**: Go to Actions > "Deploy to AWS Amplify" > "Run workflow"

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run lint` and `npm run build` locally |
| AWS credentials error | Verify GitHub secrets are set correctly |
| Deployment not starting | Ensure IAM policy has correct App ID |

## Contributing

1. Create a feature branch: `feat/your-feature`
2. Follow conventional commits: `feat:`, `fix:`, `chore:`
3. Keep commits small and focused
4. Include tests for new behavior

## License

Private - All rights reserved.
