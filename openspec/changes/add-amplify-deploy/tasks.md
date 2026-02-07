# Tasks: Add GitHub Actions CI/CD Pipeline for AWS Amplify Deployment

## 1. AWS Amplify Setup (Manual/Documentation)

- [x] 1.1 Document AWS Amplify app creation steps in README
  - Create new Amplify app via AWS Console
  - Configure as manual deployment (not Git-connected)
  - Note the App ID and Branch Name for GitHub secrets

- [x] 1.2 Document IAM permissions required for deployment
  - Create IAM policy with Amplify deployment permissions
  - Document using IAM user with access keys OR OIDC provider

- [x] 1.3 Document required GitHub repository secrets
  - `AWS_ACCESS_KEY_ID` - AWS access key
  - `AWS_SECRET_ACCESS_KEY` - AWS secret key
  - `AWS_REGION` - AWS region (e.g., us-east-1)
  - `AMPLIFY_APP_ID` - Amplify application ID
  - `AMPLIFY_BRANCH` - Amplify branch name (e.g., main)

## 2. Amplify Build Configuration

- [x] 2.1 Create `amplify.yml` build specification file
  - Configure preBuild: install dependencies
  - Configure build: run linting and build commands
  - Configure artifacts: specify `apps/web/dist` output directory
  - Configure cache: npm cache for faster builds

## 3. GitHub Actions Workflow

- [x] 3.1 Create `.github/workflows/deploy.yml` workflow file
  - Trigger on push to `main` branch
  - Add manual trigger option (`workflow_dispatch`)

- [x] 3.2 Configure checkout and Node.js setup
  - Use `actions/checkout@v4`
  - Use `actions/setup-node@v4` with Node.js 20
  - Enable npm caching

- [x] 3.3 Add build steps
  - Install dependencies: `npm ci`
  - Run linting: `npm run lint`
  - Build application: `npm run build`

- [x] 3.4 Add AWS Amplify deployment step
  - Configure AWS credentials using `aws-actions/configure-aws-credentials@v4`
  - Create deployment using AWS CLI
  - Upload build artifacts to Amplify
  - Start deployment job

## 4. Documentation

- [x] 4.1 Update README.md with deployment section
  - Prerequisites (AWS account, IAM setup)
  - Initial Amplify app setup instructions
  - GitHub secrets configuration
  - Workflow trigger information
  - Troubleshooting common issues

## 5. Validation

- [x] 5.1 Test workflow syntax with `act` or GitHub Actions linter
- [x] 5.2 Verify build output directory matches Amplify configuration
- [ ] 5.3 Test deployment with actual AWS Amplify app (requires AWS setup)
