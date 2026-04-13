import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Upload, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-8 pt-4">
      <div className="w-full max-w-7xl glass-card rounded-2xl border-white/10 premium-shadow flex items-center justify-between px-6 h-16">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent decoration-none">
          <Bot className="text-blue-400" />
          <span>Enterprise AI</span>
        </Link>
        
        <div className="flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/chat" className="hover:text-white transition-colors flex items-center gap-2">
            <Bot size={18} /> Chat
          </Link>
          <Link to="/upload" className="hover:text-white transition-colors flex items-center gap-2">
            <Upload size={18} /> Upload
          </Link>
          <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-2">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/admin" className="hover:text-white transition-colors flex items-center gap-2">
            <Settings size={18} /> Admin
          </Link>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all font-semibold shadow-lg shadow-blue-500/20">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
