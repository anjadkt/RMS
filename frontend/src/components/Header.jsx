import { useSelector , useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";
import { useState } from "react";
import api from "../services/axios";
import {setLogout} from '../app/features/user/userSlice.js'

export default function Header() {
  const { login } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const settings = useSelector(state => state.website.settings);
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const setUserLogout = async () =>{
    try{
      setLoading(true);
      await api.get('/user/logout');
      dispatch(setLogout());
      navigate('/');
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white backdrop-blur-md border-b border-rose-100 px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <img src={settings.logo} alt="logo" className="h-10 lg:h-12 w-auto object-contain" />
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-black uppercase tracking-widest">
        {['home', '', 'history'].map((path) => (
          <NavLink
            key={path}
            to={`/${path}`}
            className={({ isActive }) =>
              `transition-colors duration-300 ${isActive ? "text-[#cd0045]" : "text-slate-400 hover:text-slate-600"}`
            }
          >
            {path === '' ? 'Menu' : path}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {login ? (
          <>
            <button className="p-2 cursor-pointer text-slate-500 hover:bg-rose-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
            <button 
              onClick={setUserLogout}
              className="flex items-center  cursor-pointer justify-center gap-2 pl-2 pr-4 py-2 rounded-full bg-rose-50 text-[#cd0045] font-bold text-xs hover:bg-rose-100 transition-all"
            >
              {
                loading ? (
                  <span className="inline-block h-4 w-4 border-3 border-[#cd0045] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-[#cd0045] flex items-center justify-center text-white">
                        <User size={14} fill="currentColor" />
                    </div>
                    <span className="hidden sm:inline">Logout</span>
                    <LogOut size={14} className="sm:hidden" />
                  </>
                )
              }
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            className="bg-[#cd0045] cursor-pointer hover:bg-[#b8003f] text-white text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-full transition-all shadow-lg shadow-rose-200"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}