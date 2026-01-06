import React from 'react';
import { User, ShieldCheck, ShieldX, ChevronRight, IdCard, Briefcase } from 'lucide-react';
import {useNavigate} from 'react-router-dom'

export default function StaffCard({ data }) {
  const navigate = useNavigate();

  return (
    <div key={data._id} className="relative max-w-2xs bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      
      <div className="absolute top-0 left-0 z-10">
        {data.isWorking ? (
          <div className="bg-green-700 text-white px-3 py-1.5 rounded-br-2xl flex items-center gap-1.5 shadow-sm">
            <ShieldCheck size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
          </div>
        ) : (
          <div className="bg-red-700 text-white px-3 py-1.5 rounded-br-2xl flex items-center gap-1.5 shadow-sm">
            <ShieldX size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-wider">Not Verified</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 mb-6 mt-4">
        <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
          {data.details?.photo ? (
            <img src={data.details?.photo} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <User size={32} className="text-gray-300" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black text-gray-900 leading-tight">
            {data.name}
          </h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <IdCard size={14} />
              <span className="text-xs font-bold tracking-tight">ID: {data.staffId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Briefcase size={14} className="text-gray-400" />
              <span className="text-xs font-semibold">{data.role}</span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={()=>navigate(`/admin/users/staffs/${data._id}`)} className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 font-bold py-2.5 rounded-xl cursor-pointer hover:bg-black/90 hover:text-white transition-all duration-300">
        <span className="text-sm">View Details</span>
        <ChevronRight size={16} />
      </button>
      
    </div>
  );
}