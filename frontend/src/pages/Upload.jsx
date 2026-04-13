import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, Link as LinkIcon, FileText, CheckCircle, XCircle, Loader2, Globe } from 'lucide-react';
import { documentService } from '../services/api';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await documentService.list();
      setDocuments(res.data.documents);
    } catch (err) {
      console.error(err);
    }
  };

  const onDrop = async (acceptedFiles) => {
    // Initialize status for all files
    const initialFiles = acceptedFiles.map(file => ({
      name: file.name,
      status: 'uploading',
      size: (file.size / 1024).toFixed(1) + ' KB'
    }));
    setFiles(prev => [...initialFiles, ...prev]);
    setUploading(true);

    for (const file of acceptedFiles) {
      try {
        await documentService.upload(file);
        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'success' } : f
        ));
      } catch (err) {
        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'error' } : f
        ));
      }
    }
    
    setUploading(false);
    fetchDocs();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!url || scraping) return;
    setScraping(true);
    try {
      await documentService.scrape(url);
      setUrl('');
      fetchDocs();
    } catch (err) {
      alert("Failed to scrape website");
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="pt-32 pb-20 w-full max-w-6xl mx-auto px-6">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
        >
          Ingest Knowledge
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-lg"
        >
          Upload your documents or scrape websites to build your personal Enterprise AI knowledge base.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            {...getRootProps()} 
            className={`group border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer bg-white/5 backdrop-blur-xl ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-6">
              <div className={`p-6 rounded-2xl transition-transform duration-500 group-hover:scale-110 ${isDragActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'bg-blue-600/20 text-blue-400'}`}>
                <UploadIcon size={40} />
              </div>
              <div>
                <p className="text-xl font-bold mb-2">
                  {isDragActive ? "Drop files now" : "Drag & drop files here"}
                </p>
                <p className="text-slate-500 text-sm">PDF, DOCX, TXT up to 50MB</p>
              </div>
            </div>
          </motion.div>

          {/* Uploading Status List */}
          {files.length > 0 && (
            <div className="glass-card rounded-3xl border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Recent Uploads</h3>
                <button onClick={() => setFiles([])} className="text-xs text-slate-500 hover:text-white">Clear</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5">
                {files.map((file, i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${file.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-slate-500">{file.size}</p>
                      </div>
                    </div>
                    <div>
                      {file.status === 'uploading' && <Loader2 className="animate-spin text-blue-400" size={18} />}
                      {file.status === 'success' && <CheckCircle className="text-green-500" size={18} />}
                      {file.status === 'error' && <XCircle className="text-red-500" size={18} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <motion.form 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleScrape} 
            className="glass-card p-8 rounded-[2rem] border-white/10 bg-white/5 backdrop-blur-xl flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600/20 rounded-xl text-indigo-400">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Website Scraper</h3>
                <p className="text-xs text-slate-500">Extract text content from any public URL</p>
              </div>
            </div>
            <div className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/docs"
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                required
              />
              <button 
                type="submit"
                disabled={scraping}
                className="bg-indigo-600 hover:bg-indigo-700 px-8 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-3 shadow-lg shadow-indigo-500/25"
              >
                {scraping ? <Loader2 className="animate-spin" size={20} /> : <LinkIcon size={20} />}
                Scrape
              </button>
            </div>
          </motion.form>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-400/20 rounded-lg text-blue-400">
                <FileText size={20} />
              </div>
              Knowledge Base
              <span className="text-sm font-normal text-slate-500 bg-white/5 px-3 py-1 rounded-full">{documents.length} files</span>
            </h2>
          </div>
          
          <div className="glass-card rounded-[2rem] border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden min-h-[400px]">
            <div className="max-h-[600px] overflow-y-auto divide-y divide-white/5">
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                  <div className="p-6 bg-white/5 rounded-full text-slate-600">
                    <FileText size={48} />
                  </div>
                  <p className="text-slate-500 italic">No documents indexed yet.</p>
                </div>
              ) : (
                documents.map((doc, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="p-5 flex items-center justify-between hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm truncate max-w-[250px]">{doc}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Ready for Chat</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <CheckCircle className="text-green-500/50 group-hover:text-green-500 transition-colors" size={20} />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
