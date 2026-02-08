## ADDED Requirements

### Requirement: SPA Route Rewriting

The system SHALL configure AWS Amplify to serve `index.html` with HTTP 200 for all SPA routes, enabling direct URL access without 404 errors.

#### Scenario: Direct access to /timer route
- **GIVEN** a user or crawler accesses `https://cubing.world/timer` directly
- **WHEN** AWS Amplify processes the request
- **THEN** the server SHALL return HTTP 200
- **AND** the server SHALL serve the contents of `index.html`
- **AND** the React router SHALL handle the `/timer` route client-side

#### Scenario: Direct access to /scramble route
- **GIVEN** a user or crawler accesses `https://cubing.world/scramble` directly
- **WHEN** AWS Amplify processes the request
- **THEN** the server SHALL return HTTP 200
- **AND** the server SHALL serve the contents of `index.html`
- **AND** the React router SHALL handle the `/scramble` route client-side

#### Scenario: Missing static asset returns 404
- **GIVEN** a request for a non-existent static file (e.g., `/missing.js`)
- **WHEN** AWS Amplify processes the request
- **THEN** the server SHALL return HTTP 404
- **AND** the server SHALL NOT serve `index.html`

### Requirement: Static Fallback Content

The system SHALL include static HTML content in `index.html` that describes all main features, allowing search engine crawlers to index content without JavaScript execution.

#### Scenario: Crawler without JavaScript support
- **GIVEN** a search engine crawler that does not execute JavaScript
- **WHEN** the crawler accesses any route
- **THEN** the crawler SHALL receive static HTML describing the Scramble Generator feature
- **AND** the crawler SHALL receive static HTML describing the Timer feature
- **AND** the crawler SHALL find internal navigation links to `/timer` and `/scramble`

#### Scenario: JavaScript-enabled browser
- **GIVEN** a user with JavaScript enabled
- **WHEN** the page loads and React mounts
- **THEN** React SHALL replace the static fallback content with the dynamic SPA
- **AND** the user experience SHALL be unaffected by the static content

### Requirement: Page-Specific Meta Tags

The system SHALL provide unique, descriptive meta tags for each page route to improve search engine visibility and social sharing.

#### Scenario: Timer page meta tags
- **GIVEN** a user navigates to the `/timer` route
- **WHEN** the SEO component renders
- **THEN** the page title SHALL include "Timer" and "Cubing World"
- **AND** the meta description SHALL describe solve time tracking functionality
- **AND** the Open Graph tags SHALL reflect timer-specific content

#### Scenario: Scramble page meta tags
- **GIVEN** a user navigates to the `/scramble` route
- **WHEN** the SEO component renders
- **THEN** the page title SHALL include "Scramble Generator" and "Cubing World"
- **AND** the meta description SHALL describe scramble generation functionality
- **AND** the Open Graph tags SHALL reflect scramble-specific content

### Requirement: Structured Data

The system SHALL include JSON-LD structured data for WebSite and SoftwareApplication schemas to improve search result presentation.

#### Scenario: Search engine parses structured data
- **GIVEN** a search engine crawler parses the page
- **WHEN** the crawler processes the JSON-LD scripts
- **THEN** the crawler SHALL find a valid WebSite schema with site name and URL
- **AND** the crawler SHALL find a valid SoftwareApplication schema with features list
- **AND** the structured data SHALL validate without errors in Google's Rich Results Test

### Requirement: Caching Headers

The system SHALL configure appropriate cache headers for static assets to improve performance and reduce server load.

#### Scenario: Static asset caching
- **GIVEN** a browser requests a static asset (JS, CSS, images)
- **WHEN** AWS Amplify serves the asset
- **THEN** the response SHALL include `Cache-Control` headers
- **AND** immutable assets (with hash in filename) SHALL have long cache duration

### Requirement: SEO Documentation

The system SHALL include documentation for setting up Google Search Console and submitting the sitemap.

#### Scenario: Developer configures Search Console
- **GIVEN** a developer reads the README deployment/SEO section
- **WHEN** the developer follows the documented steps
- **THEN** the developer SHALL be able to verify domain ownership
- **AND** the developer SHALL be able to submit the sitemap
- **AND** the developer SHALL be able to request indexing of key pages
