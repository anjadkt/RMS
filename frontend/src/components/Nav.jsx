import { NavLink } from "react-router-dom";
import { useState,useEffect } from "react";

export default function Nav() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, [lastScrollY]);

  return (
    <div className=
    {
      `md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-50
      transition-transform duration-300 ease-in-out
      ${show ? "translate-y-0" : "translate-y-40"}
    `}>
      <div className="flex bg-white border border-[#cd0045] rounded-full p-1 shadow-sm">

        <NavLink
          to="/home"
          className={({ isActive }) =>
            `px-5 py-1.5 text-sm font-semibold rounded-full transition
            ${
              isActive
                ? "bg-[#cd0045] text-white"
                : "text-[#cd0045]"
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
                : "text-[#cd0045]"
            }`
          }
        >
          Menu
        </NavLink>

      </div>
    </div>
  );
}
