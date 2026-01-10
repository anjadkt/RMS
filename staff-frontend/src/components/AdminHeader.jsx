import { NavLink , useNavigate } from 'react-router-dom';
import api from '../services/axios.js'
import {useDispatch} from 'react-redux'
import {setLogout} from '../app/features/user/userSlice.js'

export default function AdminHeader() {
  const routes = [
    { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Orders", link: "/admin/orders" },
    { name: "Products", link: "/admin/products" },
    { name: "Users", link: "/admin/users" },
    { name: "Tables", link: "/admin/tables" },
    { name: "Settings", link: "/admin/settings" }
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setUserLogout = async () => {
    try {
      await api.get('/user/logout');
      dispatch(setLogout());
      navigate('/login');
    } catch (error) {}
  };
  

  return (
    <header className="fixed top-0 z-50 w-full flex items-center justify-between bg-white border-b px-10 py-3 border-slate-200">

      <div className="flex items-center gap-2">

        <div className="h-8 w-8 bg-black/90 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <span className="text-xl font-bold text-black/80">
          AdminPanel
        </span>
      </div>

      <nav className="flex items-center space-x-6">
        {routes.map((route) => (
          <NavLink
            key={route.name}
            to={route.link}
            className={({ isActive }) => `
              inline-flex items-center pt-1 border-b-2 text-[16px] font-medium transition-all duration-200
              ${isActive 
                ? "border-black text-black" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}
            `}
          >
            {route.name}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:text-slate-700 cursor-pointer">

          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>

        </button>
        
        <button onClick={setUserLogout} className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200">
          <span>Logout</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
        
      </div>

    </header>
  );
}