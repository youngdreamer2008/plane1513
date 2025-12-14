import React, { useState, useEffect } from 'react';
import { Plane, MousePointer2 } from 'lucide-react';
import { cn } from "@/lib/utils";

const PlanePreview = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 90) % 360);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Simple visual representation of 1-5-1-3
  // We can build a mini grid or use divs.
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold flex items-center gap-2">
         <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
         Target Schematics
      </div>
      
      <div 
        className="relative transition-transform duration-1000 ease-in-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Plane Body Construction */}
        <div className="flex flex-col items-center gap-0.5">
           {/* Head (1) */}
           <div className="w-4 h-4 bg-primary/20 border border-primary/50"></div>
           {/* Wings (5) */}
           <div className="flex gap-0.5">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-4 h-4 bg-primary/20 border border-primary/50"></div>
             ))}
           </div>
           {/* Body (1) */}
           <div className="w-4 h-4 bg-primary/20 border border-primary/50"></div>
           {/* Tail (3) */}
           <div className="flex gap-0.5">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-4 h-4 bg-primary/20 border border-primary/50"></div>
             ))}
           </div>
        </div>

        {/* Axis Lines for decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[1px] bg-primary/10 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[150%] w-[1px] bg-primary/10 -z-10"></div>
      </div>
      
      <div className="mt-6 text-[10px] text-muted-foreground text-center max-w-[150px]">
        Auto-rotating every 10s. <br/> Target orientation is randomized.
      </div>
    </div>
  );
};

export default PlanePreview;
