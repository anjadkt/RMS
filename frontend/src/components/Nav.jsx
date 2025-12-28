import { NavLink } from "react-router-dom";
import { useState,useEffect } from "react";
import {useDispatch,useSelector} from 'react-redux'
import {setScroll} from '../app/features/website/webSlice.js'

export default function Nav() {
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();
  const {scroll :lastScrollY} = useSelector(state=> state.website);

  useEffect(() => {

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShow(false);
      } 

      if(!currentScrollY)setShow(true);

      dispatch(setScroll(currentScrollY));
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, [lastScrollY]);

  return (
    <div className=
    {
      `md:hidden fixed bottom-0.5 left-1/2 -translate-x-1/2 z-50
      transition-transform duration-300 ease-in-out
      ${show ? "translate-y-0" : "translate-y-40"}
    `}>
      <div className="flex bg-black border border-[#cd0045] rounded-full p-1 shadow-sm">

        <NavLink
          to="/home"
          className={({ isActive }) =>
            `px-5 py-1.5 text-sm font-semibold rounded-full transition
            ${
              isActive
                ? "bg-[#cd0045] text-white"
                : "text-white"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-5 py-1.5 text-sm font-semibold rounded-full transition
            ${
              isActive
                ? "bg-[#cd0045] text-white"
                : "text-white"
            }`
          }
        >
          Menu
        </NavLink>

                <NavLink
          to="/history"
          className={({ isActive }) =>
            `px-5 py-1.5 text-sm font-semibold rounded-full transition
            ${
              isActive
                ? "bg-[#cd0045] text-white"
                : "text-white"
            }`
          }
        >
          History
        </NavLink>

      </div>
    </div>
  );
}
