import React, { useState, useEffect } from 'react';
import { generatePlanePosition, calculateScore, LEVELS, PLANE_PARTS } from '@/lib/gameLogic';
import PlanePreview from './PlanePreview';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Target, Crosshair, RefreshCcw, Trophy, AlertTriangle } from 'lucide-react';
import { cn } from "@/lib/utils";

const CELL_STATES = {
  UNKNOWN: 'UNKNOWN',
  MISS: 'MISS',     // Green
  HURT: 'HURT',     // Yellow
  HEAD: 'HEAD',     // Red (Win)
};

const GamePage = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState('PLAYING'); // PLAYING, WON, LOST, FINISHED_ALL
  const [planeCells, setPlaneCells] = useState([]);
  const [gridState, setGridState] = useState({}); // { "r-c": CELL_STATES.X }
  const [clicks, setClicks] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]); // Array of click coords for replay/undo if needed? No, just visual.

  // Initialize Level
  const initLevel = (levelId) => {
    const config = LEVELS[levelId];
    if (!config) {
        setGameState('FINISHED_ALL');
        return;
    }
    
    const plane = generatePlanePosition(config.rows, config.cols);
    if (!plane) {
        console.error("Failed to generate plane");
        return;
    }

    setPlaneCells(plane);
    setGridState({});
    setClicks(0);
    setScore(0);
    setGameState('PLAYING');
    setHistory([]);
  };

  useEffect(() => {
    initLevel(currentLevel);
  }, [currentLevel]);

  const handleCellClick = (r, c) => {
    if (gameState !== 'PLAYING') return;
    const key = `${r}-${c}`;
    if (gridState[key]) return; // Already clicked

    const newClicks = clicks + 1;
    setClicks(newClicks);

    // Check hit
    const hitPart = planeCells.find(p => p.r === r && p.c === c);
    
    let newState = CELL_STATES.MISS;
    if (hitPart) {
      if (hitPart.type === PLANE_PARTS.HEAD) {
        newState = CELL_STATES.HEAD;
        // WIN CONDITION
        const lvlConfig = LEVELS[currentLevel];
        const finalScore = calculateScore(newClicks, lvlConfig.idealClicks);
        setScore(finalScore);
        
        if (finalScore >= 60) {
            setGameState('WON');
        } else {
            setGameState('LOST');
        }
      } else {
        newState = CELL_STATES.HURT;
      }
    }

    setGridState(prev => ({
      ...prev,
      [key]: newState
    }));
  };

  const handleNextLevel = () => {
    if (LEVELS[currentLevel + 1]) {
        setCurrentLevel(curr => curr + 1);
    } else {
        setGameState('FINISHED_ALL');
    }
  };

  const handleRetry = () => {
    initLevel(currentLevel);
  };

  const renderGrid = () => {
    if (gameState === 'FINISHED_ALL') return null;
    const config = LEVELS[currentLevel];
    const grid = [];

    for (let r = 0; r < config.rows; r++) {
      const rowCells = [];
      for (let c = 0; c < config.cols; c++) {
        const key = `${r}-${c}`;
        const state = gridState[key] || CELL_STATES.UNKNOWN;
        
        let cellClass = "bg-secondary hover:bg-secondary/80 border-border";
        let content = null;

        if (state === CELL_STATES.MISS) {
            cellClass = "bg-success text-success-foreground border-success ring-2 ring-inset ring-success/20";
            content = "MISS";
        } else if (state === CELL_STATES.HURT) {
            cellClass = "bg-warning text-warning-foreground border-warning ring-2 ring-inset ring-warning/20";
            content = "HURT";
        } else if (state === CELL_STATES.HEAD) {
            cellClass = "bg-destructive text-destructive-foreground border-destructive ring-4 ring-inset ring-destructive/30";
            content = "BOOM";
        }

        // Show plane if game over (reveal)
        if ((gameState === 'WON' || gameState === 'LOST') && state === CELL_STATES.UNKNOWN) {
            const part = planeCells.find(p => p.r === r && p.c === c);
            if (part) {
                cellClass = "opacity-50 " + (part.type === PLANE_PARTS.HEAD ? "bg-destructive/50" : "bg-warning/20");
            }
        }

        rowCells.push(
          <button
            key={key}
            onClick={() => handleCellClick(r, c)}
            disabled={gameState !== 'PLAYING' || state !== CELL_STATES.UNKNOWN}
            className={cn(
              "relative aspect-square w-full rounded-md border transition-all duration-300 flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm overflow-hidden group",
              cellClass
            )}
          >
            {state === CELL_STATES.UNKNOWN && gameState === 'PLAYING' && (
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                    <Crosshair className="w-4 h-4 opacity-0 group-hover:opacity-50 text-primary transition-opacity" />
                </div>
            )}
            <span className={cn("z-10 animate-in zoom-in duration-300", state === CELL_STATES.UNKNOWN ? "opacity-0" : "opacity-100")}>
                {content}
            </span>
          </button>
        );
      }
      grid.push(<div key={r} className="grid grid-cols-5 gap-2 sm:gap-3">{rowCells}</div>);
    }
    return <div className="flex flex-col gap-2 sm:gap-3 w-full max-w-[400px] mx-auto">{grid}</div>;
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan"></div>
         <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <header className="relative z-10 flex justify-between items-center mb-8 max-w-5xl mx-auto w-full">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">PLANE-1513</h1>
                <p className="text-xs text-muted-foreground tracking-widest uppercase">Tactical Strike System</p>
            </div>
         </div>
         <div className="hidden sm:flex items-center gap-6">
             <div className="text-right">
                 <div className="text-xs text-muted-foreground uppercase">Current Level</div>
                 <div className="text-xl font-mono font-bold text-primary">{currentLevel} / {Object.keys(LEVELS).length}</div>
             </div>
             <div className="text-right">
                 <div className="text-xs text-muted-foreground uppercase">Clicks</div>
                 <div className="text-xl font-mono font-bold text-foreground">{clicks}</div>
             </div>
         </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
         
         {/* Left Panel: Game Board */}
         <div className="lg:col-span-7 flex flex-col items-center">
            <Card className="w-full p-6 sm:p-8 bg-card/50 backdrop-blur border-primary/10 shadow-2xl relative">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40 -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/40 -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/40 -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/40 -mb-1 -mr-1"></div>
                
                <div className="mb-6 flex justify-between items-center lg:hidden">
                    <span className="text-sm font-bold text-primary">LVL {currentLevel}</span>
                    <span className="text-sm font-mono">{clicks} CLICKS</span>
                </div>

                {gameState === 'FINISHED_ALL' ? (
                     <div className="aspect-square w-full max-w-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-primary/30 rounded-lg bg-primary/5">
                        <Trophy className="w-16 h-16 text-primary mb-4 animate-bounce" />
                        <h2 className="text-3xl font-bold mb-2">Mission Complete!</h2>
                        <p className="text-muted-foreground">You have cleared all available sectors.</p>
                        <div className="mt-8 text-2xl font-mono text-primary animate-pulse">To be continued...</div>
                     </div>
                ) : (
                    renderGrid()
                )}
            </Card>

            <div className="mt-8 text-center max-w-md">
                 <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-primary font-bold mr-2">MISSION:</span>
                    Locate and destroy the enemy aircraft prototype. The aircraft has a 1-5-1-3 structure. 
                    Striking the <span className="text-destructive font-bold">Cockpit (Head)</span> destroys the unit instantly.
                 </p>
            </div>
         </div>

         {/* Right Panel: Radar & Info */}
         <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <h3 className="text-sm font-semibold mb-4 text-foreground flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-primary" /> 
                    TARGET INTEL
                </h3>
                <PlanePreview />
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <h3 className="text-sm font-semibold mb-4 text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" /> 
                    STATUS LOG
                </h3>
                <div className="space-y-3 font-mono text-sm h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {gridState && Object.entries(gridState).map(([key, state], idx) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 animate-in slide-in-from-left-2">
                            <span className="text-muted-foreground">SEC-{key.replace('-', ':')}</span>
                            <span className={cn(
                                "font-bold",
                                state === 'MISS' && "text-success",
                                state === 'HURT' && "text-warning",
                                state === 'HEAD' && "text-destructive"
                            )}>{state}</span>
                        </div>
                    ))}
                    {Object.keys(gridState).length === 0 && (
                        <div className="text-muted-foreground italic text-center py-8">
                            Awaiting coordinate input...
                        </div>
                    )}
                </div>
            </Card>
         </div>

      </main>

      {/* Result Dialog */}
      <Dialog open={gameState === 'WON' || gameState === 'LOST'} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle className={cn("text-2xl font-bold flex items-center gap-2", gameState === 'WON' ? "text-primary" : "text-destructive")}>
              {gameState === 'WON' ? <Trophy className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              {gameState === 'WON' ? "SECTOR CLEARED" : "MISSION FAILED"}
            </DialogTitle>
            <DialogDescription className="text-lg">
                Performance Evaluation
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-background rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground uppercase mb-1">Total Clicks</div>
                    <div className="text-2xl font-mono font-bold">{clicks}</div>
                </div>
                <div className="p-4 bg-background rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground uppercase mb-1">Score</div>
                    <div className={cn("text-2xl font-mono font-bold", score >= 60 ? "text-green-500" : "text-red-500")}>
                        {score}
                    </div>
                </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
                {gameState === 'WON' 
                    ? "Target neutralized. Airspace secure. Proceeding to next sector."
                    : "Target lost. Reinforcements required. Resetting simulation."}
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            {gameState === 'WON' ? (
                <Button onClick={handleNextLevel} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                    PASS - NEXT LEVEL
                </Button>
            ) : (
                <Button onClick={handleRetry} variant="destructive" className="w-full sm:w-auto">
                    FAIL - RETRY
                </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamePage;
