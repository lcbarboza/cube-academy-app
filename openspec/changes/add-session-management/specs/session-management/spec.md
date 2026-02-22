## ADDED Requirements

### Requirement: Session Data Model
The system SHALL define a Session type with the following fields:
- `id`: Unique identifier (UUID)
- `name`: User-defined session name (string)
- `createdAt`: ISO timestamp of session creation
- `updatedAt`: ISO timestamp of last modification

#### Scenario: Session creation
- **WHEN** a new session is created
- **THEN** it SHALL have a unique id, a default name, and createdAt/updatedAt timestamps

### Requirement: Solve-Session Association
Each Solve entry SHALL have a `sessionId` field that references the owning Session.

#### Scenario: New solve in active session
- **WHEN** user completes a solve
- **THEN** the solve SHALL be saved with the active session's id

#### Scenario: Legacy solve migration
- **WHEN** a solve without sessionId is loaded from storage
- **THEN** it SHALL be assigned to a default session

### Requirement: Session Creation
Users SHALL be able to create a new empty session at any time.

#### Scenario: Create new session
- **WHEN** user clicks "New Session" in the session selector
- **THEN** a new session is created with a default name (e.g., "Session N")
- **AND** the new session becomes the active session
- **AND** solve history shows empty state for the new session

### Requirement: Session Switching
Users SHALL be able to switch between existing sessions.

#### Scenario: Switch to different session
- **WHEN** user selects a different session from the session selector
- **THEN** the selected session becomes active
- **AND** solve history displays solves from the selected session
- **AND** statistics are computed for the selected session only

### Requirement: Session Renaming
Users SHALL be able to rename any session.

#### Scenario: Rename current session
- **WHEN** user initiates rename action on a session
- **THEN** a modal appears with the current name pre-filled
- **AND** user can enter a new name
- **AND** upon confirmation, the session name is updated and persisted

### Requirement: Session Persistence
All sessions SHALL be persisted to localStorage and survive browser restarts.

#### Scenario: Sessions survive page reload
- **WHEN** user creates sessions and closes the browser
- **AND** user reopens the app
- **THEN** all sessions are available with their solves intact

#### Scenario: Active session is remembered
- **WHEN** user switches to session X and reloads the page
- **THEN** session X remains the active session

### Requirement: Session UI Placement
The session selector SHALL appear consistently in the header area of all timer pages.

#### Scenario: Session selector on TimerPage
- **WHEN** user navigates to /timer
- **THEN** session selector is visible in the header

#### Scenario: Session selector on ProTimerPage
- **WHEN** user navigates to /timer-pro
- **THEN** session selector is visible in the header

### Requirement: Apply Scramble from History
Users SHALL be able to apply a scramble from a previous solve to retry it.

#### Scenario: Apply scramble action
- **WHEN** user views a solve in the SolveDetailModal
- **AND** clicks the "Apply Scramble" button
- **THEN** the modal closes
- **AND** the timer's current scramble is set to the selected solve's scramble
- **AND** a visual indicator shows that an applied scramble is active

#### Scenario: Solve with applied scramble
- **WHEN** user completes a solve with an applied scramble
- **THEN** the new solve is saved as an independent entry (not linked to original)
- **AND** the applied scramble indicator is cleared
- **AND** next scramble generation returns to normal random scrambles

### Requirement: Applied Scramble Indicator
The UI SHALL visually indicate when an applied scramble is active.

#### Scenario: Indicator visibility
- **WHEN** a scramble is applied from history
- **THEN** a badge or label indicating "Retry" or "Applied" is displayed near the scramble
- **AND** the indicator is removed after the solve is completed

#### Scenario: Generate new scramble clears indicator
- **WHEN** user manually generates a new scramble while an applied scramble is active
- **THEN** the applied scramble is replaced with a random scramble
- **AND** the indicator is removed
