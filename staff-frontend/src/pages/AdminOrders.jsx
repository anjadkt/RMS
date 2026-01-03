import { useState ,useEffect } from 'react';
import AdminHeader from '../components/AdminHeader.jsx'
import AdminOrderComp from '../components/AdminOrderComp.jsx'
import api from '../services/axios.js'
import {Search} from 'lucide-react'

export default function AdminOrders() {

  const today = new Date().toISOString().slice(0, 10).split("-").join("");
  const sampleId = "ODR"+ "-" + today + "-" ;

  const [orders,setOrders] = useState([]);
  const [loading ,setLoading] = useState(false);

  const [filter,setFilter] = useState("none");
  const [stat,setStat] = useState("all");
  const [search,setSearch] = useState(sampleId);
  const [todays,setTodays] = useState(true);

  const filters = ["none","customers", "waiters", "tables"];

  const status = [
    { name: "all" },
    { name: "placed" },
    { name: "accepted" },
    { name: "preparing" },
    { name: "ready" },
    { name: "served" },
    { name: "pending" },
    { name: "completed" }
  ]

  async function fetchOrders(){
    try{
      setLoading(true);
      const {data} = await api.get(`admin/orders?q=${search}&f=${filter}&s=${stat}&t=${todays}`);
      setOrders(data);
    }catch(error){
      console.log(error.message);
    }finally{
    setLoading(false);
    }
  }

  useEffect(()=>{
    fetchOrders();
  },[search,stat,filter,todays]);


  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="fixed top-26 left-1 flex flex-col items-start gap-2 bg-white z-40">
        <button
         onClick={()=>{
          setTodays(true)
          setSearch(sampleId);
         }} 
         className={`flex items-center cursor-pointer justify-center gap-3 w-full text-sm font-bold py-2 px-2 rounded-sm ${todays ? "bg-black/80 text-white" : "text-slate-600"}  shadow-lg transition-all`}>
          TODAY
        </button>
        <button onClick={()=>{
          setTodays(false);
          setSearch("");
        }} className={`flex items-center cursor-pointer justify-center gap-3 w-full text-sm font-bold py-2 px-2 rounded-sm ${!todays ? "bg-black/80 text-white" : "text-slate-600"} transition-all`}>
          ALL TIME
        </button>
      </div>

      <main className="pt-24 pb-10 px-6 ml-26">

        <section>
          
          <div className="flex justify-between gap-6 mb-5">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{todays ? "Today's Orders" : "All Time Orders"}</h1>
              <p className="text-gray-500 mt-1 font-medium">{todays ? "Manage Today's All orders" : "Manage Every Orders"}</p>
          </div>
            
            <div className="relative group w-sm mr-16">

              <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={22} className="text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>

              <input 
                type="text" 
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder='Search Order ID...' 
                className="w-full text-gray-600 font-semibold bg-white border border-gray-200 py-2.5 pl-10 pr-6 rounded-xl outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
              />
            </div>

          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2 py-2 bg-white sticky top-14 z-40">
            
            <div className="flex items-start gap-2 overflow-x-auto no-scrollbar py-1">
              {status.map((v, i) => (
                <button 
                  key={i}
                  onClick={()=>setStat(v.name)}
                  className={`whitespace-nowrap px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border
                  cursor-pointer
                  ${v.name === stat
                    ? 'bg-black text-white border-black shadow-md' 
                    : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}
                >
                  {v.name}
                </button>
              ))}
            </div>

            <div className="h-8 w-[1px] bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Filter:</span>
              <select onChange={(e)=>setFilter(e.target.value)} className="bg-white border border-gray-200 text-[11px] font-bold uppercase py-2 px-4 rounded-xl outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer shadow-sm">
                {filters.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={`flex flex-wrap ${orders.length < 1 ? "justify-center" : ""} gap-10 bg-white rounded-xl py-3 px-4 border border-gray-100`}>
            {
              loading ? (
                <div className="flex items-center justify-center h-40 w-full">
                  <span className="inline-block h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : 
              orders.length < 1 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 border border-dashed     border-gray-300 rounded-xl bg-gray-50 text-center">
                    <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 text-gray-600">
                      📭
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      No Orders Yet
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Orders will appear here once customers place them.
                    </p>
                </div>
              ) :
              (
                orders?.map((v,i)=>(
                  <AdminOrderComp fetchOrders={fetchOrders} setOrders={setOrders} data={v} />
                ))
              )
            }
          </div>

        </section>

      </main>
    </div>
  )
}