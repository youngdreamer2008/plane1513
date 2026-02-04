import React from 'react';
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Game
        </Link>
        
        <h1 className="text-3xl font-black text-foreground mb-8">Frequently Asked Questions</h1>
        
        <div className="grid gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <h3 className="text-lg font-bold text-primary mb-2">How do I play Plane-1513?</h3>
            <p className="text-muted-foreground">
              Your mission is to find the hidden enemy aircraft on the grid. Click on grid cells to launch a tactical strike. 
              Green means MISS (no hit), Yellow means HURT (wing/body hit), and Red means HEAD/BOOM (you found the cockpit and destroyed the unit).
            </p>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <h3 className="text-lg font-bold text-primary mb-2">What is the "1-5-1-3" shape?</h3>
            <p className="text-muted-foreground">
              The plane is shaped like a cross:
              <br/>- Row 1: Head (1 cell)
              <br/>- Row 2: Wings + Body (5 cells wide)
              <br/>- Row 3: Body (1 cell)
              <br/>- Row 4: Tail (3 cells wide)
              <br/>Use the "Target Intel" preview on the game screen to visualize the shape.
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <h3 className="text-lg font-bold text-primary mb-2">How is the score calculated?</h3>
            <p className="text-muted-foreground">
              Score = 100 - 40 * (YourClicks - 1) / (Par - 1). 
              <br/>Basically, finding the head in fewer clicks gives a higher score. You need at least 60 points to pass to the next level.
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <h3 className="text-lg font-bold text-primary mb-2">Is it free?</h3>
            <p className="text-muted-foreground">
              Yes, Plane-1513 is completely free to play with no registration required.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
