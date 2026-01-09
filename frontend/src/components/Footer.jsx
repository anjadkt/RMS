import {useEffect , useState} from 'react'
import api from '../services/axios.js'
import {useSelector} from 'react-redux'

export default function Footer() {
  const {settings} = useSelector(state => state.website);

  return (
    <footer className="bg-[#0A0A0B] text-slate-400 mt-20 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2 space-y-6">
          <img className="h-16 brightness-0 invert" src={settings?.logo} alt="Logo" />
          <p className="text-sm leading-relaxed max-w-sm">
            Paragon is dedicated to delivering authentic flavors and a dining experience that keeps people coming back. Every dish is crafted with passion since 1930.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Contact Us</h3>
          <div className="space-y-3 text-sm font-medium">
            <p className="hover:text-white transition-colors">📍 {settings?.location}</p>
            <p className="hover:text-white transition-colors">📞 +91 {settings?.phone}</p>
            <p className="hover:text-white transition-colors">✉️ {settings?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Operating Hours</h3>
          <p className="text-sm font-medium leading-relaxed">
            Available 7 days a week<br/>
            <span className="text-rose-500 font-bold">{settings.restaurentTimes}</span>
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-white/5 pt-2 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
          © {new Date().getFullYear()} Paragon Excellence.
        </p>
      </div>
    </footer>
  );
}