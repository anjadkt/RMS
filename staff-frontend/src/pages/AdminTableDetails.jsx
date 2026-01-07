import { useParams } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import { Hash, Utensils, QrCode, ChevronDown, Package, Printer, Download } from "lucide-react";
import { useState , useEffect } from "react";
import api from '../services/axios.js';
import { useNavigate } from "react-router-dom";

export default function AdminTableDetails() {
  const { id } = useParams();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [table,setTable] = useState({});
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const statusColors = {
    placed: "bg-purple-100 text-purple-700",
    accepted: "bg-blue-100 text-blue-700",
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-green-100 text-green-700",
    served: "bg-emerald-100 text-emerald-700",
    pending : "bg-rose-100 text-rose-700",
    completed: "bg-slate-200 text-slate-700",
    default: "bg-slate-100 text-slate-600"
  };

  const removeTable = async ()=>{
    try {
        setLoading(true);
        const {data} = await api.delete(`/table/admin/${id}`);
        navigate('/admin/tables');
      } catch (error) {
        console.log(error.message);
      }finally{
        setLoading(false);
      }
  }

  useEffect(()=>{
    async function fetchTables() {
      try {
        setLoading(true);
        const {data} = await api.get(`/table/admin/${id}`);
        setTable(data);
      } catch (error) {
        console.log(error.message);
      }finally{
        setLoading(false)
      }
    }
    fetchTables();
  },[]);

  if(loading)return(
    <div className="flex justify-center mt-10">
      <span className="inline-block text-center h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <>
      <AdminHeader />
      <main className="pt-24 pb-10 px-6 lg:px-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          
          <aside className="lg:w-1/3 xl:w-1/4">
            <div className="sticky top-28 space-y-6">

              <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm text-center">
                
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{table?.tableNumber || "08"}</h1>
                
                <div className="flex gap-3 mt-6">
                  <div className="flex-1 bg-gray-50 rounded-2xl py-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Orders</p>
                    <p className="text-lg font-black text-gray-900">{table.tableOrders?.length || 0}</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-2xl py-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Status</p>
                    <p className={`text-sm font-black uppercase ${table?.isOccupied ? "text-rose-600" : "text-emerald-600"}`}>
                      {table?.isOccupied ? "Occupied" : "Vacant"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-center">
                  <button
                  onClick={removeTable}
                  className={`px-6 py-2.5 hover:bg-red-50 hover:text-red-600 bg-red-600 text-white cursor-pointer font-bold rounded-xl transition-all text-sm`}>
                    Remove Table
                  </button>
                  
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <QrCode size={18} className="text-gray-900" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Table QR Code</h3>
                </div>
                <div className="bg-gray-50 aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center relative group overflow-hidden">
                   <QrCode size={120} strokeWidth={1} className="text-gray-300 group-hover:text-black transition-colors" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white text-black p-3 rounded-xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <Download size={20} />
                      </button>
                   </div>
                </div>
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">
                  <Printer size={14} /> Print for Table
                </button>
              </div>

            </div>
          </aside>

          <section className="flex-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Utensils size={20} className="text-gray-900" />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Orders</h2>
            </div>

            <div className="space-y-4">
              {table?.tableOrders?.map((order, idx) => (
                <div key={idx} className={`bg-white rounded-3xl overflow-hidden transition-all`}>
                  
                  {/* Order Header Row */}
                  <div 
                    onClick={() => setExpandedOrder(expandedOrder === idx ? null : idx)}
                    className="p-5 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-gray-300">{(idx + 1).toString().padStart(2, '0')}</span>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Order ID</p>
                        <p className="text-sm font-black text-gray-900">#{order.orderId}</p>
                      </div>
                    </div>

                    <div className="hidden sm:block">
                       <p className="text-[10px] font-bold text-gray-400 uppercase text-center">Items</p>
                       <p className="text-sm font-bold text-gray-800 text-center">{order.orderItems?.length} items</p>
                    </div>

                    <div>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 ring-inset ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                        <p className="text-sm font-black text-gray-900">₹{order.orderTotal}</p>
                      </div>
                      <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedOrder === idx ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Items Details */}
                  {expandedOrder === idx && (
                    <div className="bg-gray-50/50 border-t border-gray-100 p-6 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        {order.orderItems?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-3">
                              <Package size={14} className="text-gray-400" />
                              <p className="text-sm font-bold text-gray-700">{item.name} <span className="text-gray-400 ml-1">x{item.quantity}</span></p>
                            </div>
                            <p className="text-sm font-black text-gray-900">₹{item.subTotal}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}