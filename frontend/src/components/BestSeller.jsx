import ItemButton from "./ItemButton";
import { Star, Clock } from "lucide-react";

export default function BestSeller({ data }) {
  return (
    <div className="group relative w-[200px] lg:w-[220px] shrink-0 rounded-xl bg-white border border-slate-100 shadow-xs shadow-gray-700 hover:shadow-sm hover:shadow-gray-800 transition-all duration-300 p-3">
      <div className="relative h-40 w-full bg-slate-50 rounded-[24px] overflow-hidden flex items-center justify-center">
        <img
          src={data?.image}
          alt={data?.name}
          className="h-32 w-auto object-contain group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
           <span className="text-xs font-black text-[#cd0045]">₹{data.price}</span>
        </div>
      </div>

      <div className="mt-4 px-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-black text-slate-800 leading-tight">
            {data.name?.length > 15 ? data.name.slice(0, 15) + "..." : data.name}
          </h3>
          <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
            <Star size={10} className="text-emerald-600 fill-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700">{data.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
            <Clock size={12} strokeWidth={3} />
            <span>15 min</span>
          </div>
          <ItemButton cartItem={data} />
        </div>
      </div>
    </div>
  );
}