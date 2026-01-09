import React, { useState, useEffect } from 'react';
import { X, Bell, Info } from 'lucide-react';

const ToastNotification = ({ removeNotification }) => {
  const notifications = [
  {
    id: 101,
    from: "Kitchen",
    message: "Order #402 for Table 5 is ready to be served.",
    timestamp: "2 mins ago",
    type: "success"
  }
];
  return (
    <div className="fixed top-16 lg:top-18 right-4 z-100 flex flex-col gap-3 w-full lg:max-w-[320px] max-w-[280px]">
      {notifications.map((note) => (
        <div
          key={note.id}
          className="pointer-events-auto bg-white border-l-4 border-gray-500 shadow-2xl rounded-xl p-2 lg:p-4 flex gap-3 animate-in slide-in-from-right-full duration-300"
        >
          <div className="bg-rose-50 p-2 h-fit rounded-full text-[#cd0045]">
            <Bell size={18} />
          </div>
          
          <div className="flex-1">
            <h4 className="text-[10px] font-black uppercase text-[#cd0045] tracking-wider">
              From: {note.from}
            </h4>
            <p className="text-xs lg:text-sm text-slate-700 font-bold leading-tight mt-0.5">
              {note.message}
            </p>
          </div>

          <button 
            onClick={() => removeNotification(note.id)}
            className="text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;