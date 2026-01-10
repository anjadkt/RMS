import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

export default function TableComp({ data }) {
  const navigate = useNavigate();
  const stats = [
    { label: "New", symbol: "placed", bg: "bg-purple-100", dot: "bg-purple-500", color: "text-purple-700" },
    { label: "Ready", symbol: "ready", bg: "bg-green-100", dot: "bg-green-500", color: "text-green-700" },
    { label: "Served", symbol: "served", bg: "bg-emerald-100", dot: "bg-emerald-500", color: "text-emerald-700" },
    { label: "Pending", symbol: "pending", bg: "bg-rose-100", dot: "bg-rose-500", color: "text-rose-700" }
  ];

  const status = {}
  for (let v of data.tableOrders) {
    status[v.status] = (status[v.status] || 0) + 1;
  }

  const isUnpaid = status.pending > 0;

  return (
    <div 
      className={`
        relative group cursor-pointer transition-all duration-200 
        h-32 lg:h-40 flex flex-col justify-between rounded-xl p-3
        ${isUnpaid ? 
          "bg-rose-50 border-2 border-rose-200 shadow-rose-100 shadow-lg" : 
          "bg-white border border-slate-200 hover:border-blue-400  hover:shadow-md shadow-sm"}
      `}
      onClick={() => navigate(`/waiter/tables/${data._id}`)}
    >
      {/* Table Number Header */}
      <div className="flex justify-between items-start">
        <div className={`
          text-sm lg:text-lg font-black tracking-tighter
          ${isUnpaid ? "text-rose-700" : "text-slate-800 group-hover:text-blue-600"}
        `}>
          {data.tableNumber}
        </div>
        <Users size={14} className={isUnpaid ? "text-rose-400" : "text-slate-300"} />
      </div>

      {/* Stats Indicators */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {stats.map((item, index) => (
          status[item.symbol] ? (
            <div 
              key={index} 
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full border border-black/5 ${item.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${item.dot} animate-pulse`}></span>
              <span className={`text-[10px] font-extrabold ${item.color}`}>
                {status[item.symbol]}
              </span>
              <span className="hidden lg:inline text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                {item.label}
              </span>
            </div>
          ) : null
        ))}
        
        {/* If Table is Empty (Optional indicator) */}
        {data.tableOrders.length === 0 && (
          <div className="text-[10px] font-bold text-slate-400 uppercase italic">
            Vacant
          </div>
        )}
      </div>

      {/* Subtle bottom accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${isUnpaid ? 'bg-rose-500' : 'bg-transparent group-hover:bg-blue-500 transition-colors'}`}></div>
    </div>
  );
}