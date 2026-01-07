import { ShieldCheck, ShieldAlert, User, Phone, MapPin, ShoppingBag, ChevronDown, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import { useParams } from 'react-router-dom';
import api from '../services/axios';

export default function AdminCustomerDetails() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading,setLoading] = useState(false);
  const {id} = useParams();
  const [data,setData] = useState({});

  const toggleOrder = (idx) => {
    setExpandedOrder(expandedOrder === idx ? null : idx);
  };

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

  async function fetchUserData() {
    try{
      setLoading(true);
      const {data : userData} = await api.get(`/staff/admin/data/${id}`);
      setData(userData);
      console.log(userData);
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }


  useEffect(()=>{
    fetchUserData();
  },[id])

  const manageUser = async (userDetails) =>{
    try {
      const {data} = await api.post('/staff/admin/manage',userDetails);
      fetchUserData();
    } catch (error) {
      console.log(error.message);
    }
  }

  if(loading)return (
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
            <div className="sticky top-28 relative bg-white border border-gray-100 rounded-3xl p-8 shadow-sm overflow-hidden">

              <div className="absolute top-0 right-0">
                {data.user?.isBanned ? (
                  <div className="bg-rose-500 text-white px-4 py-1.5 rounded-bl-2xl flex items-center gap-2">
                    <ShieldAlert size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Blocked</span>
                  </div>
                ) : (
                  <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-bl-2xl flex items-center gap-2">
                    <ShieldCheck size={14} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center text-center mb-2">
                <div className="w-24 h-24 rounded-2xl bg-gray-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-4 ring-1 ring-gray-100">
                  <User size={40} className="text-gray-300" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">{data.user?.name || "Unknown"}</h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase mt-2 ring-1 ring-indigo-100">
                  {data.user?.role}
                </span>
              </div>

              <div className="space-y-2 border-t border-gray-50 pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <Phone size={14} className="text-indigo-500" />
                    +{data.user?.number}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={() => manageUser({ role: data.user?.role, id: data.user?._id, action: !data.user?.isBanned })}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    data.user?.isBanned 
                    ? "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white" 
                    : "bg-red-50 text-red-600 hover:bg-red-700 hover:text-white"
                  }`}>
                  {data.user?.isBanned ? "Unblock Customer" : "Block Customer"}
                </button>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <ShoppingBag size={20} className="text-gray-900" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900 tracking-tight">Order History</h1>
                  <p className="text-xs text-gray-500 font-medium">Total {data.user?.orders?.length || 0} orders found</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {data.user?.orders?.map((order, idx) => (
                <div 
                  key={idx} 
                  className={`group bg-white border rounded-3xl overflow-hidden transition-all duration-300 ${
                    expandedOrder === idx ? 'border-transparent shadow-xl' : 'border-gray-100 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div 
                    onClick={() => toggleOrder(idx)}
                    className="p-5 flex flex-wrap items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-sm font-black text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                        <p className="text-sm font-black text-gray-900">#{order.orderId}</p>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Items</p>
                      <p className="text-sm font-bold text-gray-700 text-center">{order.orderItems?.length} Products</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</p>
                      <p className="text-sm font-black text-gray-600 text-right">₹{order.orderTotal}.00</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform duration-300 ${expandedOrder === idx ? 'rotate-180 text-black' : ''}`} 
                      />
                    </div>
                  </div>

                  {expandedOrder === idx && (
                    <div className="bg-gray-50/50 border-t border-gray-100 p-6 animate-in slide-in-from-top-2 duration-300">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Item Details</h4>
                      <div className="space-y-3">
                        {order.orderItems?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 rounded-lg">
                                <Package size={16} className="text-indigo-500" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{item.name || "Product Name"}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Qty: {item.quantity || 1}</p>
                              </div>
                            </div>
                            <p className="text-sm font-black text-gray-800">₹{item.price || '0'}.00</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end items-center">
                         <div className="text-right">
                            <span className="text-xs font-bold text-gray-400 mr-2">Grand Total:</span>
                            <span className="text-lg font-black text-gray-900">₹{order.orderTotal}.00</span>
                         </div>
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