import React, { useEffect, useState } from 'react';
import { ShoppingCart, Table, CirclePlus, LogOut, Bell } from 'lucide-react';
import { NavLink , useNavigate } from 'react-router-dom';
import {setLogout} from '../app/features/user/userSlice.js'
import api from '../services/axios.js'
import {useDispatch} from 'react-redux'

export default function Nav() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    { name: 'Orders', icon: <ShoppingCart size={20} />, href: '/waiter/orders' },
    { name: 'Create', icon: <CirclePlus size={20} />, href: '/waiter/order', primary: true },
    { name: 'Tables', icon: <Table size={20} />, href: '/waiter/tables' },
    { name: 'Updates', icon: <Bell size={20} />, href: '/waiter/updates' }, // Added Updates
  ];

  const setUserLogout = async () => {
    try {
      await api.get('/user/logout');
      dispatch(setLogout());
      navigate('/login');
    } catch (error) {}
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show if scrolling up, hide if scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShow(false);
      } else {
        setShow(true);
      }
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed z-50 transition-transform duration-300 ease-in-out bg-slate-900 border-slate-800
      /* Mobile Styles */
      bottom-0 left-0 w-full h-16 border-t flex items-center justify-around px-2
      ${!show ? "translate-y-full" : "translate-y-0"}
      /* Desktop Styles */
      lg:top-0 lg:left-0 lg:h-screen lg:w-54 lg:flex-col lg:justify-between lg:py-8 lg:px-4 lg:border-r lg:translate-y-0`}>
      
      {/* Brand Logo - Desktop Only */}
      <div className="hidden lg:flex items-center gap-3 px-4 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">P</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">PSD <span className="text-blue-500">Waiter</span></h1>
      </div>

      <ul className="flex w-full justify-around lg:flex-col lg:gap-2 lg:justify-start">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1 lg:w-full">
            <NavLink 
              to={item.href}
              className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-200
                lg:flex-row lg:justify-start lg:gap-4 lg:px-4 lg:py-3
                ${isActive 
                  ? "text-blue-400 bg-blue-400/10 lg:bg-blue-600 lg:text-white shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"}
              `}
            >
              <span className={`shrink-0 ${item.primary ? "text-blue-500 lg:text-inherit" : ""}`}>
                {item.icon}
              </span>
              <span className="text-[10px] lg:text-base font-medium uppercase lg:capitalize tracking-wide">
                {item.name}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Logout - Desktop Only */}
      <div className="hidden lg:block w-full border-t border-slate-800 pt-6">
        <button onClick={setUserLogout} className="flex cursor-pointer items-center gap-4 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors group">
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}