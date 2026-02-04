import React, { useState, useEffect, useRef } from 'react';
import { generatePlanePosition, calculateScore, LEVELS, PLANE_PARTS } from '@/lib/gameLogic';
import PlanePreview from '@/components/game/PlanePreview';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Crosshair, RefreshCcw, Trophy, AlertTriangle, Settings, Volume2, VolumeX, Globe } from 'lucide-react';
import { cn } from "@/lib/utils";
import { getTranslation } from '@/lib/i18n';
import { soundManager } from '@/lib/sound';

const CELL_STATES = {
  UNKNOWN: 'UNKNOWN',
  MISS: 'MISS',     
  HURT: 'HURT',     
  HEAD: 'HEAD',     
};

const GamePage = () => {
  const [lang, setLang] = useState('en');
  const t = getTranslation(lang);
  
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState('PLAYING'); 
  const [planeCells, setPlaneCells] = useState([]);
  const [gridState, setGridState] = useState({});
  const [clicks, setClicks] = useState(0);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initial Language Detect
  useEffect(() => {
    const browserLang = navigator.language || 'en';
    setLang(browserLang);
  }, []);

  // Update Sound Manager
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

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
  };

  useEffect(() => {
    initLevel(currentLevel);
  }, [currentLevel]);

  const handleCellClick = (r, c) => {
    if (gameState !== 'PLAYING') return;
    const key = `${r}-${c}`;
    if (gridState[key]) return; 

    soundManager.playClick();

    const newClicks = clicks + 1;
    setClicks(newClicks);

    const hitPart = planeCells.find(p => p.r === r && p.c === c);
    
    let newState = CELL_STATES.MISS;
    if (hitPart) {
      if (hitPart.type === PLANE_PARTS.HEAD) {
        newState = CELL_STATES.HEAD;
        soundManager.playBoom();
        
        const lvlConfig = LEVELS[currentLevel];
        const finalScore = calculateScore(newClicks, lvlConfig.idealClicks);
        setScore(finalScore);
        
        if (finalScore >= 60) {
            setGameState('WON');
            soundManager.playWin();
        } else {
            setGameState('LOST');
            soundManager.playLose();
        }
      } else {
        newState = CELL_STATES.HURT;
        soundManager.playHurt();
      }
    } else {
        soundManager.playMiss();
    }

    setGridState(prev => ({
      ...prev,
      [key]: newState
    }));
  };

  const isPlaneCell = (r, c) => {
      return planeCells.some(p => p.r === r && p.c === c);
  };
  
  const getBorderClasses = (r, c) => {
      if (gameState === 'PLAYING') return "";
      
      // Check if this cell is part of the plane
      if (!isPlaneCell(r,c)) return "";

      // Check neighbors
      const isTop = !isPlaneCell(r-1, c);
      const isBottom = !isPlaneCell(r+1, c);
      const isLeft = !isPlaneCell(r, c-1);
      const isRight = !isPlaneCell(r, c+1);

      return cn(
          isTop && "border-t-4 border-t-foreground",
          isBottom && "border-b-4 border-b-foreground",
          isLeft && "border-l-4 border-l-foreground",
          isRight && "border-r-4 border-r-foreground"
      );
  };

  const renderGrid = () => {
    if (gameState === 'FINISHED_ALL') return null;
    const config = LEVELS[currentLevel];
    const grid = [];

    // Grid Container Style to match rows/cols
    const gridStyle = {
        gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`
    };

    for (let r = 0; r < config.rows; r++) {
      const rowCells = [];
      for (let c = 0; c < config.cols; c++) {
        const key = `${r}-${c}`;
        const state = gridState[key] || CELL_STATES.UNKNOWN;
        
        // Visual Logic
        // DEFAULT STATE: Tactical Grid Look
        let bgClass = "bg-secondary border border-primary/20 hover:border-primary/50"; 
        let textClass = "text-secondary-foreground";
        let content = null;
        let borderClass = "";

        if (state === CELL_STATES.MISS) {
            bgClass = "bg-success border-success";
            textClass = "text-success-foreground";
            content = t.miss;
        } else if (state === CELL_STATES.HURT) {
            bgClass = "bg-warning border-warning";
            textClass = "text-warning-foreground";
            content = t.hurt;
        } else if (state === CELL_STATES.HEAD) {
            bgClass = "bg-destructive border-destructive";
            textClass = "text-destructive-foreground animate-pulse";
            content = t.boom;
        }

        // Reveal Logic
        if ((gameState === 'WON' || gameState === 'LOST')) {
            const part = planeCells.find(p => p.r === r && p.c === c);
            if (state === CELL_STATES.UNKNOWN) {
                if (part) {
                    // Unclicked Body
                    bgClass = part.type === PLANE_PARTS.HEAD ? "bg-destructive/80 border-destructive" : "bg-warning/80 border-warning";
                } else {
                    // Unclicked Empty -> Greenish background, NO text
                    bgClass = "bg-success/20 border-success/30";
                }
            }
            // Add Outline
            borderClass = getBorderClasses(r, c);
        }

        rowCells.push(
          <button
            key={key}
            onClick={() => handleCellClick(r, c)}
            disabled={gameState !== 'PLAYING'}
            className={cn(
              "relative aspect-square w-full rounded-sm transition-all duration-200 flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold overflow-hidden group cursor-pointer select-none touch-manipulation",
              bgClass,
              textClass,
              borderClass
            )}
          >
            {/* Hover Crosshair Effect (Only when playing) */}
            {gameState === 'PLAYING' && state === CELL_STATES.UNKNOWN && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none flex items-center justify-center z-20">
                    <div className="w-full h-[1px] bg-primary/50 absolute"></div>
                    <div className="h-full w-[1px] bg-primary/50 absolute"></div>
                    <div className="w-8 h-8 rounded-full border border-primary/80 absolute animate-ping"></div>
                    <div className="w-1 h-1 bg-primary rounded-full absolute"></div>
                </div>
            )}
            
            <span className="z-10 relative">{content}</span>
          </button>
        );
      }
      grid.push(...rowCells);
    }
    return (
        <div className="grid gap-1 sm:gap-2 w-full max-w-[90vw] sm:max-w-[400px] mx-auto p-1 sm:p-2 bg-card border border-border rounded-lg shadow-xl" style={gridStyle}>
            {grid}
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col relative overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Dynamic Radar Cursor (Global) */}
      <style>{`
          .cursor-radar {
            cursor: crosshair;
          }
      `}</style>

      {/* Header */}
      <header className="relative z-10 flex flex-col sm:flex-row justify-between items-center mb-6 max-w-5xl mx-auto w-full gap-4 sm:gap-0">
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
                <Target className="w-6 h-6 text-primary animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="flex-1 sm:flex-none">
                <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-foreground leading-none">{t.title}</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase truncate">{t.subtitle}</p>
            </div>
             <div className="flex items-center gap-2 sm:hidden ml-auto">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSoundEnabled(!soundEnabled)}>
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                </Button>
            </div>
         </div>
         
         <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
             <div className="hidden sm:block">
                <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                </Button>
             </div>
             
             <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-border pt-2 sm:pt-0 mt-2 sm:mt-0">
                <div className="text-center sm:text-right">
                    <div className="text-[10px] text-muted-foreground uppercase">{t.level}</div>
                    <div className="text-lg sm:text-xl font-mono font-bold text-primary leading-none">{currentLevel}</div>
                </div>
                <div className="text-center sm:text-right sm:hidden">
                    <div className="text-[10px] text-muted-foreground uppercase">{t.clicks}</div>
                    <div className="text-lg sm:text-xl font-mono font-bold text-foreground leading-none">{clicks}</div>
                </div>
             </div>
         </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pb-24 lg:pb-0">
         
         {/* Game Area */}
         <div className="lg:col-span-7 flex flex-col items-center w-full">
            
            {gameState === 'FINISHED_ALL' ? (
                 <Card className="w-full max-w-md p-8 sm:p-12 flex flex-col items-center text-center bg-card/80 backdrop-blur">
                    <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-primary mb-6 animate-bounce" />
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.winTitle}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-8">{t.winDesc}</p>
                    <div className="text-lg sm:text-xl font-mono text-primary animate-pulse">{t.toBeContinued}</div>
                 </Card>
            ) : (
                <div className="w-full flex justify-center relative cursor-radar">
                   {renderGrid()}
                </div>
            )}

            <div className="mt-6 sm:mt-8 text-center max-w-md px-4 py-3 bg-card/50 rounded-lg border border-border/50 w-full">
                 <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <span className="text-primary font-bold mr-2 block sm:inline">{t.mission}:</span>
                    {t.missionDesc}
                 </p>
            </div>
         </div>

         {/* Sidebar: Radar & Log */}
         <div className="lg:col-span-5 space-y-4 w-full">
            {/* On Mobile: Stack vertically or hide/collapse if needed. Keeping visible for game logic help. */}
            <Card className="p-0 bg-transparent border-none shadow-none">
                <PlanePreview translations={t} />
            </Card>

            <Card className="p-4 bg-card/80 backdrop-blur border-border shadow-lg flex-1 min-h-[150px] sm:min-h-[200px]">
                <h3 className="text-xs font-bold mb-3 text-muted-foreground uppercase flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-warning" /> 
                    {t.statusLog}
                </h3>
                <div className="space-y-2 font-mono text-xs h-[150px] sm:h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(gridState).reverse().map(([key, state], idx) => (
                        <div key={key} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0 animate-in slide-in-from-left-2 fade-in duration-300">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full"></span>
                                {t.sector}-{key.replace('-', ':')}
                            </span>
                            <span className={cn(
                                "font-bold px-2 py-0.5 rounded text-[10px]",
                                state === CELL_STATES.MISS && "bg-success/20 text-success",
                                state === CELL_STATES.HURT && "bg-warning/20 text-warning",
                                state === CELL_STATES.HEAD && "bg-destructive/20 text-destructive"
                            )}>
                                {state === CELL_STATES.MISS && t.miss}
                                {state === CELL_STATES.HURT && t.hurt}
                                {state === CELL_STATES.HEAD && t.boom}
                            </span>
                        </div>
                    ))}
                    {Object.keys(gridState).length === 0 && (
                        <div className="text-muted-foreground italic text-center py-8 opacity-50">
                            {t.awaitingInput}
                        </div>
                    )}
                </div>
            </Card>
         </div>
      </main>

      {/* Result Bottom Sheet (Non-blocking) */}
      {(gameState === 'WON' || gameState === 'LOST') && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="max-w-2xl mx-auto bg-card border border-primary/20 shadow-2xl rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ring-1 ring-white/10">
                <div className="flex-1 text-center sm:text-left">
                     <h3 className={cn("text-2xl font-black mb-1", gameState === 'WON' ? "text-primary" : "text-destructive")}>
                        {gameState === 'WON' ? t.winTitle : t.loseTitle}
                     </h3>
                     <p className="text-sm text-muted-foreground">{gameState === 'WON' ? t.winDesc : t.loseDesc}</p>
                     
                     <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
                         <div>
                             <div className="text-[10px] uppercase text-muted-foreground">{t.clicks}</div>
                             <div className="text-xl font-mono font-bold">{clicks}</div>
                         </div>
                         <div className="w-px bg-border h-10 hidden sm:block"></div>
                         <div>
                             <div className="text-[10px] uppercase text-muted-foreground">{t.yourScore}</div>
                             <div className={cn("text-xl font-mono font-bold", score >= 60 ? "text-green-500" : "text-red-500")}>{score}</div>
                         </div>
                         <div className="w-px bg-border h-10 hidden sm:block"></div>
                         <div>
                             <div className="text-[10px] uppercase text-muted-foreground">{t.passScore}</div>
                             <div className="text-xl font-mono font-bold text-muted-foreground">60</div>
                         </div>
                     </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                    {gameState === 'WON' ? (
                        <Button size="lg" onClick={() => setCurrentLevel(l => l + 1)} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
                            {t.nextLevel}
                        </Button>
                    ) : (
                        <Button size="lg" onClick={() => initLevel(currentLevel)} variant="destructive" className="w-full sm:w-auto font-bold shadow-lg shadow-destructive/20">
                            {t.retry}
                        </Button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
