export default function OrderHistory({ data }) {
  const statusColors = {
    placed: "bg-indigo-50 text-indigo-600 border-indigo-100",
    accepted: "bg-blue-50 text-blue-600 border-blue-100",
    preparing: "bg-orange-50 text-orange-600 border-orange-100",
    ready: "bg-green-50 text-green-600 border-green-100",
    served: "bg-emerald-50 text-emerald-600 border-emerald-100",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const total = data.orderItems.reduce((acc, val) => acc + val.subTotal, 0);

  return (
    <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:border-gray-300 transition-colors">
      
      {/* 1. Header: Subtle & Clean */}
      <div className="px-6 pt-6 pb-4 flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Reference</span>
          <span className="text-lg font-black text-gray-800 font-[REM] leading-none">#{data.orderId}</span>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[data.status] || "bg-gray-50 text-gray-500"}`}>
          {data.status}
        </div>
      </div>

      {/* 2. Info Bar: Low Contrast Muted Tones */}
      <div className="px-6 py-3 flex gap-6 border-y border-gray-50 bg-gray-50/50">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-gray-400 uppercase">Table</span>
          <span className="text-sm font-bold text-gray-700">Area {data.tableNumber}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-gray-400 uppercase">Service</span>
          <span className="text-sm font-bold text-gray-700">{data.orderType}</span>
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
          <span className="text-xl font-black text-white">₹{total}</span>
        </div>
      </div>
    </div>
  );
}