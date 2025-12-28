import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

export default function SearchComp({search}){
  const navigate = useNavigate();

  return(
    <>
     <div onClick={()=>{
      navigate('/search');
     }} className={`relative w-[85%] max-w-md`}>
        <img
          src="/icons/searchfood.png"
          alt="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 opacity-60"
        />
        <input
          type="text"
          onChange={search}
          placeholder="Search anything..."
          className={`w-full pl-10 pr-4 py-2 rounded-md text-sm outline-none bg-white shadow-md`}
        />
        <img
          src="/icons/mic.png"
          alt="mic"
          className="absolute border-l pl-1.5 right-3 top-1/2 -translate-y-1/2 h-4 opacity-60"
        />
      </div>
    </>
  )
}