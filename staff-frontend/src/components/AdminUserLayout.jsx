import { NavLink, Outlet } from "react-router-dom";
import api from "../services/axios";
import {useState,useEffect} from "react"

export default function AdminUsersLayout() {

  return (
    <>
      <div className="fixed top-26 left-1 flex flex-col items-start gap-2 bg-white z-40">
        
        <NavLink
          to="staffs"
          className={({ isActive }) =>
            `flex items-center justify-center gap-3 w-full text-sm font-bold py-2 px-2 rounded-sm shadow-lg transition-all
             ${isActive ? "bg-black/80 text-white" : "text-slate-600 hover:bg-gray-100"}`
          }
        >
          Staffs
        </NavLink>

        <NavLink
          to="customers"
          className={({ isActive }) =>
            `flex items-center justify-center gap-3 w-full text-sm font-bold py-2 px-2 rounded-sm shadow-lg transition-all
             ${isActive ? "bg-black/80 text-white" : "text-slate-600 hover:bg-gray-100"}`
          }
        >
          Customers
        </NavLink>

      </div>

      <Outlet />
    </>
  );
}
