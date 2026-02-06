## ADDED Requirements

### Requirement: Scramble Animation Playback

The system SHALL animate cube face rotations when applying scramble moves step-by-step.

#### Scenario: Smooth move animation
- **WHEN** a move is played in the scramble sequence
- **THEN** the affected cube layer rotates smoothly to show the move being applied

#### Scenario: Animation duration based on move type
- **WHEN** a single move (R, U, F, etc.) is animated
- **THEN** the layer rotates 90 degrees over the base animation duration
- **WHEN** a double move (R2, U2, etc.) is animated
- **THEN** the layer rotates 180 degrees over the base animation duration

#### Scenario: Correct rotation axis per face
- **WHEN** animating R or L moves
- **THEN** the layer rotates around the X axis
- **WHEN** animating U or D moves
- **THEN** the layer rotates around the Y axis
- **WHEN** animating F or B moves
- **THEN** the layer rotates around the Z axis

#### Scenario: Animation completes before next move
- **WHEN** a move animation is in progress
- **THEN** the next move does not start until the current animation completes

---

### Requirement: Scramble Player Controls

The system SHALL provide controls for stepping through the scramble sequence.

#### Scenario: Play button starts auto-playback
- **WHEN** the user clicks the Play button
- **THEN** the scramble animates move-by-move automatically

#### Scenario: Pause button stops playback
- **WHEN** the user clicks the Pause button during playback
- **THEN** the animation stops at the current position

#### Scenario: Step forward advances one move
- **WHEN** the user clicks the Step Forward button
- **THEN** the next move in the sequence is animated

#### Scenario: Step back shows previous state
- **WHEN** the user clicks the Step Back button
- **THEN** the cube immediately shows the state before the current move (no reverse animation)

#### Scenario: Reset returns to solved state
- **WHEN** the user clicks the Reset button
- **THEN** the cube returns to the solved state (position 0)

#### Scenario: Controls disabled during animation
- **WHEN** a move animation is in progress
- **THEN** player controls are disabled until animation completes

---

### Requirement: Speed Control

The system SHALL allow users to adjust the animation playback speed.

#### Scenario: Speed slider is visible
- **WHEN** viewing the scramble player
- **THEN** a speed control slider or selector is displayed

#### Scenario: Multiple speed options
- **WHEN** adjusting the speed control
- **THEN** the user can choose from at least 4 speeds (0.5x, 1x, 1.5x, 2x)

#### Scenario: Speed affects animation duration
- **WHEN** speed is set to 0.5x
- **THEN** animations take twice as long as 1x speed
- **WHEN** speed is set to 2x
- **THEN** animations take half as long as 1x speed

#### Scenario: Speed change applies immediately
- **WHEN** changing speed during playback
- **THEN** the next animated move uses the new speed

---

### Requirement: Clickable Move Sequence

The system SHALL allow users to click on any move to jump to that position.

#### Scenario: Moves are clickable
- **WHEN** viewing the scramble sequence
- **THEN** each move is displayed as a clickable element

#### Scenario: Current move is highlighted
- **WHEN** viewing the scramble sequence
- **THEN** the move at the current position has distinct visual highlighting

#### Scenario: Past moves are visually distinct
- **WHEN** viewing the scramble sequence
- **THEN** moves before the current position appear dimmed or muted

#### Scenario: Clicking a move jumps to that position
- **WHEN** the user clicks on a move in the sequence
- **THEN** the cube immediately shows the state after that move is applied

#### Scenario: Clicking while playing pauses playback
- **WHEN** the user clicks on a move during auto-playback
- **THEN** playback pauses at the clicked position

---

### Requirement: Auto-play on New Scramble

The system SHALL automatically begin playback when a new scramble is generated.

#### Scenario: New scramble triggers auto-play
- **WHEN** a new scramble is generated
- **THEN** the cube starts from solved state and begins animating moves automatically

#### Scenario: Auto-play respects current speed setting
- **WHEN** auto-play begins after generating a new scramble
- **THEN** the animation uses the currently selected speed

---

### Requirement: Scramble Player Internationalization

The scramble player controls SHALL support multiple languages.

#### Scenario: Portuguese control labels
- **WHEN** the language is set to pt-BR
- **THEN** player control labels (Play, Pause, Reset, Speed) are displayed in Portuguese

#### Scenario: English control labels
- **WHEN** the language is set to en
- **THEN** player control labels are displayed in English
