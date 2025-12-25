import { useState } from "react";
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"

export default function Header(){
  const {login,name} = useSelector(state => state.user);
  const logo = useSelector(state => state.website.logo);
  const navigate = useNavigate();

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 px-3 py-1 flex items-center justify-between">
        
        <div className="flex items-center text-lg">
          <img
            src={logo}
            alt="logo"
            className="h-12 w-auto"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-base font-medium text-gray-600">
          <div onClick={()=>navigate('/home')} className="cursor-pointer hover:text-[#cd0045] transition">Home</div>
          <div onClick={()=>navigate('/')} className="cursor-pointer hover:text-[#cd0045] transition">Menu</div>
          <div onClick={()=>navigate('/offers')} className="cursor-pointer hover:text-[#cd0045] transition">Offers</div>
        </nav>

        {login ? (
          <div className="text-right">
            <p className="text-sm text-gray-700 text-left">
              Hello, <span className="font-medium">{name || ""}</span>
            </p>
            <p className="text-xs text-gray-400">
              Welcome to Paragon!
            </p>
          </div>
        ) : (
          <button onClick={()=>navigate('/login')} className="bg-[#cd0045] hover:bg-[#b8003f] text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            Login
          </button>
        )}

      </header>
    </>
  )
}