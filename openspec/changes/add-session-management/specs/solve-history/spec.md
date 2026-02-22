## MODIFIED Requirements

### Requirement: Solve Data Structure

The system SHALL store each solve with the following data:
- **id**: Unique identifier for the solve
- **timeMs**: Solve time in milliseconds (raw, without penalty)
- **scramble**: The scramble string used for this solve
- **timestamp**: Date and time when the solve was completed
- **penalty**: Penalty status (none, +2, or DNF)
- **sessionId**: Reference to the session this solve belongs to

#### Scenario: Solve creation on timer stop
- **WHEN** the timer stops after a solve
- **THEN** a new solve record SHALL be created
- **AND** the solve SHALL include the current scramble
- **AND** the solve SHALL include a timestamp of the current time
- **AND** the penalty SHALL default to none
- **AND** the sessionId SHALL be set to the active session's id

### Requirement: Session Management

The system SHALL allow users to manage solve sessions.

#### Scenario: Clear current session
- **WHEN** user clicks the clear session button
- **THEN** a confirmation dialog SHALL be shown
- **WHEN** user confirms
- **THEN** all solves in the current session SHALL be deleted
- **AND** all statistics SHALL be reset
- **AND** localStorage SHALL be updated
- **AND** other sessions remain unaffected

## ADDED Requirements

### Requirement: Session-Scoped Statistics

The system SHALL compute statistics scoped to the active session.

#### Scenario: Statistics per session
- **WHEN** user switches to a different session
- **THEN** mo3, ao5, ao12, best ao5, best ao12, and best single SHALL be computed from the selected session's solves only

### Requirement: Scramble Retry from History

The system SHALL allow users to apply a scramble from history to retry it.

#### Scenario: Apply scramble from solve detail
- **WHEN** user views a solve in the SolveDetailModal
- **AND** clicks the "Apply Scramble" button
- **THEN** the modal SHALL close
- **AND** the timer's current scramble SHALL be set to the selected solve's scramble
- **AND** a visual indicator SHALL show that an applied scramble is active

#### Scenario: Solve with applied scramble creates independent entry
- **WHEN** user completes a solve with an applied scramble
- **THEN** the new solve SHALL be saved as an independent entry
- **AND** the new solve SHALL NOT be linked to the original solve
- **AND** the applied scramble indicator SHALL be cleared
