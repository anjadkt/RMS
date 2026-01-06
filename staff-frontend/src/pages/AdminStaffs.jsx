import AdminHeader from "../components/AdminHeader";
import { Search, UserPlus, Filter } from "lucide-react";
import StaffCard from '../components/StaffCard';
import { useOutletContext } from 'react-router-dom';
import AdminStaffModal from '../components/AdminStaffModal.jsx'
import { useState } from "react";

export default function AdminStaffs() {
  const { fetchUsers, users, handleChange, loading ,setForm ,form } = useOutletContext();
  const [show,setShow] = useState(false);

  return (
    <>
      <AdminHeader />
      <main className="pt-24 pb-10 px-6 ml-24 bg-gray-50/50 min-h-screen">
        
        <div className="flex justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Staffs</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor and manage your restaurant team members</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>
              <input 
                type="text"
                name="q"
                onChange={handleChange}
                placeholder='Search By Staff ID...' 
                className="w-full text-gray-600 font-medium bg-white border border-gray-200 py-2.5 pl-10 pr-6 rounded-xl outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
              />
            </div>

            <button
             onClick={()=>setShow(true)}
             className="flex cursor-pointer items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md shadow-black/10 active:scale-95">
              <UserPlus size={18} />
              Create Staff
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-100 w-full">
          <button
           onClick={()=>{
            setForm(pre => (
              {...pre , user : "staffs"}
            ))
           }}
           className={`px-3 py-1 cursor-pointer text-sm font-bold ${form.user === "staffs" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}  rounded-sm transition-all`}>
            All
          </button>
          <button
           onClick={()=>{
            setForm(pre => (
              {...pre , user : "cook"}
            ))
           }}
           className={`px-3 py-1 cursor-pointer text-sm font-bold ${form.user === "cook" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}  rounded-sm transition-all`}>
            Cooks
          </button>
          <button
           onClick={()=>{
            setForm(pre => (
              {...pre , user : "waiter"}
            ))
           }}
           className={`px-3 py-1 cursor-pointer text-sm font-bold ${form.user === "waiter" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}  rounded-sm transition-all`}>
            Waiters
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-6 w-6 border-3 border-t-transparent rounded-full border-black"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {users?.length > 0 ? (
              users.map((v) => (
                <StaffCard data={v} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium">No staff members found.</p>
              </div>
            )}
          </div>
        )}

      </main>
      {
        show && (
          <AdminStaffModal fetchUsers={fetchUsers} setShow={setShow}/>
        )
      }
    </>
  );
}