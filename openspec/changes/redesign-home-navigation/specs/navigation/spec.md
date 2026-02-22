## ADDED Requirements

### Requirement: Hub Page

The system SHALL provide a lightweight hub page as the default entry point (`/`) that enables quick navigation to all major features without loading heavy dependencies.

#### Scenario: User accesses the app root

- **WHEN** a user navigates to `/`
- **THEN** the system SHALL display the HubPage
- **AND** the page SHALL load without Three.js or 3D rendering dependencies
- **AND** the page SHALL display navigation cards for Timer, Scramble, and Tutorials

#### Scenario: Hub page feature cards

- **WHEN** the HubPage is displayed
- **THEN** the system SHALL show a card for "Timer" linking to `/timer`
- **AND** the system SHALL show a card for "Scramble" linking to `/scramble`
- **AND** the system SHALL show a card for "Tutorials" marked as coming soon

#### Scenario: Hub page performance

- **WHEN** a user loads the HubPage
- **THEN** the Time to Interactive (TTI) SHALL be under 2 seconds on 3G connection
- **AND** no Three.js bundle code SHALL be loaded

---

### Requirement: Bottom Navigation Bar

The system SHALL provide a fixed bottom navigation bar that enables consistent navigation across all pages.

#### Scenario: Bottom navigation visibility

- **WHEN** a user is on any main page (Hub, Timer, Scramble, Tutorials)
- **THEN** the bottom navigation bar SHALL be visible
- **AND** the bar SHALL be fixed at the bottom of the viewport

#### Scenario: Bottom navigation items

- **WHEN** the bottom navigation bar is displayed
- **THEN** it SHALL contain navigation items for: Home, Timer, Scramble, Tutorials
- **AND** each item SHALL display an icon and label
- **AND** the current page item SHALL be visually highlighted

#### Scenario: Bottom navigation interaction

- **WHEN** a user taps a navigation item
- **THEN** the system SHALL navigate to the corresponding page
- **AND** the navigation SHALL not cause a full page reload (SPA navigation)

#### Scenario: Tutorials placeholder navigation

- **WHEN** a user taps the Tutorials navigation item
- **THEN** the system SHALL navigate to the Tutorials placeholder page
- **AND** the page SHALL display a "Coming Soon" message

---

### Requirement: Tutorials Placeholder Page

The system SHALL provide a placeholder page for the Tutorials section that indicates the feature is coming soon.

#### Scenario: User navigates to tutorials

- **WHEN** a user navigates to `/tutorials`
- **THEN** the system SHALL display a placeholder page
- **AND** the page SHALL show a "Coming Soon" or "Em breve" message (localized)
- **AND** the page SHALL maintain the bottom navigation bar

#### Scenario: Tutorials placeholder content

- **WHEN** the Tutorials placeholder page is displayed
- **THEN** it SHALL show a brief description of upcoming tutorial features
- **AND** it MAY show an illustrative icon or graphic
- **AND** it SHALL match the app's visual theme

---

### Requirement: Direct Pro Timer Access

The system SHALL enable navigation to Pro Timer directly from the Hub page without requiring navigation through the standard Timer first.

#### Scenario: Pro Timer from Hub

- **WHEN** a user is on the HubPage
- **THEN** the Timer card SHALL provide access to both Timer modes
- **AND** the user SHALL be able to navigate to `/timer-pro` without first visiting `/timer`

---

### Requirement: Route Structure

The system SHALL organize routes to provide clear, predictable navigation paths.

#### Scenario: Root route serves Hub

- **WHEN** a user accesses `/`
- **THEN** the system SHALL serve the HubPage
- **AND** the system SHALL NOT load the Scramble 3D visualization

#### Scenario: Scramble route serves 3D visualization

- **WHEN** a user accesses `/scramble`
- **THEN** the system SHALL serve the CubingWorldPage with 3D visualization
- **AND** the Three.js bundle SHALL be lazy-loaded

#### Scenario: Legacy home route redirect

- **WHEN** a user accesses `/home`
- **THEN** the system SHALL redirect to `/`
