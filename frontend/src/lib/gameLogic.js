// Game Logic and Types

// Grid Dimensions
export const LEVELS = {
  1: { rows: 4, cols: 5, idealClicks: 2, label: "Level 1" },
  2: { rows: 5, cols: 5, idealClicks: 4, label: "Level 2" },
  3: { rows: 6, cols: 6, idealClicks: 6, label: "Level 3" }, // Estimated optimal
};

export const PLANE_PARTS = {
  HEAD: 'HEAD',
  BODY: 'BODY',
  WING: 'WING', // Treating wings/body/tail generally as BODY for hit logic, but structure is 1-5-1-3
};

// Shape Definition relative to HEAD (0,0)
// Normalized "Up" facing shape:
//      H (0,0)
//  W W B W W  (Row 1: Wings & Body center) -> Center is (1,0), Wings are (1,-2)..(1,2)
//      B      (Row 2: Body) -> (2,0)
//    T T T    (Row 3: Tail) -> (3,-1)..(3,1)

const BASE_SHAPE = [
  { r: 0, c: 0, type: PLANE_PARTS.HEAD },
  
  // Row 1: 5 wide
  { r: 1, c: -2, type: PLANE_PARTS.BODY },
  { r: 1, c: -1, type: PLANE_PARTS.BODY },
  { r: 1, c: 0, type: PLANE_PARTS.BODY },
  { r: 1, c: 1, type: PLANE_PARTS.BODY },
  { r: 1, c: 2, type: PLANE_PARTS.BODY },
  
  // Row 2: 1 wide
  { r: 2, c: 0, type: PLANE_PARTS.BODY },
  
  // Row 3: 3 wide
  { r: 3, c: -1, type: PLANE_PARTS.BODY },
  { r: 3, c: 0, type: PLANE_PARTS.BODY },
  { r: 3, c: 1, type: PLANE_PARTS.BODY },
];

export const generatePlanePosition = (rows, cols) => {
  let attempts = 0;
  while (attempts < 2000) {
    const dir = Math.floor(Math.random() * 4); // 0: Up, 1: Right, 2: Down, 3: Left
    const headR = Math.floor(Math.random() * rows);
    const headC = Math.floor(Math.random() * cols);

    const occupied = [];
    let valid = true;

    for (const part of BASE_SHAPE) {
      // Rotate Logic
      let r = part.r;
      let c = part.c;
      
      // Rotate (r,c) around (0,0)
      for (let i = 0; i < dir; i++) {
        const oldR = r;
        r = c;
        c = -oldR;
      }

      const absR = headR + r;
      const absC = headC + c;

      if (absR < 0 || absR >= rows || absC < 0 || absC >= cols) {
        valid = false;
        break;
      }
      occupied.push({ r: absR, c: absC, type: part.type });
    }

    if (valid) return occupied;
    attempts++;
  }
  return null;
};

export const calculateScore = (actualClicks, idealClicks) => {
  if (actualClicks === idealClicks) return 100;
  // Score = 100 - 40 * (y - 1) / (x - 1)
  const rawScore = 100 - 40 * (actualClicks - 1) / (idealClicks - 1);
  return Math.max(0, Math.round(rawScore));
};
