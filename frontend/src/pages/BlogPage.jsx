import React from 'react';
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Game
        </Link>
        
        <h1 className="text-3xl font-black text-foreground mb-8">Tactical Briefings & Blog</h1>
        
        <div className="space-y-8">
          <article className="prose prose-invert max-w-none">
            <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 text-primary mb-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-bold">Strategy Guide</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">Mastering the 1-5-1-3 Pattern</h2>
              <p className="text-muted-foreground mb-4">
                The key to Plane-1513 isn't just luck—it's understanding geometry. The 5-cell wide wingspan is your biggest clue. 
                If you get a "HURT" (Yellow) on a cell, think about the possible orientations. 
                Could this be the center of the wing? Or the tip?
              </p>
              <div className="text-xs text-muted-foreground">Posted on Oct 12, 2025 • By Command Central</div>
            </Card>
          </article>

          <article className="prose prose-invert max-w-none">
            <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 text-primary mb-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-bold">History</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">Origins of the Radar Logic Game</h2>
              <p className="text-muted-foreground mb-4">
                Based on the classic paper-and-pencil game "Airplane Chess" (not the board game), this logic puzzle has entertained students for decades.
                We've digitized it into a modern tactical experience.
              </p>
              <div className="text-xs text-muted-foreground">Posted on Sep 28, 2025 • By Command Central</div>
            </Card>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
