## ADDED Requirements

### Requirement: Timer State Machine

The timer SHALL implement a state machine with the following states:
- **idle**: Timer is ready, showing 0:00.000 or last solve time
- **holding**: User is holding spacebar, countdown to ready state
- **ready**: User has held spacebar for minimum duration, can release to start
- **running**: Timer is actively counting time
- **stopped**: Timer has stopped, displaying final time

#### Scenario: Initial state
- **WHEN** the timer page loads
- **THEN** the timer SHALL be in the idle state
- **AND** the display SHALL show 0.0

#### Scenario: State transitions
- **WHEN** in idle state and user presses spacebar
- **THEN** the timer SHALL transition to holding state

- **WHEN** in holding state and user releases spacebar before 300ms
- **THEN** the timer SHALL transition back to idle state

- **WHEN** in holding state and 300ms have elapsed
- **THEN** the timer SHALL transition to ready state

- **WHEN** in ready state and user releases spacebar
- **THEN** the timer SHALL transition to running state
- **AND** the timer SHALL begin counting from 0

- **WHEN** in running state and user presses any key
- **THEN** the timer SHALL transition to stopped state
- **AND** the final time SHALL be captured

- **WHEN** in stopped state and user presses spacebar
- **THEN** the timer SHALL transition to holding state

### Requirement: Hold Detection

The timer SHALL require the user to hold the spacebar for a minimum of 300 milliseconds before the timer is ready to start.

#### Scenario: Successful hold
- **WHEN** user presses and holds spacebar for 300ms
- **THEN** visual feedback SHALL indicate the timer is ready
- **AND** the timer SHALL not start until spacebar is released

#### Scenario: Premature release
- **WHEN** user releases spacebar before 300ms
- **THEN** the timer SHALL reset to idle state
- **AND** the timer SHALL not start

### Requirement: Timer Precision

The timer SHALL display time with decisecond precision (1 decimal place) showing only relevant digits progressively.

#### Scenario: Time display format
- **WHEN** the timer is running or stopped
- **THEN** the time SHALL be displayed with 1 decimal place
- **AND** the display SHALL update at least 60 times per second during running state

#### Scenario: Under 10 seconds
- **WHEN** the elapsed time is under 10 seconds (e.g., 5.3 seconds)
- **THEN** the display SHALL show S.c format (e.g., 5.3)

#### Scenario: 10 to 59 seconds
- **WHEN** the elapsed time is between 10 and 59.9 seconds (e.g., 45.7 seconds)
- **THEN** the display SHALL show SS.c format (e.g., 45.7)

#### Scenario: 1 minute or more
- **WHEN** the elapsed time is 1 minute or more (e.g., 1 minute 5.3 seconds)
- **THEN** the display SHALL show M:SS.c format (e.g., 1:05.3)

### Requirement: Visual State Feedback

The timer SHALL provide clear visual feedback for each state.

#### Scenario: Idle state appearance
- **WHEN** in idle state
- **THEN** the timer display SHALL use the default text color

#### Scenario: Holding state appearance
- **WHEN** in holding state
- **THEN** the timer display SHALL use a red/warning color
- **AND** indicate the user should continue holding

#### Scenario: Ready state appearance
- **WHEN** in ready state
- **THEN** the timer display SHALL use a green/success color
- **AND** indicate the user can release to start

#### Scenario: Running state appearance
- **WHEN** in running state
- **THEN** the timer display SHALL be clearly visible
- **AND** the time SHALL be updating in real-time

### Requirement: Keyboard Interaction

The timer SHALL respond to keyboard input for start and stop operations.

#### Scenario: Start with spacebar
- **WHEN** user is focused on timer page
- **AND** holds spacebar for 300ms and releases
- **THEN** the timer SHALL start

#### Scenario: Stop with any key
- **WHEN** timer is running
- **AND** user presses any key (including spacebar)
- **THEN** the timer SHALL stop

#### Scenario: Prevent page scroll
- **WHEN** user presses spacebar on timer page
- **THEN** the page SHALL not scroll down

### Requirement: Scramble Integration

The timer page SHALL display a scramble for the user to apply before starting the timer.

#### Scenario: Initial scramble
- **WHEN** timer page loads
- **THEN** a random scramble SHALL be displayed

#### Scenario: New scramble after solve
- **WHEN** a solve is completed (timer stopped)
- **AND** user initiates a new timing session
- **THEN** a new random scramble SHALL be generated
