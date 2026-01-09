import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { Bell, LogOut, User, X } from "lucide-react"; // Added X icon
import { useState } from "react";
import api from "../services/axios";
import { setLogout } from '../app/features/user/userSlice.js';
import { useEffect } from "react";

export default function Header() {
  const { login } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const settings = useSelector(state => state.website.settings);

  const [notifications,setNotifications] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const setUserLogout = async () => {
    try {
      setLoading(true);
      await api.get('/user/logout');
      dispatch(setLogout());
      navigate('/');
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  async function fetchNoti(){
    try{
      setLoading(true);
      const {data} = await api.get('auth/user');
      setNotifications(data.userData.notification);
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  };

  const deleteNotification = async(id) =>{
    try{
      setLoading(true);
      await api.get(`/user/order/notification/${id}`);
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchNoti();
  },[])

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
            {/* Notification Wrapper */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 cursor-pointer rounded-full transition-colors relative ${showNotifications ? 'bg-rose-50 text-[#cd0045]' : 'text-slate-500 hover:bg-rose-50'}`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Dropdown Panel */}
              {showNotifications && (
                <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)}></div>
                  
                  <div className="absolute lg:right-0 -right-20 mt-4 lg:mt-2  w-2xs sm:w-80 bg-white border border-rose-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-rose-50 bg-rose-50/30 flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-widest text-black">Notifications</h3>
                      <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">{notifications.length}</span>
                    </div>

                    <div className="max-height-[400px] overflow-y-auto max-h-[70vh]">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n._id} className="p-4 border-b border-gray-50 flex justify-between gap-3 hover:bg-slate-50 transition-colors group">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-[#cd0045] uppercase tracking-tight">From: {n.from}</span>
                              <p className="text-sm text-slate-600 font-medium leading-tight">{n.message}</p>
                            </div>
                            <div>
                              
                              <button 
                                onClick={()=>deleteNotification(n._id)}
                                className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center flex flex-col items-center gap-2">
                          <Bell size={24} className="text-slate-200" />
                          <p className="text-xs font-bold text-slate-400 uppercase">No new alerts</p>
                        </div>
                      )}
                    </div>
                    
                  </div>
                </>
              )}
            </div>

            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
            
            <button 
              onClick={setUserLogout}
              className="flex items-center cursor-pointer justify-center gap-2 pl-2 pr-4 py-2 rounded-full bg-rose-50 text-[#cd0045] font-bold text-xs hover:bg-rose-100 transition-all"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-3 border-[#cd0045] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-[#cd0045] flex items-center justify-center text-white">
                      <User size={14} fill="currentColor" />
                  </div>
                  <span className="hidden sm:inline">Logout</span>
                  <LogOut size={14} className="sm:hidden" />
                </>
              )}
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