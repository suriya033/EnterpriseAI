import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, FileText, ChevronRight } from 'lucide-react';
import { chatService } from '../services/api';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your Enterprise AI Assistant. Ask me anything about your uploaded documents.', sources: [] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatService.query(input, messages);
      const botMsg = { 
        role: 'bot', 
        content: response.data.answer, 
        sources: response.data.sources 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error processing your request.', sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 h-[calc(100vh-2rem)] flex flex-col w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-6 py-8 pr-4 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`space-y-3 p-6 rounded-3xl glass-card border-white/10 ${msg.role === 'user' ? 'bg-indigo-600/10' : 'bg-blue-600/5'}`}>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-white/10">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-blue-400">
                            <FileText size={12} />
                            {src.split('/').pop()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Loader2 className="animate-spin" size={20} />
            </div>
            <div className="p-6 rounded-3xl glass-card border-white/10 italic text-slate-400">
              Analysing documents...
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="pb-8 pt-4">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your documents..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-[0.2em]">
          AI may hallucinate. Always verify with sources provided.
        </p>
      </div>
    </div>
  );
};

export default Chat;
