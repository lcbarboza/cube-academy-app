## ADDED Requirements

### Requirement: Apply Scramble from History

The system SHALL allow users to set a specific scramble from solve history instead of generating a random one.

#### Scenario: Apply scramble sets current scramble
- **WHEN** applyScramble is called with a scramble string
- **THEN** the current scramble SHALL be set to the provided string
- **AND** the cube visualization SHALL update to show the applied scramble state
- **AND** no automatic scramble generation SHALL occur

#### Scenario: Applied scramble indicator is shown
- **WHEN** a scramble is applied (not randomly generated)
- **THEN** a visual indicator SHALL be displayed near the scramble
- **AND** the indicator SHALL communicate that this is a retry/applied scramble

#### Scenario: Applied scramble clears after solve
- **WHEN** user completes a solve with an applied scramble
- **AND** a new scramble is generated
- **THEN** the applied scramble state SHALL be cleared
- **AND** the visual indicator SHALL be removed

#### Scenario: Manual new scramble clears applied state
- **WHEN** user manually generates a new scramble while an applied scramble is active
- **THEN** the applied scramble state SHALL be cleared
- **AND** the visual indicator SHALL be removed
- **AND** normal random scramble generation SHALL resume
