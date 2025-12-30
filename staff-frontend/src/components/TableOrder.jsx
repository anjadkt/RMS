import { useState } from "react";
import { ChevronDown, ChevronUp, Hash } from "lucide-react";

export default function TableOrder({ data ,setOrderId}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

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

  const total = data.orderItems?.reduce((accum,val)=>accum + val.subTotal,0);

  const handleChange = () =>{
    setIsReady(!isReady);
    if(!isReady){
      setOrderId(pre => [...pre,data._id]);
    }else{
      setOrderId(pre => pre.filter(v => v !== data._id));
    }
  }

  return (
    <div className={`transition-all duration-300 border rounded-xl py-2 mb-4 bg-white
      ${isReady ? 'border-emerald-500 shadow-sm' : 'border-slate-200 shadow-sm'} w-[300px]
       lg:w-[400px]`}>
      
      <div className="flex items-center justify-between px-3 py-1 lg:p-5">
        <div className="flex items-center gap-3">
          <label className="relative flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="peer hidden" 
              checked={isReady}
              onChange={handleChange}
            />
            <div className="w-6 h-6 lg:w-7 lg:h-7 border-2 border-slate-300 rounded-lg bg-white 
              peer-checked:bg-emerald-500 peer-checked:border-emerald-500 
              transition-all flex items-center justify-center">
              <svg className={`w-4 h-4 text-white transition-opacity ${isReady ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </label>

          <div className="flex flex-col">
            <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Hash size={10} /> ID : {data.orderId || "ODR-000000-0"}
            </span>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full  ${statusColors[data.status]} text-[10px] lg:text-xs font-bold uppercase tracking-tighter`}>
          {data.status}
        </div>
      </div>

      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 lg:px-5 lg:py-3 bg-slate-50 border-t border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
      >
        <span className="text-[10px] lg:text-sm font-bold text-slate-600 uppercase tracking-widest">
          Items ({data.orderItems?.length || ""})
        </span>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {isOpen && (
        <div className="p-3 lg:p-5 space-y-2 bg-white border-t border-slate-50">
          {data.orderItems?.map((item, index) => (
            <div 
              key={index}
              className="flex justify-between items-center bg-slate-50 p-2 lg:p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
            >
              <span className="text-xs lg:text-base text-slate-700 font-semibold ">
                {item.name}
              </span>
              <span className="text-[10px] lg:text-sm font-black bg-white px-3 py-1 rounded-lg border border-slate-200 text-black/70 shadow-sm">
                x{item.quantity}
              </span>
            </div>
          ))}
          <div 
            className="flex justify-between items-center bg-slate-50 p-2 lg:p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
          >
            <span className="text-xs lg:text-base text-slate-700 font-semibold ">
              Total
            </span>
            <span className="text-[10px] lg:text-sm font-black bg-white px-3 py-1 rounded-lg border border-slate-200 text-black/70 shadow-sm">
              ₹{total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}