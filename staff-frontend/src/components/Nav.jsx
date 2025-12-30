import React from 'react';
import { ShoppingCart, Table, Bell, LogOut } from 'lucide-react';
import { useEffect,useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav() {
  const [show , setShow] = useState(true);
  const [lastScrollY,setScrollY] = useState(0);

  const navItems = [
    { name: 'Orders', icon: <ShoppingCart size={20} />, href: '/' },
    { name: 'Tables', icon: <Table size={20} />, href: '/tables' },
    { name: 'Updates', icon: <Bell size={20} />, href: '/updates' },
  ];


  useEffect(() => {

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShow(false);
      }

      if(!currentScrollY){
        setShow(true);
      }

      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, [lastScrollY]);

  return (
    <nav className={`fixed bg-slate-900 text-white z-50
      bottom-0 left-0 w-full h-14 flex items-center justify-around
      transition-all duration-300 ease-in-out
      ${!show ? "translate-y-20 lg:translate-y-0 xl:translate-y-0": "translate-y-0" }
      lg:-top-2 lg:left-0 lg:h-screen lg:w-42 lg:flex-col lg:justify-between lg:py-10 lg:px-4`}>
      
      <div className="hidden lg:block">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">PSD</h1>
      </div>

      <ul className="flex w-full justify-around lg:flex-col lg:gap-4 lg:justify-start">
        {navItems.map((item) => (
          <li key={item.name} className="w-full">
            <NavLink 
              to={item.href}
              className={
                ({isActive}) => `flex flex-col items-center gap-1 p-2 lg:flex-row lg:gap-4 lg:px-4 lg:py-3 lg:rounded-lg
                ${isActive ? "bg-black/30 text-white" : "text-white/60"}
                `
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-xs lg:text-lg font-medium">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="hidden lg:block w-full">
        <button className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};