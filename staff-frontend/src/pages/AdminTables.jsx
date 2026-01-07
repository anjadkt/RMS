import AdminHeader from "../components/AdminHeader";
import {Search , Plus , Hash} from 'lucide-react'
import AdminTableComp from "../components/AdminTableComp";
import { useEffect, useState } from "react";
import api from '../services/axios.js'

export default function AdminTables(){
  const [tables,setTables] = useState([]);
  const [loading,setLoading] = useState(false);
  const [search,setSearch] = useState("");
  const [number,setNumber] = useState("");

  async function fetchTables() {
    try {
      setLoading(true);
      const {data} = await api.get(`/table/admin?q=${search}`);
      setTables(data);

      const newNumb = Number(data[data.length-1]?.tableNumber.split("-")[1]) + 1 ;

      setNumber("TBL-" +  (newNumb < 10 ? "0"+newNumb : newNumb));
    } catch (error) {
      console.log(error.message);
    }finally{
      setLoading(false)
    }
  }

  const createTable = async ()=>{
    if(!number.includes("TBL-"))return ;
    try{
      const {data} = await api.post('/table/admin',{tableNumber : number});
      fetchTables();
    }catch(error){
      console.log(error.message);
    }
  }

  useEffect(()=>{
    fetchTables();
  },[search]);

  return (
    <>
     <AdminHeader/>
     <div className="fixed top-26 left-2 flex flex-col items-start gap-2 bg-white z-40">
        <button
         className={`flex items-center cursor-pointer justify-center gap-3 w-full text-sm font-bold py-2 px-2 rounded-sm bg-black/80 text-white shadow-lg transition-all`}>
          Tables
        </button>
     </div>

     <main className="pt-24 pb-10 px-6 ml-20 bg-gray-50/50 min-h-screen">
        
      <div className="flex justify-between items-end gap-6 mb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Tables</h1>
          <p className="text-gray-500 text-sm mt-1">Add or remove Tables from your Store</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input 
              type="text"
              onChange={(e)=>setSearch(e.target.value)}
              defaultValue={"TBL-"}
              placeholder='Search By Table Number...' 
              className="w-full text-gray-600 font-medium bg-white border border-gray-200 py-2.5 pl-10 pr-6 rounded-xl outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-10">

        <div className="max-w-3xs w-full bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-full">
      
          <div className="flex items-center gap-2 mb-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
              <Plus size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                New Table
              </h1>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black">
                <Hash size={14} />
              </div>
              <input 
                type="text" 
                onChange={(e)=>setNumber(e.target.value)}
                placeholder="Table Number"
                defaultValue={number || ""} 
                className="w-full bg-gray-50 border outline-none border-gray-600 rounded-xl py-3 pl-9 pr-4 text-sm font-bold transition-all"
              />
            </div>
          </div>

          <button 
            onClick={createTable}
            className="w-full flex items-center justify-center gap-2 bg-black/80 cursor-pointer text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <Plus size={16} strokeWidth={3} />
            Create Table
          </button>

        </div>

        {
          loading ? (
            <div className="flex justify-center mt-10">
              <span className="inline-block text-center h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) :
          tables.map((v,i)=>(
            <AdminTableComp data={v}/>
          ))
        }
      </div>

     </main>
    </>
  )
}