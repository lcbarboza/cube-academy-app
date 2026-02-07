# Change: Add GitHub Actions CI/CD Pipeline for AWS Amplify Deployment

## Why

The project currently lacks an automated deployment pipeline. Setting up GitHub Actions to deploy to AWS Amplify will enable automatic, consistent deployments on every push to the main branch, eliminating manual deployment steps and reducing the risk of human error. AWS Amplify is well-suited for React/Vite applications and provides built-in features like preview deployments, CDN distribution, and SSL certificates.

## What Changes

- Add GitHub Actions workflow file for automated deployment to AWS Amplify
- Add AWS Amplify build specification file (`amplify.yml`) for build configuration
- Add documentation for initial AWS Amplify app setup and GitHub secrets configuration
- Configure workflow to trigger on pushes to the `main` branch
- Set up build caching for npm dependencies to speed up CI runs

## Impact

- Affected specs: New `ci-cd` capability
- Affected code:
  - `.github/workflows/deploy.yml` (new) - GitHub Actions workflow
  - `amplify.yml` (new) - AWS Amplify build specification
  - `README.md` (modify) - Add deployment documentation section

## Technical Context

### AWS Amplify Hosting

AWS Amplify provides:
- Static web app hosting with global CDN
- Automatic HTTPS with AWS Certificate Manager
- Support for SPA routing (rewrites/redirects)
- Build artifacts stored in S3

### GitHub Actions Integration

The workflow will:
1. Checkout the repository
2. Set up Node.js with caching
3. Install dependencies
4. Run linting/formatting checks
5. Build the web application
6. Deploy to AWS Amplify using the AWS CLI

### Required AWS Setup

Before the workflow can run:
1. Create an AWS Amplify app in the AWS Console
2. Generate AWS access credentials (IAM user or OIDC)
3. Add required secrets to GitHub repository
