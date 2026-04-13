import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Upload from './pages/Upload';

import Dashboard from './pages/Dashboard';

const Admin = () => <div className="pt-32 px-10"><h1>Admin Panel Coming Soon</h1></div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center w-full overflow-x-hidden">
          <div className="w-full max-w-7xl px-4 md:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
