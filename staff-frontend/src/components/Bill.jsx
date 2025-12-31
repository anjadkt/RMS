import React from 'react';
import { Printer, Receipt, MapPin, Calendar, Hash } from 'lucide-react';

export default function Bill({ restaurantInfo, billInfo, orderDetails, billSummary }) {
  return (
    <div className="bg-slate-50 px-4 min-h-screen flex justify-center items-start lg:py-10">
      <div className="bg-white w-[240px] lg:w-[380px]  border border-slate-200 shadow-xl rounded-sm overflow-hidden flex flex-col">
        
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#e2e8f0,#e2e8f0_10px,#ffffff_10px,#ffffff_20px)]"></div>

        <div className="px-6 py-3 lg:p-8">
          <header className="text-center mb-4">
            <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-slate-800">
              {restaurantInfo.name}
            </h1>
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] lg:text-xs mt-1 font-medium italic">
              <MapPin size={10} />
              <span>{restaurantInfo.address}</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono">
              GSTN: {billInfo.gstn}
            </div>
          </header>

          <hr className="border-dashed border-slate-200 mb-4" />

          <div className="grid grid-cols-2 gap-y-2 mb-6 text-[11px] lg:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <Hash size={12} className="text-slate-400" />
              <span>Bill: {billInfo.billId.slice(-8)}</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-right">
              <Calendar size={12} className="text-slate-400" />
              <span>{billInfo.date}</span>
            </div>
            <div>Table: <span className="font-bold text-slate-800">{billInfo.tableNumber}</span></div>
            <div className="text-right uppercase text-[10px] tracking-widest font-bold text-black">
              {billInfo.paymentStatus || "UNPAID"}
            </div>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="text-[10px] lg:text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="text-left py-2 font-bold">Item</th>
                <th className="text-center py-2 font-bold">Qty</th>
                <th className="text-right py-2 font-bold">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orderDetails.map((item, index) => (
                <tr key={index} className="text-xs lg:text-sm text-slate-700">
                  <td className="py-3 font-medium capitalize">{item.name}</td>
                  <td className="py-3 text-center text-slate-500">x{item.quantity}</td>
                  <td className="py-3 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-slate-800 pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs lg:text-sm font-bold text-slate-500 uppercase">Grand Total</span>
              <span className="text-sm lg:text-sm font-bold text-black">₹{billSummary.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Thank You!
            </div>
          </div>

          {/* Print Button (Hidden on Print) */}
          {/* <button 
            onClick={() => window.print()}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-lg font-bold text-sm lg:text-base hover:bg-slate-900 transition-all print:hidden"
          >
            <Printer size={18} />
            Print Receipt
          </button> */}
        </div>
        
        {/* Receipt Bottom Edge (Zig Zag) */}
        <div className="h-4 w-full bg-[radial-gradient(circle_at_10px_-7px,#ffffff_12px,transparent_13px)] bg-[length:20px_20px]"></div>
      </div>
    </div>
  );
}