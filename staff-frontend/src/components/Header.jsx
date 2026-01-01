import { LogOut, Package, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  
  return (
    <header className={
      `hidden lg:flex fixed top-0 z-50 w-full items-center justify-between 
      px-10 py-2 bg-white border-b border-slate-200`}>
      
      <div className="flex items-center gap-1">
        <div className="bg-black/80 p-2 rounded-xl shadow-lg shadow-blue-200">
          <div className="text-white font-bold text-sm">ORDER</div>
        </div>
        <div className="ml-2 hidden xl:block">
          <span className="text-xs font-bold text-slate-400 uppercase block">Management</span>
          <span className="text-sm font-bold text-slate-700 uppercase">System</span>
        </div>
      </div>

      <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
        <NavLink 
          to="/kitchen/orders"
          className={({isActive})=>`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            isActive
            ? 'bg-white text-black shadow-sm' 
            : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart size={18} />
          Orders
        </NavLink>
        
        <NavLink 
          to="/kitchen/products"
          className={({isActive})=>`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            isActive 
            ? 'bg-white text-black shadow-sm' 
            : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package size={18} />
          Products
        </NavLink>
      </nav>

      <div className="flex items-center gap-4">

        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-sm">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}