import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Shield, Zap, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    { icon: <Search className="text-blue-400" />, title: "Precision RAG", desc: "Retrieve accurate answers directly from your corporate documents with citation." },
    { icon: <Shield className="text-indigo-400" />, title: "Enterprise Security", desc: "Your data stays private. Advanced hallucination control ensures reliability." },
    { icon: <Zap className="text-purple-400" />, title: "Real-time Processing", desc: "Instant text extraction and embedding for documents and websites." },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/10 text-blue-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Powered by Llama 3 & GPT-4
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            Connect Your <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Corporate Brain</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Enterprise AI Chatbot with RAG capabilities. Upload PDFs, Docx, or URLs and get instant, context-aware answers with source citations.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex gap-4 pt-4"
        >
          <Link to="/chat" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg transition-all premium-shadow flex items-center gap-2">
            Get Started <Bot size={20} />
          </Link>
          <Link to="/upload" className="px-8 py-4 glass-card hover:bg-white/10 rounded-2xl font-bold text-lg transition-all border-white/10">
            Upload Documents
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 w-full pt-20">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-3xl glass-card border-white/5 text-left hover:border-white/20 transition-all group"
            >
              <div className="p-3 w-fit rounded-2xl bg-white/5 mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
