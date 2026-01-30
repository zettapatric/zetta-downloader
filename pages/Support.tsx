
import React, { useState } from 'react';
import { submitSupportTicket } from '../services/mockApi';

const SupportHub: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'agent', text: 'Hello! How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await submitSupportTicket(subject, message);
    setIsSending(false);
    setSubmitted(true);
    setSubject('');
    setMessage('');
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', text: inputMessage }]);
    setInputMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'agent', text: 'Thank you for your message. An agent will be with you shortly. Currently we are experiencing high volume.' }]);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in pb-20">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Support Center</h1>
          <p className="text-slate-400">We usually respond to tickets within 24 hours.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-6">Email Support</h3>
          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-600/20 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto">
                <i className="fas fa-check"></i>
              </div>
              <h4 className="text-xl font-bold text-white">Ticket Submitted!</h4>
              <p className="text-slate-400">Check your inbox for a confirmation email.</p>
              <button onClick={() => setSubmitted(false)} className="text-blue-500 font-bold hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                <input 
                  type="text" 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Download Error on TikTok"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSending}
                className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-white font-black transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {isSending ? <i className="fas fa-circle-notch animate-spin"></i> : 'Send Support Ticket'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="flex flex-col h-full space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fas fa-comments text-blue-500"></i>
          Live Chat Assistance
        </h3>
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] flex flex-col flex-1 min-h-[500px] overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="https://ui-avatars.com/api/?name=Support+Agent&background=0D8ABC&color=fff" className="w-10 h-10 rounded-full" alt="Agent" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Zetta Support</p>
                <p className="text-[10px] text-green-500 uppercase font-black">Online</p>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[80%] p-4 rounded-[20px] text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSend} className="p-4 bg-slate-800/30 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 text-sm"
            />
            <button type="submit" className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportHub;
