import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, User, Hash } from "lucide-react";
import api from "../services/axios";
import { useNavigate } from "react-router-dom";

export default function OrderItems({ data ,fetchOrders }) {
  const [fall, setFall] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const total = data.orderItems?.reduce((accum , val)=>accum + val.subTotal,0);

  const statusColors = {
    placed: "bg-purple-100 text-purple-700 border-purple-200",
    accepted: "bg-blue-100 text-blue-700 border-blue-200",
    preparing: "bg-amber-100 text-amber-700 border-amber-200",
    ready: "bg-green-100 text-green-700 border-green-200",
    served: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending : "bg-rose-100 text-rose-700 border-rose-200",
    completed: "bg-slate-100 text-slate-600 border-slate-200",
    default: "bg-slate-50 text-slate-500 border-slate-100"
  };

  async function changeOrderStatus(orderData) {
    if(orderData.action === "completed"){
      return navigate(`/waiter/tables/${orderData.tableId}`);
    }
    try{
      setLoading(true)
      await api.post('/waiter/orders',orderData);
      fetchOrders("All");
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow h-fit w-full max-w-md mx-auto overflow-hidden">
      
      {/* Header Section */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/30">
        <div className="flex justify-between items-start mb-3">
          <div onClick={()=>navigate(`/waiter/tables/${data.tableId}`)} className="cursor-pointer">
            <div className="flex items-center gap-1.5 text-lg font-bold text-slate-800">
              <Hash size={18} className="text-blue-600" />
              <span>Table {data.tableNumber}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">#{data.orderId.slice(-6)}</p>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${statusColors[data.status] || statusColors.default}`}>
            {data.status}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
          <User size={14} className="text-slate-400" />
          <span className="font-medium truncate">{data.customerName || "Guest Customer"}</span>
        </div>
      </div>

      {/* Items Section */}
      <div className="p-4">
        <button 
          onClick={() => setFall(!fall)} 
          className="flex justify-between items-center w-full group py-1"
        >
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Items ({data.orderItems?.length || 0})
          </h3>
          <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
            {fall ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        <div className={`${fall ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"} overflow-hidden transition-all duration-300 space-y-2`}>
          {data.orderItems?.map((v, index) => (
            <div key={index} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <span className="text-sm text-slate-700 font-medium">{v.name}</span>
              <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                x{v.quantity}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
            <span className="text-sm font-bold text-slate-800">Total Amount</span>
            <span className="text-sm font-black text-blue-600">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        {
          data.status === "completed" ? (
            <div className="w-full py-2.5 text-center rounded-xl bg-green-50 text-green-700 text-sm font-bold border border-green-100">
              Order Completed
            </div>
          ) :
          ["accepted","preparing"].includes(data.status) ? (
            <div className="w-full py-2.5 text-center rounded-xl bg-amber-50 text-amber-700 text-sm font-bold border border-amber-100 flex items-center justify-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Kitchen Preparing
            </div>
          ) :
          (
            <button 
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold 
              py-3 px-4 text-sm rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
              disabled={loading}
              onClick={()=>{
                changeOrderStatus({id : data._id , tableId :data.tableId , tableNumber : data.tableNumber,
                  action : data.status === "placed" ? "accepted" : data.status === "ready" ? "served" : "completed"});
              }}
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle size={18} />
                  {data.status === "placed" ? "Confirm Order" : data.status === "ready" ? "Mark as Served" : "Complete Order"}
                </>
              )}
            </button>
          )
        }
      </div>
    </div>
  );
}