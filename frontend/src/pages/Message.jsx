import React, { useState } from 'react';
import { Send, User, Bot, ShieldCheck, Sparkles } from 'lucide-react';
import Header from "../components/Header";

export default function Message() {
  const [activeTab, setActiveTab] = useState('manager'); 
  const [inputValue, setInputValue] = useState('');

  const dummyMessages = {
    manager: [
      { id: 1, sender: 'manager', text: 'Hello! I am the floor manager. How can I assist you?', time: '10:00 AM' },
      { id: 2, sender: 'user', text: 'I need to add a chair to Table 4.', time: '10:02 AM' },
      { id: 2, sender: 'user', text: 'I need to add a chair to Table 4.', time: '10:02 AM' },
      { id: 2, sender: 'user', text: 'I need to add a chair to Table 4.', time: '10:02 AM' },
      { id: 1, sender: 'manager', text: 'Hello! I am the floor manager. How can I assist you?', time: '10:00 AM' },
    ],
    ai: [
      { id: 1, sender: 'ai', text: 'Hi! I can help with menu details or dietary info. What are you looking for?', time: 'Just now' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />

      {/* Main Container - Floating with Shadow */}
      <main className="lg:mt-16 mt-10 flex flex-col items-center flex-grow w-full mx-auto bg-white md:rounded-3xl shadow-xl overflow-hidden relative">
        
        {/* TOP TOGGLE - Softer Glassmorphism feel */}
        <div className="p-5 bg-white/80 w-full lg:w-sm backdrop-blur-md sticky top-0 lg:left-1/2 lg:-translate-x-1/2 z-10">
          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl transition-all">
            <button
              onClick={() => setActiveTab('manager')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === 'manager' 
                ? 'bg-white text-black shadow-md transform scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck size={18} className={activeTab === 'manager' ? 'text-black' : 'text-slate-400'} />
              Manager
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === 'ai' 
                ? 'bg-white text-black shadow-md transform scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Sparkles size={18} className={activeTab === 'ai' ? 'text-black' : 'text-slate-400'} />
              AI Assistant
            </button>
          </div>
        </div>

        {/* MESSAGES AREA - No borders, soft colors */}
        <div className="flex-grow overflow-y-auto p-6 px lg:w-xl max-w-3xl space-y-6 bg-gradient-to-b from-white to-slate-50/50 pb-30">
          {dummyMessages[activeTab].map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`max-w-[85%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar with soft shadow */}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-100'
                }`}>
                  {msg.sender === 'user' ? <User size={18} /> : (msg.sender === 'ai' ? <Bot size={18} /> : <ShieldCheck size={18} />)}
                </div>
                
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-50'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 font-medium uppercase tracking-wider">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM INPUT - Pill shape with depth */}
        <div className="fixed bottom-0 p-5 bg-transparent rounded-2xl w-full lg:w-lg">
          <div className="relative flex items-center group">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Write to ${activeTab === 'manager' ? 'Manager' : 'AI'}...`}
              className="w-full bg-slate-100 text-slate-700 rounded-2xl pl-5 pr-14 py-4 text-sm lg:w-lg focus:outline-none ring-1 focus:ring-2  focus:bg-white transition-all border-none shadow-inner"
            />
            <button 
              type="button"
              disabled={!inputValue.trim()}
              className="absolute right-2 p-2.5 bg-gray-800 text-white rounded-xl shadow-lg shadow-indigo-200 active:scale-95 disabled:bg-slate-200 disabled:shadow-none transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}