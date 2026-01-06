import { NavLink, Outlet } from "react-router-dom";
import api from "../services/axios";
import {useState,useEffect} from "react"

export default function AdminUsersLayout() {
  const [loading,setLoading] = useState(false);
  const [form,setForm] = useState({
    q : "",
    user : "staffs"
  });
  const [users,setUsers] = useState([])

  const handleChange = (e)=>{
    setForm(pre => (
      {...pre , [e.target.name] : e.target.value}
    ))
  }

  async function fetchUsers(){
    try{
      setLoading(true);
      const {data} = await api.get(`/staff/admin?q=${form.q}&user=${form.user}`);
      setUsers(data);
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchUsers();
  },[form])

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

      <Outlet context={{
        users,
        loading,
        fetchUsers,
        handleChange,
        setForm,
        form
      }} />
    </>
  );
}
