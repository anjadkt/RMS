import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, User, Hash, HandPlatter } from 'lucide-react';
import api from '../services/axios';

export default function AdminOrderComp({data,setOrders,fetchOrders}) {

  const [isOpen, setIsOpen] = useState(false);
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

  const nextStatusMap = {
    placed: "accepted",
    accepted: "preparing",
    preparing: "ready",
    ready: "served",
    served: "completed",
    pending : "completed"
  };

  const prevStatusMap = {
    placed: "cancel",
    accepted: "placed",
    preparing: "accepted",
    ready: "preparing",
    served: "ready",
    pending : "served",
    completed : "pending"
  }

  async function changeOrderStatus(status) {
    try{
      setLoading(true);
      const {data : orderData} = await api.post('/admin/orders',{status,id : data._id , tableId : data.tableId});
      if(status === "cancel"){
        fetchOrders();
      }else{
        setOrders(pre => pre.map(v => v._id === orderData._id ? orderData : v ));
      }
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg w-[320px] border-2 border-gray-200 rounded-xl px-6 py-4 bg-white shadow-sm mt-4">

      <div className="space-y-4 pt-2">

        <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1 rounded-lg">
          <Hash size={12} className="text-black-500" />
          <span className="font-bold text-gray-700 text-xs tracking-widest">{data.orderId}</span>
        </div>

        <div className={`flex items-center gap-1 ${statusColors[data.status]} px-2 py-1 rounded-lg`}>
          <span className="font-bold text-xs uppercase tracking-widest">{data.status}</span>
        </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">

          <div className="space-y-1">
            <p className="text-gray-400 font-medium uppercase text-xs">Order Type</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">{data.orderType}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${data.isAssisted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {data.isAssisted ? "Assisted" : "Self"}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <p className="text-gray-400 font-medium uppercase text-xs">Table No</p>
            <p className="font-bold text-gray-700 text-sm">{data.tableNumber}</p>
          </div>
          
        </div>

        <hr className="border-gray-100" />

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="text-gray-900 text-sm font-medium">{data.customerName || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2">
            <HandPlatter size={16} />
            <span className="text-gray-900 text-sm font-medium">{data.waiterId?.name || "Unknown"}</span>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-gray-50">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex cursor-pointer items-center justify-between p-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">Order Items ({data.orderItems?.length})</span>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {isOpen && (
            <div className="px-3 pb-3 space-y-2 divide-y divide-gray-200">
              {data.orderItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm pt-2">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-medium text-gray-900">₹{item.subTotal}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center py-1 px-2">
          <span className="text-gray-500 font-bold uppercase text-xs">Total Amount</span>
          <span className="text-xl font-black text-gray-900">₹{data.orderTotal}</span>
        </div>

        <div className="flex items-center justify-between">
          <button
           disabled={loading}
           onClick={()=>changeOrderStatus(prevStatusMap[data.status])}
           className="px-4 py-2 cursor-pointer border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all text-sm">
            {
              loading ? (
                <span className="inline-block h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                 {prevStatusMap[data.status] === "cancel" ? "Cancel Order" : "Mark " + prevStatusMap[data.status]}
                </>
              )
            } 
          </button>
          {
            data.status === "completed" ? (
              <div className="text-green-700 font-semibold text-sm">[ Order Completed ]</div>
            ) : (
              <button 
                disabled={loading}
                onClick={()=>changeOrderStatus(nextStatusMap[data.status])}
                className="px-4 py-2 bg-black/80 text-white font-semibold rounded-lg hover:bg-black shadow-md shadow-black-100 cursor-pointer transition-all text-sm">
                {
                  loading ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    `Mark ${nextStatusMap[data.status]}`
                  )
                }
              </button>
            )
          }
        </div>
        
      </div>
    </div>
  );
}