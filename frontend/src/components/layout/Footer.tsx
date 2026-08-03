import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Globe, Share2, Code2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs py-12 light:bg-slate-900 light:text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 text-white">
                <Terminal className="w-5 h-5 font-bold" />
              </div>
              <span className="text-xl font-black text-white">DevBattles</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              The premier AI-powered developer learning platform. Practice algorithmic challenges, build frontend projects, get real-time AI code reviews, and compete in global college battles.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white border border-slate-800" title="GitHub">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white border border-slate-800" title="Community">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white border border-slate-800" title="LinkedIn">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/questions" className="hover:text-white transition-colors">Question Bank</Link></li>
              <li><Link to="/workspace/q-101" className="hover:text-white transition-colors">Coding Workspace</Link></li>
              <li><Link to="/contests" className="hover:text-white transition-colors">Coding Contests</Link></li>
              <li><Link to="/ai-reviews" className="hover:text-white transition-colors">AI Code Reviews</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing & Plans</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/sitemap" className="hover:text-white transition-colors">Sitemap & IA</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Enterprise */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3">Colleges</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-white transition-colors">College Portal</Link></li>
              <li><Link to="/mentor" className="hover:text-white transition-colors">Mentor Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Super Admin Portal</Link></li>
              <li><span className="text-emerald-400 font-semibold">● All Systems Operational</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© 2026 DevBattles Inc. Designed with precision for global developers.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
