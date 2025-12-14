// Game Logic and Types

// Grid Dimensions
export const LEVELS = {
  1: { rows: 4, cols: 5, idealClicks: 2, label: "Level 1" },
  2: { rows: 5, cols: 5, idealClicks: 6, label: "Level 2" },
};

// Plane Shape (Relative to Head at 0,0)
// This definition is tricky because we need to rotate it.
// Let's define the shape in a normalized local coordinate system.
// Standard Up:
//   Head: (0, 2)  (Row, Col) - Wait, let's just define offsets relative to head (0,0).
//   But the prompt says: 1-5-1-3.
//   Row 0:  _ _ H _ _  (Width 1)
//   Row 1:  W W W W W  (Width 5)
//   Row 2:  _ _ B _ _  (Width 1)
//   Row 3:  _ T T T _  (Width 3)

// Let's define offsets from the Head (0,0) assuming Head is "Up".
// If Head is at (r, c), then:
//   Wings are at (r+1, c-2), (r+1, c-1), (r+1, c), (r+1, c+1), (r+1, c+2)
//   Body is at (r+2, c)
//   Tail is at (r+3, c-1), (r+3, c), (r+3, c+1)

export const PLANE_PARTS = {
  HEAD: 'HEAD',
  BODY: 'BODY', // Includes wings, body, tail
};

const BASE_SHAPE = [
  { r: 0, c: 0, type: PLANE_PARTS.HEAD },
  { r: 1, c: -2, type: PLANE_PARTS.BODY },
  { r: 1, c: -1, type: PLANE_PARTS.BODY },
  { r: 1, c: 0, type: PLANE_PARTS.BODY },
  { r: 1, c: 1, type: PLANE_PARTS.BODY },
  { r: 1, c: 2, type: PLANE_PARTS.BODY },
  { r: 2, c: 0, type: PLANE_PARTS.BODY },
  { r: 3, c: -1, type: PLANE_PARTS.BODY },
  { r: 3, c: 0, type: PLANE_PARTS.BODY },
  { r: 3, c: 1, type: PLANE_PARTS.BODY },
];

export const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

// Helper to rotate a point (r, c) 90 degrees clockwise
// 90deg rotation matrix for 2D grid (assuming r is y (down), c is x (right)):
// new_r = c
// new_c = -r
// But we need to handle the visual grid rotation.
const rotatePoint = (point, direction) => {
  let { r, c, type } = point;
  for (let i = 0; i < direction; i++) {
    // Rotate 90 deg clockwise
    // (r, c) -> (c, -r)
    const oldR = r;
    r = c;
    c = -oldR;
  }
  return { r, c, type };
};

export const generatePlanePosition = (rows, cols) => {
  // Try to place the plane
  let attempts = 0;
  while (attempts < 1000) {
    const dir = Math.floor(Math.random() * 4);
    // Random head position
    const headR = Math.floor(Math.random() * rows);
    const headC = Math.floor(Math.random() * cols);

    const occupied = [];
    let valid = true;

    for (const part of BASE_SHAPE) {
      const rotated = rotatePoint(part, dir);
      const absR = headR + rotated.r;
      const absC = headC + rotated.c;

      if (absR < 0 || absR >= rows || absC < 0 || absC >= cols) {
        valid = false;
        break;
      }
      occupied.push({ r: absR, c: absC, type: part.type });
    }

    if (valid) {
      // Check for overlap? For now only 1 plane, so always valid if in bounds.
      return occupied;
    }
    attempts++;
  }
  return null; // Should not happen for valid grid sizes
};

export const calculateScore = (actualClicks, idealClicks) => {
  if (actualClicks === idealClicks) return 100;
  // Score=100-40*(y-1)/(x-1)
  // x = ideal, y = actual
  // If actual < ideal (impossible in this game usually unless extremely lucky guess on head first try? 
  // Wait, if I hit head on first try, y=1.
  // Formula: 100 - 40 * (0) / (x-1) = 100.
  // Ideally x is min clicks to deduce? No, prompt says "Ideal clicks x... if y=x score 60".
  // Wait, Prompt: "如果实际点击次数y=x，则给60分" -> "If y=x, give 60 points".
  // Formula: "Score=100-40*(y-1)/(x-1)"
  // Let's test x=2 (Lvl 1). y=2. Score = 100 - 40*(1)/(1) = 60. Correct.
  // If y=1 (Lucky shot). Score = 100 - 40*(0) = 100.
  // If y=3. Score = 100 - 40*(2)/(1) = 20.
  
  const rawScore = 100 - 40 * (actualClicks - 1) / (idealClicks - 1);
  return Math.max(0, Math.round(rawScore));
};
