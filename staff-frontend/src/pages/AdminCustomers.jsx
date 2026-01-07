import AdminHeader from "../components/AdminHeader";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import api from '../services/axios.js';
import StaffCard from '../components/StaffCard.jsx'

export default function AdminCustomers(){
    const [customers , setCustomers] = useState([]);
    const [loading,setLoading] = useState(false);

    async function fetchCustomers(search){
      try{
        setLoading(true);
        const {data} = await api.get(`/staff/admin?q=${search}&user=customer`);
        setCustomers(data);
      }catch(error){
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    }

    useEffect(()=>{
     fetchCustomers("");
    },[])
  return (
    <>
     <AdminHeader/>
     <main className="pt-24 pb-10 px-6 ml-24 bg-gray-50/50 min-h-screen" >

      <div className="flex justify-between items-end gap-6 mb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Customers</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
              Viewing {customers.length} registered customers
            </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input 
              type="text"
              onChange={(e)=>fetchCustomers(e.target.value)} 
              placeholder='Search By Number...' 
              className="w-full text-gray-600 font-medium bg-white border border-gray-200 py-2.5 pl-10 pr-6 rounded-xl outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className={`flex flex-wrap gap-5 ${loading ? "justify-center" : ""}`}>
        {
          loading ? (
            <div className="flex justify-center mt-10">
              <span className="inline-block text-center h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : 
          customers.map((v,i)=>(
            <StaffCard data={v} />
          ))
        }
      </div>

     </main>
    </>
  )
}