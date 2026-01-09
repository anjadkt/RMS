import {useState,useEffect} from 'react'

export default function OrderHistory({ data }) {
  const [time,setTime] = useState("..");

  const statusColors = {
    placed: "bg-indigo-50 text-indigo-600 border-indigo-100",
    accepted: "bg-blue-50 text-blue-600 border-blue-100",
    preparing: "bg-orange-50 text-orange-600 border-orange-100",
    ready: "bg-green-50 text-green-600 border-green-100",
    served: "bg-emerald-50 text-emerald-600 border-emerald-100",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  useEffect(()=>{
    if(!data?.prepareTime || !time)return ;

    const interval = setInterval(()=>{
      const currentTime = new Date();
      const ready = new Date(data?.prepareTime);
      const diff = Math.max( Math.ceil((ready - currentTime ) / 60000) , 0);
      setTime(diff);
    },1000);

    return ()=> clearInterval(interval);

  },[data.prepareTime])



  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:border-gray-300 transition-colors">
      
      {/* 1. Header: Subtle & Clean */}
      <div className="px-6 pt-6 pb-4 flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Reference</span>
          <span className="text-sm lg:text-lg font-black text-gray-800 font-[REM] leading-none">#{data.orderId}</span>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[data.status] || "bg-gray-50 text-gray-500"}`}>
          {data.status}
        </div>
      </div>

      {/* 2. Info Bar: High Contrast & Improved Visibility */}
      <div className="px-6 py-4 flex justify-between items-center border-y border-gray-200 bg-white">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Table</span>
            <span className="text-sm font-extrabold text-gray-900">{data.tableNumber}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Service</span>
            <span className="text-sm font-extrabold text-gray-900">{data.orderType}</span>
          </div>
        </div>

        <div>
          {!["served", "pending", "completed"].includes(data.status) && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">
                Ready In
              </span>
              {!time && ["placed", "accepted", "preparing", "ready"].includes(data.status) ? (
                <span className="px-2 py-1 rounded bg-red-50 text-[12px] font-black text-red-600 ring-1 ring-inset ring-red-600/20 animate-pulse">
                  ORDER DELAY
                </span>
              ) : (
                <div className="flex items-baseline gap-0.5 px-3 py-1 rounded-full bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                  <span className="text-xl font-black tabular-nums leading-none">{time}</span>
                  <span className="text-[10px] font-bold uppercase">min</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Items: Spacious Layout */}
      <div className="p-6 space-y-4">
        {data.orderItems?.map((v, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                <img className="h-7 w-7 object-contain opacity-80" src={v.image} alt={v.name} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-tight">{v.name}</h4>
                <p className="text-[10px] text-gray-400 font-medium">Qty: {v.quantity}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-600">₹{v.subTotal}</span>
          </div>
        ))}
      </div>

      {/* 4. Footer: The "Pop" of Color (Muted) */}
      <div className="px-6 pb-6 mt-auto">
        <div className="flex items-center justify-between p-4 bg-[#2D2D2D] rounded-2xl shadow-inner">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
          <span className="text-xl font-black text-white">₹{data.orderTotal}</span>
        </div>
      </div>
    </div>
  );
}