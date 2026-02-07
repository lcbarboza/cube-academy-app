## ADDED Requirements

### Requirement: Solve Data Structure

The system SHALL store each solve with the following data:
- **id**: Unique identifier for the solve
- **timeMs**: Solve time in milliseconds (raw, without penalty)
- **scramble**: The scramble string used for this solve
- **timestamp**: Date and time when the solve was completed
- **penalty**: Penalty status (none, +2, or DNF)

#### Scenario: Solve creation on timer stop
- **WHEN** the timer stops after a solve
- **THEN** a new solve record SHALL be created
- **AND** the solve SHALL include the current scramble
- **AND** the solve SHALL include a timestamp of the current time
- **AND** the penalty SHALL default to none

### Requirement: Solve Persistence

The system SHALL persist solve history to browser localStorage.

#### Scenario: Automatic save on solve completion
- **WHEN** a new solve is completed
- **THEN** the solve SHALL be saved to localStorage immediately

#### Scenario: Load history on page load
- **WHEN** the timer page loads
- **THEN** the solve history SHALL be loaded from localStorage
- **AND** previous solves SHALL be displayed in the history panel

#### Scenario: History survives page refresh
- **WHEN** the user refreshes the page after completing solves
- **THEN** all previous solves SHALL still be available

### Requirement: Solve History Display

The system SHALL display a list of completed solves in reverse chronological order (most recent first).

#### Scenario: Empty history
- **WHEN** no solves have been completed
- **THEN** the history panel SHALL display an empty state message

#### Scenario: Display solve list
- **WHEN** solves have been completed
- **THEN** each solve SHALL display its index number (1, 2, 3...)
- **AND** each solve SHALL display the formatted time
- **AND** solves with +2 penalty SHALL show time with "+2" indicator
- **AND** solves with DNF SHALL show "DNF"

### Requirement: Solve Detail View

The system SHALL allow users to view detailed information about any solve.

#### Scenario: Open solve detail
- **WHEN** user clicks on a solve in the history list
- **THEN** a modal SHALL open showing the solve details

#### Scenario: Solve detail content
- **WHEN** the solve detail modal is open
- **THEN** the modal SHALL display the solve time
- **AND** the modal SHALL display the scramble used
- **AND** the modal SHALL display the date and time of the solve
- **AND** the modal SHALL display the current penalty status

### Requirement: Scramble Review

The system SHALL allow users to review the scramble for any past solve.

#### Scenario: View scramble in detail
- **WHEN** user views solve detail
- **THEN** the complete scramble string SHALL be displayed
- **AND** the scramble SHALL be easily readable (proper formatting)

### Requirement: Penalty Management

The system SHALL allow users to mark solves with penalties.

#### Scenario: Mark solve as +2
- **WHEN** user marks a solve as +2
- **THEN** the solve penalty SHALL be set to +2
- **AND** the displayed time SHALL show the original time plus 2 seconds
- **AND** statistics SHALL be recalculated with the penalty applied

#### Scenario: Mark solve as DNF
- **WHEN** user marks a solve as DNF
- **THEN** the solve penalty SHALL be set to DNF
- **AND** the solve SHALL display "DNF" instead of a time
- **AND** statistics containing this solve SHALL become DNF if applicable

#### Scenario: Remove penalty (mark as OK)
- **WHEN** user marks a penalized solve as OK
- **THEN** the penalty SHALL be removed
- **AND** the original time SHALL be displayed
- **AND** statistics SHALL be recalculated

### Requirement: Solve Deletion

The system SHALL allow users to delete individual solves.

#### Scenario: Delete solve from detail modal
- **WHEN** user clicks delete in the solve detail modal
- **THEN** the solve SHALL be removed from history
- **AND** the modal SHALL close
- **AND** statistics SHALL be recalculated
- **AND** localStorage SHALL be updated

### Requirement: Mean of 3 (mo3) Calculation

