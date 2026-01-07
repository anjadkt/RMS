import { ArrowRight, Hash, UtensilsCrossed} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminTableComp({ data }) {
  const navigate = useNavigate();

  return (
    <div className="group relative max-w-xs bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1">
          <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors duration-300">
            <Hash size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              {data?.tableNumber || "01"}
            </h1>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between py-2">
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Orders</p>
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={16} className="text-gray-900" />
            <span className="text-lg font-black text-gray-900">{data.tableOrders?.length || 0}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 ring-inset ${
          data.isOccupied 
          ? "bg-rose-50 text-rose-600 ring-rose-100" 
          : "bg-emerald-50 text-emerald-600 ring-emerald-100" 
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${data.isOccupied  ? "bg-rose-500" : "bg-emerald-500"}`}></span>
          {data.isOccupied ? "Occupied" : "Available"}
        </div>
      </div>

      <button onClick={()=>navigate(`/admin/tables/${data._id}`)} className="w-full group/btn flex items-center cursor-pointer justify-center gap-2 bg-transprent text-gray-800 py-3 rounded-2xl font-bold text-sm hover:bg-black hover:text-white transition-all active:scale-95 shadow-lg shadow-gray-200">
        View Details
        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>

    </div>
  );
}