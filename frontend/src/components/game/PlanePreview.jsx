import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

// The preview needs to show the plane moving inside a 5x5 grid
// It rotates 90deg every few seconds.
// At each rotation, it toggles between two positions?
// Requirement: "Every 3 seconds move back/forth... total 8 possibilities... stay 3 seconds"
// Wait, prompt says: "Rotate every 5 seconds" AND "At every angle... move... total 8 possibilities".
// This implies the full cycle is controlled by the 8 states.
// Let's implement a state machine that cycles through 8 states.
// 4 Directions * 2 Positions each.
// Duration per state: 3 seconds. 
// Cycle: 
// Dir 0 Pos A -> 3s -> Dir 0 Pos B -> 3s -> Dir 1 Pos A -> 3s ...

const PREVIEW_GRID_SIZE = 5;

// Defined positions for a 5x5 grid to fit the 1-5-1-3 plane
// Shape size: 4 tall, 5 wide.
// In a 5x5 grid:
// UP (4x5): Center can be at col 2. Head can be at row 0 or row 1.
// DOWN (4x5): Head at row 4 or row 3.
// LEFT (5x4): Head at col 0 or 1.
// RIGHT (5x4): Head at col 4 or 3.

const STATES = [
  // UP
  { dir: 0, dr: 0, dc: 0 }, // Top
  { dir: 0, dr: 1, dc: 0 }, // Shifted Down
  // RIGHT
  { dir: 1, dr: 0, dc: 0 },
  { dir: 1, dr: 0, dc: -1 },
  // DOWN
  { dir: 2, dr: 0, dc: 0 },
  { dir: 2, dr: -1, dc: 0 },
  // LEFT
  { dir: 3, dr: 0, dc: 0 },
  { dir: 3, dr: 0, dc: 1 },
];

const BASE_SHAPE = [
  { r: 0, c: 0, type: 'HEAD' },
  { r: 1, c: -2, type: 'BODY' }, { r: 1, c: -1, type: 'BODY' }, { r: 1, c: 0, type: 'BODY' }, { r: 1, c: 1, type: 'BODY' }, { r: 1, c: 2, type: 'BODY' },
  { r: 2, c: 0, type: 'BODY' },
  { r: 3, c: -1, type: 'BODY' }, { r: 3, c: 0, type: 'BODY' }, { r: 3, c: 1, type: 'BODY' },
];

const PlanePreview = ({ translations }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % STATES.length);
    }, 3000); // 3 seconds per step
    return () => clearInterval(interval);
  }, []);

  const currentState = STATES[step];
  
  // Render Grid
  const grid = [];
  
  // Calculate occupied cells for current state
  const occupied = new Set();
  
  // Base offset to center in 5x5
  // Shape is approx centered around head(0,0).
  // Up: Head at (0,2) or (1,2) in 5x5?
  // Let's manually define 'Base Head' for each Direction to fit in 5x5
  
  let baseHeadR, baseHeadC;
  
  if (currentState.dir === 0) { // UP
      baseHeadR = 0; baseHeadC = 2;
  } else if (currentState.dir === 1) { // RIGHT
      baseHeadR = 2; baseHeadC = 4;
  } else if (currentState.dir === 2) { // DOWN
      baseHeadR = 4; baseHeadC = 2;
  } else { // LEFT
      baseHeadR = 2; baseHeadC = 0;
  }

  // Apply jitter shift
  const finalHeadR = baseHeadR + currentState.dr;
  const finalHeadC = baseHeadC + currentState.dc;

  BASE_SHAPE.forEach(part => {
    let r = part.r;
    let c = part.c;
    // Rotate
    for(let i=0; i<currentState.dir; i++) {
        const oldR = r; r = c; c = -oldR;
    }
    const absR = finalHeadR + r;
    const absC = finalHeadC + c;
    occupied.add(`${absR}-${absC}-${part.type}`);
  });

  for(let r=0; r<PREVIEW_GRID_SIZE; r++) {
      const row = [];
      for(let c=0; c<PREVIEW_GRID_SIZE; c++) {
          let type = null;
          if (occupied.has(`${r}-${c}-HEAD`)) type = 'HEAD';
          else if (occupied.has(`${r}-${c}-BODY`)) type = 'BODY';
          
          let colorClass = "bg-secondary/50 border-border/50";
          if (type === 'HEAD') colorClass = "bg-destructive border-destructive shadow-[0_0_10px_hsl(var(--destructive))]";
          if (type === 'BODY') colorClass = "bg-warning border-warning shadow-[0_0_5px_hsl(var(--warning))]";

          row.push(
              <div 
                key={`${r}-${c}`} 
                className={cn(
                    "w-full aspect-square border rounded-sm transition-all duration-500",
                    colorClass
                )}
              />
          );
      }
      grid.push(<div key={r} className="grid grid-cols-5 gap-1">{row}</div>);
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm w-full">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold flex items-center gap-2">
         <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
         {translations.targetIntel}
      </div>
      
      <div className="w-full max-w-[200px] flex flex-col gap-1 relative">
         {grid}
      </div>

      <div className="mt-4 text-[10px] text-muted-foreground text-center">
         Scanning pattern...
      </div>
    </div>
  );
};

export default PlanePreview;
