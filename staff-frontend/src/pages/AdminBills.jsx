import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import {Search,} from 'lucide-react'
import api from "../services/axios";
import AdminBillComp from '../components/AdminBillComp.jsx'

export default function AdminBills(){
  const [search,setSearch] = useState("");
  const [active,setAcitve] = useState("unpaid");
  const [bills,setBills] = useState([]);
  const [loading,setLoading] = useState(false);

  const status = [
    { name: "all" },
    { name: "unpaid" },
    { name: "prepaid" },
    { name: "paid" }
  ]

  async function fetchBills(){
    try{
      setLoading(true);
      const {data} = await api.post('/waiter/bills',{paymentStatus : active , q : search});
      setBills(data);
    }catch(error){
      console.log(error.message)
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchBills();
  },[active,search])
  return(
    <>
     <AdminHeader/>

     <div className="fixed top-26 left-1 flex flex-col items-start gap-2 bg-white z-40">
        <button
          className={`flex items-center cursor-pointer justify-center gap-3 w-full text-sm font-bold py-2 px-4 rounded-sm ${"bg-black/80 text-white"}  shadow-lg transition-all`}>
          All Bills
        </button>
      </div>

     <main className="pt-24 pb-10 px-6 ml-26">

      <div className="flex justify-between gap-6 mb-5">

        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Bills</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage Today's All bills</p>
        </div>
        
        <div className="relative group w-sm mr-16">

          <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={22} className="text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          </div>

          <input 
            type="text" 
            defaultValue={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder='Search Bill ID...' 
            className="w-full text-gray-600 font-semibold bg-white border border-gray-200 py-2.5 pl-10 pr-6 rounded-xl outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
          />
        </div>

      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2 py-2 bg-white sticky top-14 z-40">
        <div className="flex items-start gap-2 overflow-x-auto no-scrollbar  px-2 rounded-xs py-1">
          {status.map((v, i) => (
            <button 
              key={i}
              onClick={()=>setAcitve(v.name)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border
              cursor-pointer
              ${v.name === active
                ? 'bg-black text-white border-black shadow-md' 
                : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex flex-wrap ${bills.length < 1 ? "justify-center" : "items-start"} gap-2 gap-y-10 bg-white rounded-xl py-3 px-4 border border-gray-100`}>
        {
          loading ? (
            <div className="flex items-center justify-center h-40 w-full">
              <span className="inline-block h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : 
          bills.length < 1 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 border border-dashed     border-gray-300 rounded-xl bg-gray-50 text-center">
                <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 text-gray-600">
                  📭
                </div>
                <h2 className="text-lg font-semibold text-gray-700">
                  No Bills Found
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Bills will appear here once waiter make them.
                </p>
            </div>
          ) : (
            bills.map((v,i)=>(
              <AdminBillComp fetchBills={fetchBills} data={v} />
            ))
          )
          
        }
      </div>

     </main>
    </>
  )
}