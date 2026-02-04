import React from 'react';
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Game
        </Link>
        
        <h1 className="text-3xl font-black text-foreground mb-8">Privacy Policy</h1>
        
        <Card className="p-8 bg-card/50 backdrop-blur border-border space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          
          <h2 className="text-lg font-bold text-foreground">1. Data Collection</h2>
          <p>Plane-1513 is designed with privacy in mind. We do not require account registration. We do not collect personally identifiable information (PII) such as names, emails, or phone numbers.</p>
          
          <h2 className="text-lg font-bold text-foreground">2. Local Storage</h2>
          <p>We use your browser's Local Storage to save your game progress (unlocked levels) and settings (sound preferences). This data never leaves your device.</p>
          
          <h2 className="text-lg font-bold text-foreground">3. Analytics</h2>
          <p>We use anonymous usage statistics to improve game balance (e.g., win rates per level). This data is aggregated and cannot be traced back to individual users.</p>
          
          <h2 className="text-lg font-bold text-foreground">4. Cookies</h2>
          <p>We use only essential cookies required for the site's functionality.</p>
          
          <h2 className="text-lg font-bold text-foreground">5. Contact</h2>
          <p>For privacy concerns, please contact legal@plane1513.com.</p>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
