import { useState } from "react";
import {useSelector} from "react-redux"
import {useNavigate,NavLink} from "react-router-dom"

export default function Header(){
  const {login,name} = useSelector(state => state.user);
  const logo = useSelector(state => state.website.logo);
  const navigate = useNavigate();

  return (
    <>
      <header className="
        fixed top-0 left-0 z-50
        w-full bg-gray-50 border-b border-gray-200 px-3 py-1 flex items-center justify-between
        lg:py-2
      ">
        
        <div className="flex items-center">
          <img
            src={logo}
            alt="logo"
            className="h-12 lg:h-14 w-auto"
          />
        </div>

        <nav className="
          hidden md:flex items-center gap-6 text-base font-medium
          lg:text-lg
        ">
          <NavLink
           to='/home'
           className={({isActive})=>`cursor-pointer ${isActive ? "text-[#cd0045]" : "text-gray-600"}`}
          >
            Home
          </NavLink>
          <NavLink
           to='/'
           className={({isActive})=>`cursor-pointer ${isActive ? "text-[#cd0045]" : "text-gray-600"}`}
          >
            Menu
          </NavLink>
          <NavLink
           to='/history'
           className={({isActive})=>`cursor-pointer ${isActive ? "text-[#cd0045]" : "text-gray-600"}`}
          >
            History
          </NavLink>
        </nav>

        {login ? (
          <div className="text-right">
            <p className="text-sm lg:text-xl text-gray-700 text-left">
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