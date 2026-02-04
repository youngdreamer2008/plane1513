import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Gamepad2, HeartHandshake, FileText, Shield, HelpCircle } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
      
      <footer className="bg-card border-t border-border mt-auto py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold tracking-tight">PLANE-1513</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tactical puzzle game. Locate the hidden aircraft prototype using logic and strategy.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Game Info</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/faq" className="hover:text-primary transition-colors flex items-center gap-2"><HelpCircle className="w-3 h-3"/> FAQ</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors flex items-center gap-2"><FileText className="w-3 h-3"/> Blog & Strategy</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-primary transition-colors flex items-center gap-2"><Shield className="w-3 h-3"/> Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors flex items-center gap-2"><HeartHandshake className="w-3 h-3"/> Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>&copy; 2026 Plane1513. All rights reserved.</p>
            <p>Designed for tactical minds.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
