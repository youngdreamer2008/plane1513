import React from 'react';
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Game
        </Link>
        
        <h1 className="text-3xl font-black text-foreground mb-8">Terms of Service</h1>
        
        <Card className="p-8 bg-card/50 backdrop-blur border-border space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          
          <h2 className="text-lg font-bold text-foreground">1. Acceptance</h2>
          <p>By accessing Plane-1513, you agree to these Terms of Service.</p>
          
          <h2 className="text-lg font-bold text-foreground">2. Usage License</h2>
          <p>Permission is granted to temporarily play the materials (information or software) on Plane-1513's website for personal, non-commercial transitory viewing only.</p>
          
          <h2 className="text-lg font-bold text-foreground">3. Disclaimer</h2>
          <p>The materials on Plane-1513's website are provided on an 'as is' basis. Plane-1513 makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
          
          <h2 className="text-lg font-bold text-foreground">4. Limitations</h2>
          <p>In no event shall Plane-1513 or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on Plane-1513's website.</p>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
