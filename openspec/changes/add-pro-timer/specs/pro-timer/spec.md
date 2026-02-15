## ADDED Requirements

### Requirement: Pro Timer Page

The system SHALL provide a Pro Timer page at `/timer-pro` optimized for professional speedcubing practice.

#### Scenario: User accesses Pro Timer page
- **WHEN** user navigates to `/timer-pro`
- **THEN** the system displays the Pro Timer interface with:
  - **Large centered timer display** as the primary focus (hero element)
  - Scramble display at the top of the main area
  - History table in a left sidebar with solve statistics
  - Stats comparison panel above the history showing current vs session-best values

#### Scenario: User starts a solve in Pro Timer
- **WHEN** user holds SPACE for 300ms and releases
- **THEN** timer starts counting
- **AND** timer display shows running time

#### Scenario: User completes a solve in Pro Timer
- **WHEN** user presses any key while timer is running
- **THEN** timer stops
- **AND** solve is recorded with ao5 and ao12 snapshots
- **AND** history table updates with new entry
- **AND** stats panel updates to reflect new values

---

### Requirement: Solve Statistics Snapshots

The system SHALL store ao5 and ao12 values as snapshots with each solve entry.

#### Scenario: Solve recorded with statistics snapshots
- **WHEN** a solve is completed
- **THEN** the current ao5 value (including the new solve) is stored as `ao5Snapshot`
- **AND** the current ao12 value (including the new solve) is stored as `ao12Snapshot`
- **AND** these values are persisted with the solve in localStorage

#### Scenario: Display solve with snapshots
- **WHEN** history table displays a solve with snapshots
- **THEN** the ao5 and ao12 columns show the snapshot values from that moment

#### Scenario: Display solve without snapshots (legacy data)
- **WHEN** history table displays a solve without snapshots (created before this feature)
- **THEN** the ao5 and ao12 columns display "-" for missing values

---

### Requirement: Pro Stats Comparison Panel

The system SHALL display a stats comparison panel showing current statistics versus session bests.

#### Scenario: Display current vs best statistics
- **WHEN** user views the Pro Timer page with solve history
- **THEN** the stats panel displays two columns:
  - "Current" column with: mo3, ao5, ao12, best single
  - "Best" column with: best mo3, best ao5, best ao12, best single

#### Scenario: Highlight personal best achievement
- **WHEN** current ao5 equals session best ao5
- **THEN** the ao5 value is highlighted with a distinct visual indicator (e.g., green color)

#### Scenario: Display empty session
- **WHEN** user views Pro Timer with no solve history
- **THEN** stats panel displays placeholder values (e.g., "--.--") for all statistics

---

### Requirement: Pro History Table

The system SHALL display a detailed history table with solve statistics and scramble information.

#### Scenario: Display history table columns
- **WHEN** user views the Pro Timer history section
- **THEN** the table displays columns: solve number, time, ao5, ao12, scramble

#### Scenario: Display scramble in history
- **WHEN** a solve entry is displayed in the history table
- **THEN** the scramble is shown (truncated if necessary with full scramble on hover/click)

#### Scenario: Navigate to solve details
- **WHEN** user clicks a solve row in the history table
- **THEN** the solve detail modal opens showing full information

#### Scenario: Display recent solves first
- **WHEN** history table is displayed
- **THEN** solves are ordered with most recent at the top

---

### Requirement: Timer Mode Navigation

The system SHALL provide navigation between standard timer and pro timer modes.

#### Scenario: Navigate from Timer to Pro Timer
- **WHEN** user is on the Timer page (`/timer`)
- **AND** user clicks the "Pro Mode" button
- **THEN** user is navigated to `/timer-pro`

#### Scenario: Navigate from Pro Timer to Timer
- **WHEN** user is on the Pro Timer page (`/timer-pro`)
- **AND** user clicks the "Standard Mode" toggle
- **THEN** user is navigated to `/timer`

#### Scenario: Shared solve history between modes
- **WHEN** user switches between timer modes
- **THEN** all solve history is preserved and shared between both views
- **AND** new scrambles are generated appropriately
