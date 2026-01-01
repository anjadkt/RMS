import { useState } from "react";
import api from "../services/axios";

export default function OrderComp({data,setOrders}) {

  const [loading,setLoading] = useState(false);

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

  async function setOrderStatus(action,id){
    try{
      setLoading(true);
      const {data} = await api.post('/orders/cook/',{action,id});
      setOrders(pre => pre.map(order=> order._id === data.order._id ? data.order : order));
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xs min-w-xs bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 m-4">

      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="text-left">
          <p className="text-xs text-gray-500 uppercase font-bold ">Order ID</p>
          <p className="text-sm font-mono text-gray-600">#{data.orderId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold ">Table</p>
          <p className="text-sm font-semibold text-gray-800">{data.tableNumber}</p>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center bg-white">
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-white">
          {data.orderType}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[data.status]} uppercase`}>
          {data.status}
        </span>
      </div>

      <hr className="mx-4" />

      <div className="p-4 space-y-4">
        {data.orderItems?.map((item,i) => (
          <div key={item._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
              </div>
            </div>
            <div className="text-gray-600 font-medium">
              x{item.quantity}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        {
          data.status === "ready" ? (
             <span
             className="text-sm text-center font-semibold text-green-700"
            >[ Order Ready ]</span>
          ) : (
            <button 
              onClick={()=>setOrderStatus(data.status,data._id)}
              className="w-full bg-black/80 hover:bg-black text-white font-bold py-1.5 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer">
              {loading ?
                (<span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />) : data.status === "accepted" ? "Mark Preparing.." : "Mark Ready.."
              }
            </button>
          )
        }
      </div>

    </div>
  );
}


