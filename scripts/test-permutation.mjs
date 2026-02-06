// Use permutation-based implementation which is known to be correct
// This represents each sticker by its position and tracks where each position's value comes from

// Sticker numbering (0-53):
// U: 0-8, D: 9-17, F: 18-26, B: 27-35, R: 36-44, L: 45-53
// Each face: [0][0]=0, [0][1]=1, [0][2]=2, [1][0]=3, [1][1]=4, [1][2]=5, [2][0]=6, [2][1]=7, [2][2]=8
// So for face F (starting at 18): F[0][0]=18, F[0][1]=19, F[0][2]=20, etc.

// Standard Rubik's cube permutations (from Kociemba or any standard source)
// U: cycles F->R->B->L for top layer (no reversal needed for rows)
const U_PERM = [
  // U face rotates CW
  [0, 6], [1, 3], [2, 0], [3, 7], [5, 1], [6, 8], [7, 5], [8, 2],
  // F row 0 -> R row 0
  [36, 18], [37, 19], [38, 20],
  // R row 0 -> B row 0
  [27, 36], [28, 37], [29, 38],
  // B row 0 -> L row 0
  [45, 27], [46, 28], [47, 29],
  // L row 0 -> F row 0
  [18, 45], [19, 46], [20, 47]
];

// R: cycles F->U->B->D for right column
// F col 2 (indices 20,23,26) -> U col 2 (indices 2,5,8)
// U col 2 (2,5,8) -> B col 0 (27,30,33) reversed
// B col 0 (27,30,33) -> D col 2 (11,14,17) reversed
// D col 2 (11,14,17) -> F col 2 (20,23,26)
const R_PERM = [
  // R face rotates CW
  [36, 42], [37, 39], [38, 36], [39, 43], [41, 37], [42, 44], [43, 41], [44, 38],
  // F col 2 -> U col 2
  [2, 20], [5, 23], [8, 26],
  // U col 2 -> B col 0 (reversed)
  [33, 2], [30, 5], [27, 8],
  // B col 0 -> D col 2 (reversed)
  [17, 27], [14, 30], [11, 33],
  // D col 2 -> F col 2
  [20, 11], [23, 14], [26, 17]
];

function applyPerm(state, perm) {
  const newState = [...state];
  for (const [to, from] of perm) {
    newState[to] = state[from];
  }
  return newState;
}

function createSolvedState() {
  return Array.from({length: 54}, (_, i) => i);
}

function statesEqual(a, b) {
  return a.every((v, i) => v === b[i]);
}

// Calculate (RU) order with permutation-based implementation
const solved = createSolvedState();
let state = createSolvedState();
for (let i = 1; i <= 200; i++) {
  state = applyPerm(state, R_PERM);
  state = applyPerm(state, U_PERM);
  if (statesEqual(state, solved)) {
    console.log("Permutation-based (RU) order:", i);
    break;
  }
}

// Also test R^4 and U^4
state = createSolvedState();
for (let i = 0; i < 4; i++) state = applyPerm(state, R_PERM);
console.log("R^4 = I:", statesEqual(state, solved) ? "PASS" : "FAIL");

state = createSolvedState();
for (let i = 0; i < 4; i++) state = applyPerm(state, U_PERM);
console.log("U^4 = I:", statesEqual(state, solved) ? "PASS" : "FAIL");
