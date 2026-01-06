import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Timer } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/axios';

export default function StaffSetPassword() {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const setPin = async () => {
    try {
      setLoading(true);
      setError({}); 
      const { data } = await api.post("/auth/staff", { pin: password, token });
      navigate('/login');
    } catch (error) {
      if (error.response?.status === 400) {
        setError({ common: "Must be a 6-digit PIN" });
      } else {
        setError({ common: "Link expired or invalid" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <span className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col items-center justify-center p-4">
      
      <div className="mb-6 text-center">
        <div className="bg-black w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic">WELCOME TO PARAGON</h1>
      </div>

      <div className="w-full max-w-[360px] md:bg-white rounded-[2rem] md:p-8 md:shadow-xl md:border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="text-center md:text-left mb-6">
          <p className="text-gray-400 text-sm font-medium">Set your 6-digit access PIN</p>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-2 text-amber-600 mb-8">
          <Timer size={14} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-widest">Expires in 5m</span>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          setPin();
        }} className="space-y-4">
          
          <div className="space-y-1.5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={16} className={`${error.common ? 'text-red-500' : 'text-gray-400'} group-focus-within:text-black transition-colors`} />
              </div>
              <input 
                type="password"
                maxLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter 6-digit PIN"
                className={`w-full bg-white border-2 rounded-2xl py-2 pl-11 pr-4 text-xs tracking-[0.5em] font-black outline-none transition-all shadow-sm
                  ${error.common 
                    ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100'
                  }`}
              />
            </div>
            {error.common && (
              <p className="text-red-600 text-[11px] font-bold ml-2 animate-bounce">
                {error.common}
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.96]"
          >
            Continue 
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-tight">
          Secure Connection Guaranteed
        </p>
      </div>

      <div className="hidden md:block fixed -bottom-20 -left-20 w-64 h-64 bg-gray-200/30 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}