## ADDED Requirements

### Requirement: Automated Frontend Deployment

The system SHALL automatically deploy the frontend application (`apps/web`) to AWS Amplify when changes are pushed to the `main` branch.

#### Scenario: Successful deployment on push to main
- **GIVEN** a valid GitHub Actions workflow is configured
- **AND** AWS credentials are properly set in GitHub secrets
- **WHEN** a commit is pushed to the `main` branch
- **THEN** the workflow SHALL trigger automatically
- **AND** the workflow SHALL build the web application
- **AND** the workflow SHALL deploy the build artifacts to AWS Amplify
- **AND** the deployment SHALL complete successfully

#### Scenario: Build failure prevents deployment
- **GIVEN** a valid GitHub Actions workflow is configured
- **WHEN** a commit is pushed to the `main` branch
- **AND** the build step fails (lint errors or build errors)
- **THEN** the workflow SHALL fail
- **AND** no deployment SHALL occur
- **AND** the failure SHALL be visible in GitHub Actions

### Requirement: Manual Deployment Trigger

The system SHALL allow manual triggering of the deployment workflow via GitHub Actions `workflow_dispatch`.

#### Scenario: Manual deployment from GitHub UI
- **GIVEN** the user has write access to the repository
- **WHEN** the user navigates to Actions > Deploy > Run workflow
- **AND** the user clicks "Run workflow"
- **THEN** the deployment workflow SHALL execute
- **AND** the latest code from the selected branch SHALL be deployed

### Requirement: Build Caching

The system SHALL cache npm dependencies between workflow runs to reduce build times.

#### Scenario: Subsequent builds use cached dependencies
- **GIVEN** a previous workflow run completed successfully
- **AND** the `package-lock.json` file has not changed
- **WHEN** a new workflow run starts
- **THEN** the npm dependencies SHALL be restored from cache
- **AND** the install step SHALL complete faster than a cold install

### Requirement: Amplify Build Specification

The system SHALL include an `amplify.yml` file that defines the build configuration for AWS Amplify.

#### Scenario: Amplify uses project build specification
- **GIVEN** an `amplify.yml` file exists in the repository root
- **WHEN** AWS Amplify processes a deployment
- **THEN** Amplify SHALL use the specified build commands
- **AND** Amplify SHALL output artifacts from `apps/web/dist`

### Requirement: Deployment Documentation

The system SHALL include documentation for setting up AWS Amplify deployment.

#### Scenario: New developer sets up deployment
- **GIVEN** a developer reads the README.md deployment section
- **WHEN** the developer follows the documented steps
- **THEN** the developer SHALL be able to create an AWS Amplify app
- **AND** the developer SHALL be able to configure GitHub secrets
- **AND** the developer SHALL be able to trigger a successful deployment