The system SHALL calculate the mean of the last 3 solves.

#### Scenario: Calculate mo3 with sufficient solves
- **WHEN** at least 3 solves have been completed
- **THEN** mo3 SHALL be the arithmetic mean of the last 3 effective times
- **AND** mo3 SHALL be displayed in the statistics section

#### Scenario: Calculate mo3 with insufficient solves
- **WHEN** fewer than 3 solves have been completed
- **THEN** mo3 SHALL display "-" or "N/A"

#### Scenario: mo3 with DNF
- **WHEN** any of the last 3 solves is DNF
- **THEN** mo3 SHALL be DNF

### Requirement: Average of 5 (ao5) Calculation

The system SHALL calculate the average of the last 5 solves, trimming the best and worst times.

#### Scenario: Calculate ao5 with sufficient solves
- **WHEN** at least 5 solves have been completed
- **THEN** ao5 SHALL drop the best and worst effective times
- **AND** ao5 SHALL be the arithmetic mean of the remaining 3 times
- **AND** ao5 SHALL be displayed in the statistics section

#### Scenario: Calculate ao5 with insufficient solves
- **WHEN** fewer than 5 solves have been completed
- **THEN** ao5 SHALL display "-" or "N/A"

#### Scenario: ao5 with one DNF
- **WHEN** exactly one of the last 5 solves is DNF
- **THEN** DNF SHALL be treated as the worst time (trimmed)
- **AND** ao5 SHALL be calculated from the remaining times

#### Scenario: ao5 with multiple DNFs
- **WHEN** more than one of the last 5 solves is DNF
- **THEN** ao5 SHALL be DNF

### Requirement: Average of 12 (ao12) Calculation

The system SHALL calculate the average of the last 12 solves, trimming the best and worst times.

#### Scenario: Calculate ao12 with sufficient solves
- **WHEN** at least 12 solves have been completed
- **THEN** ao12 SHALL drop the best and worst effective times
- **AND** ao12 SHALL be the arithmetic mean of the remaining 10 times
- **AND** ao12 SHALL be displayed in the statistics section

#### Scenario: Calculate ao12 with insufficient solves
- **WHEN** fewer than 12 solves have been completed
- **THEN** ao12 SHALL display "-" or "N/A"

#### Scenario: ao12 with one DNF
- **WHEN** exactly one of the last 12 solves is DNF
- **THEN** DNF SHALL be treated as the worst time (trimmed)
- **AND** ao12 SHALL be calculated from the remaining times

#### Scenario: ao12 with multiple DNFs
- **WHEN** more than one of the last 12 solves is DNF
- **THEN** ao12 SHALL be DNF

### Requirement: Best Averages Tracking

The system SHALL track the best ao5 and ao12 achieved in the session.

#### Scenario: Track best ao5
- **WHEN** a new ao5 is calculated
- **AND** it is better than the current best ao5
- **THEN** the best ao5 SHALL be updated
- **AND** the best ao5 SHALL be displayed in statistics

#### Scenario: Track best ao12
- **WHEN** a new ao12 is calculated
- **AND** it is better than the current best ao12
- **THEN** the best ao12 SHALL be updated
- **AND** the best ao12 SHALL be displayed in statistics

### Requirement: Statistics Display

The system SHALL display current and best statistics prominently.

#### Scenario: Statistics summary display
- **WHEN** the timer page is displayed
- **THEN** the current mo3, ao5, and ao12 SHALL be visible
- **AND** the best ao5 and ao12 SHALL be visible
- **AND** the total number of solves SHALL be visible

### Requirement: Session Management

The system SHALL allow users to clear the current session.

#### Scenario: Clear session
- **WHEN** user clicks the clear session button
- **THEN** a confirmation dialog SHALL be shown
- **WHEN** user confirms
- **THEN** all solves SHALL be deleted
- **AND** all statistics SHALL be reset
- **AND** localStorage SHALL be cleared
