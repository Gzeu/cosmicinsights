import React, { ReactNode } from 'react';
import Header from './Header';
import { Github, Twitter, Globe } from 'lucide-react';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/10 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-500/10 to-transparent" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
        
        <footer className="border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Footer Info */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-gray-300 text-sm font-medium">
                    GPZ-94 AI Smart Contracts
                  </p>
                  <p className="text-gray-500 text-xs">
                    Powered by MultiversX • Built with ❤️ by George Pricop
                  </p>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/Gzeu/cosmicinsights" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
                  title="GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://cosmicinsights.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
                  title="Live Demo"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <div className="h-4 w-px bg-gray-600" />
                <div className="text-xs text-gray-500">
                  v1.0.0 • DevNet
                </div>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="mt-4 pt-4 border-t border-gray-700/30 text-center">
              <p className="text-xs text-gray-500">
                © 2025 GPZ-94 Project. All rights reserved. 
                <span className="mx-2">•</span>
                <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                <span className="mx-2">•</span>
                <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;