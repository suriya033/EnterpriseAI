import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, MessageSquare, PieChart, Activity } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    documents: 0,
    queries: 0,
    storage_used: '0MB'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, icon: <Users className="text-blue-400" />, trend: '+12%' },
    { label: 'Documents', value: stats.documents, icon: <FileText className="text-indigo-400" />, trend: '+5' },
    { label: 'Total Queries', value: stats.queries, icon: <MessageSquare className="text-purple-400" />, trend: '+156' },
    { label: 'Storage', value: stats.storage_used, icon: <PieChart className="text-pink-400" />, trend: 'Low' },
  ];

  return (
    <div className="pt-32 pb-20 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold">Enterprise Dashboard</h1>
          <p className="text-slate-400 mt-2">Monitor your AI infrastructure and document processing.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 glass-card rounded-xl text-sm font-medium border-white/10">Export Report</button>
          <button className="px-4 py-2 bg-blue-600 rounded-xl text-sm font-medium premium-shadow">Refresh Data</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl">{card.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${card.trend.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {card.trend}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm mb-1">{card.label}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-blue-400" /> System Activity
            </h3>
          </div>
          <div className="h-64 flex items-end gap-2 px-4">
            {[40, 70, 45, 90, 65, 80, 55, 75, 50, 85, 60, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-slate-500 uppercase tracking-widest px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border-white/10">
          <h3 className="text-xl font-bold mb-6">Recent Alerts</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-400"></div>
              <div>
                <p className="text-sm font-medium">New document indexed</p>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-indigo-400"></div>
              <div>
                <p className="text-sm font-medium">API usage peak detected</p>
                <p className="text-xs text-slate-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-400"></div>
              <div>
                <p className="text-sm font-medium">System backup completed</p>
                <p className="text-xs text-slate-500">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
