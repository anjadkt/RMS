import React, { useState } from 'react';

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="pt-10 pb-6 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            {isAdmin ? 'Admin Dashboard' : 'Staff Portal'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Please enter your details to continue</p>
        </div>

        {/* Custom Toggle Switch */}
        <div className="px-8 mb-8">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex relative items-center">
            {/* Animated Slider Background */}
            <div 
              className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-transform duration-300 ease-out ${
                isAdmin ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
            
            <button 
              onClick={() => setIsAdmin(false)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${!isAdmin ? 'text-blue-600' : 'text-slate-500'}`}
            >
              Staff
            </button>
            <button 
              onClick={() => setIsAdmin(true)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${isAdmin ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="px-8 pb-10">
          {!isAdmin ? (
            /* Staff Form */
            <form key="staff" className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Staff ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. ST-4432" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2 ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</button>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] mt-2">
                Sign In as Staff
              </button>
            </form>
          ) : (
            /* Admin Form */
            <form key="admin" className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="admin@corp.com" 
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                  />
                  <button type="button" className="absolute right-3 top-2 text-[10px] bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg font-black hover:bg-indigo-100 transition-colors">
                    SEND OTP
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">OTP</label>
                  <input 
                    type="text" 
                    placeholder="0000" 
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-center tracking-[0.5em] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Admin Pass</label>
                  <input 
                    type="password" 
                    placeholder="••••" 
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] mt-2">
                Authorize Admin
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;