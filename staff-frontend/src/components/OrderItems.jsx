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
    placed: "bg-purple-100 text-purple-700",
    accepted: "bg-blue-100 text-blue-700",
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-green-100 text-green-700",
    served: "bg-emerald-100 text-emerald-700",
    pending : "bg-rose-100 text-rose-700",
    completed: "bg-slate-200 text-slate-700",
    default: "bg-slate-100 text-slate-600"
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
    <div key={data._id} className="bg-white border border-slate-200 rounded-xl shadow-sm mb-5 
      w-lg max-w-sm mx-auto 
      ">
      
      <div className="p-3 lg:p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-2 text-xs lg:text-sm text-slate-500 font-medium">
          <span>Order ID : <span className="text-slate-800">{data.orderId}</span></span>
        </div>

        <div onClick={()=>navigate(`/waiter/tables/${data.tableId}`)} className="flex justify-between items-start mb-1 lg:mb-4">
          <div className="flex items-center gap-2 text-base lg:text-lg font-bold text-slate-800">
            <Hash className="text-blue-500 lg:w-4 lg:h-4 w-4 h-4" />
            Table: {data.tableNumber}
          </div>
          <span className={`text-[10px] lg:text-xs font-bold px-2 py-0.5 lg:px-3 lg:py-1 rounded-lg uppercase tracking-wider ${statusColors[data.status] || statusColors.default}`}>
            {data.status}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs lg:text-sm text-slate-500 font-medium">
          <User size={14} className="lg:w-4 lg:h-4" />
          <span>Customer: <span className="text-slate-800">{data.customerName || "Unknown"}</span></span>
        </div>
      </div>

      <div className="p-3 lg:p-4">
        <div 
          onClick={() => setFall(!fall)} 
          className="flex justify-between items-center cursor-pointer group py-1"
        >
          <h3 className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">
            Order Items ({data.orderItems?.length || 0})
          </h3>
          <div className="text-slate-400 transition-transform duration-200">
            {fall ? <ChevronUp size={18} className="lg:w-5 lg:h-5" /> : <ChevronDown size={18} className="lg:w-5 lg:h-5" />}
          </div>
        </div>

        <div className={`${fall ? "block" : "hidden"} mt-2 lg:mt-2 space-y-1 lg:space-y-2`}>
          {data.orderItems?.map((v, index) => (
            <div key={index} className="flex justify-between items-center bg-slate-50 p-2 lg:p-2 rounded-lg border border-slate-100">
              <span className="text-xs lg:text-sm text-slate-700 font-medium">{v.name}</span>
              <span className="text-[10px] lg:text-sm font-bold bg-white px-2 py-0.5 lg:px-4 lg:py-0 rounded border border-slate-200 text-slate-500">
                x{v.quantity}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center bg-slate-50 p-2 lg:p-2 rounded-lg border border-slate-100">
            <span className="text-xs lg:text-sm text-slate-700 font-medium">Total</span>
            <span className="text-[10px] lg:text-xs font-bold bg-white px-2 py-0.5 lg:px-4 lg:py-0 rounded border border-slate-200 text-slate-500">{total}</span>
          </div>
        </div>
      </div>

      <div className="p-3 lg:px-4 pt-0">
        {
          data.status === "completed" ? (
            <span
             className="text-sm text-center font-semibold text-green-700"
            >[ Order Completed ]</span>
          ) :
          ["accepted","preparing"].includes(data.status) ? (
            <span
             className="text-sm font-semibold text-amber-700"
            >[ being prepared ]</span>
          ) :
          (
            <button className="w-full flex items-center justify-center gap-2 bg-black/80 text-white font-bold 
              py-2 px-4 text-xs rounded-lg
              lg:py-2 lg:px-2 lg:text-lg lg:rounded-xl
              transition-all shadow-lg"
              disabled = {loading}
              onClick={()=>{
                changeOrderStatus({id : data._id , tableId :data.tableId , tableNumber : data.tableNumber,
                  action : data.status === "placed" ? "accepted" : data.status === "ready" ? "served" : "completed"});
              }}
            >
              
              {
                loading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) :
                (
                  <>
                    <CheckCircle size={16} className="lg:w-6 lg:h-6" />
                    {data.status === "placed" ? "Confirm" : data.status === "ready" ? "Serve" : "Complete"} Order
                  </>
                )
              }
            </button>
          )
        }
        
      </div>

    </div>
  );
}