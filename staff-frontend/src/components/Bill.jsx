import { Printer, MapPin, Calendar, Hash, ChevronRight, QrCode } from 'lucide-react';

export default function Bill({ restaurantInfo, billInfo, orderDetails, billSummary }) {
  // Use a payment URL or UPI ID here for the QR
  const paymentUrl = `upi://pay?pa=merchant@upi&pn=${restaurantInfo.name}&am=${billSummary.total}&cu=INR`;

  return (
    <div className="bg-slate-100 px-4 min-h-screen flex flex-col gap-6 justify-center items-center py-6 lg:py-0 lg:py-12">
      <div className="bg-white w-full max-w-[380px] border border-slate-200 shadow-2xl rounded-sm overflow-hidden flex flex-col relative">
        
        {/* Top Decorative Edge */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#cbd5e1,#cbd5e1_10px,#ffffff_10px,#ffffff_20px)] opacity-50"></div>

        <div className="px-6 py-6 lg:px-10 lg:py-8">
          {/* Header */}
          <header className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2 rounded-full bg-slate-100 mb-3">
               <QrCode size={20} className="text-slate-800" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-slate-800 leading-none">
              {restaurantInfo.name}
            </h1>
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] lg:text-xs mt-2 font-medium">
              <MapPin size={10} />
              <span>{restaurantInfo.address}</span>
            </div>
          </header>

          {/* Bill Meta Info */}
          <div className="flex flex-col gap-1 mb-6 text-[11px] lg:text-sm text-slate-500 font-mono border-y border-dashed border-slate-200 py-4">
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><Hash size={12}/> ID: {billInfo.billId.slice(-8)}</span>
              <span className="flex items-center gap-1"><Calendar size={12}/> {billInfo.date}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-slate-800 font-bold">TABLE: {billInfo.tableNumber}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest ${
                billInfo.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {billInfo.paymentStatus || "UNPAID"}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-6">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b-2 border-slate-100">
                <th className="text-left pb-2 font-bold">Description</th>
                <th className="text-center pb-2 font-bold">Qty</th>
                <th className="text-right pb-2 font-bold">Amt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orderDetails.map((item, index) => (
                <tr key={index} className="text-xs lg:text-sm text-slate-700">
                  <td className="py-3 font-medium capitalize">{item.name}</td>
                  <td className="py-3 text-center text-slate-400">x{item.quantity}</td>
                  <td className="py-3 text-right font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="border-t-2 border-slate-900 pt-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Total Amount</span>
              <span className="text-base font-black text-slate-900">₹{billSummary.total.toFixed(2)}</span>
            </div>
          </div>

          {/* NEW: Pay & Go Section */}
          <div className="bg-slate-900 rounded-xl p-6 text-center text-white mb-6 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
              Fast Pay <ChevronRight size={14} className="text-slate-400" />
            </h3>
            
            {/* Replace src with your QR generator URL or local component */}
            <div className="bg-white p-2 rounded-lg inline-block mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(paymentUrl)}`} 
                alt="Payment QR"
                className="w-32 h-32 lg:w-40 lg:h-40"
              />
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed px-4">
              Scan the QR code with any UPI app to pay instantly. 
              Please show the success screen to your waiter.
            </p>
          </div>
        </div>
        
        {/* Zig Zag Bottom */}
        <div className="h-4 w-full bg-[radial-gradient(circle_at_10px_-7px,#ffffff_12px,transparent_13px)] bg-[length:20px_20px]"></div>
      </div>
      <button 
        onClick={() => window.print()}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 border-2 border-slate-200 text-white py-3 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 print:hidden"
      >
        <Printer size={18} />
        Print Receipt
      </button>
    </div>
  );
}