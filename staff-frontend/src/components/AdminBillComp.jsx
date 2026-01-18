import { MapPin, Calendar, Hash, ChevronRight, ChevronDown, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminBillModal from './AdminBillModal';

export default function AdminBillComp({ data , fetchBills }) {
  const [print, setPrint] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [open,setOpen] = useState(false);
  const [load,setLoad] = useState(false);

  useEffect(() => {
    const resetPrint = () => {
      setPrint(null);
      setOpen(false);
      fetchBills();
    }
    window.addEventListener('afterprint', resetPrint);
    return () => window.removeEventListener('afterprint', resetPrint);
  }, [])

  useEffect(() => {
    if (!print) return;
    window.print();
  }, [print])

  return (
    <>
      <div key={data.billId} className="flex flex-col gap-6 justify-center items-center m-4">
        <div 
          id={print === data._id ? 'bill-print' : null} 
          className="bg-white w-lg max-w-xs ring-1 ring-slate-200 shadow-2xl flex flex-col relative"
        >
          
          <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#cbd5e1,#cbd5e1_10px,#ffffff_10px,#ffffff_20px)] opacity-50"></div>

          <div className="px-6 py-2 lg:px-10 lg:py-4">
            <header className="text-center mb-2">
              <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-slate-800 leading-none">
                {data.restaurentName}
              </h1>
              <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] lg:text-xs mt-2 font-medium">
                <MapPin size={10} />
                <span>{data.location}</span>
              </div>
            </header>

            {/* Bill Meta Info */}
            <div className="flex flex-col gap-1 mb-6 text-[11px] lg:text-sm text-slate-500 font-mono border-y border-dashed border-slate-200 py-4">
              <div className='flex justify-between items-center'>
                <div className="flex items-center gap-1"><Hash size={12}/>{data.billId}</div>
                <div className="flex items-center gap-1"><Calendar size={12}/> {data.billDate}</div>
              </div>
              <div className='flex justify-between items-center'>
                <div className="text-slate-800 font-bold">{data.tableNumber}</div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest ${data.paymentStatus=== "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {data.paymentStatus}
                </div>
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
                {data.billItems?.map((item, index) => (
                  <tr key={index} className="text-xs lg:text-sm text-slate-700">
                    <td className="py-3 font-medium capitalize">{item.name}</td>
                    <td className="py-3 text-center text-slate-400">x{item.quantity}</td>
                    <td className="py-3 text-right font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="border-t-2 border-slate-900 pt-4 mb-8 ">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Total Amount</span>
                <span className="text-base font-semibold text-slate-500">₹{data.billTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Total Paid</span>
                <span className="text-base font-semibold text-slate-500">₹{data.paidTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">To be Paid</span>
                <span className="text-base font-black text-slate-900">₹{data.paymentLeft?.toFixed(2)}</span>
              </div>
            </div>

            {/* Dropdown QR Section */}
            {data.qrImage && (
              <div className="mb-6 flex flex-col items-center">

                <button 
                  onClick={() => setShowQr(!showQr)}
                  className="w-full flex items-center justify-between py-2 px-4 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-2">
                      <QrCode size={14} />
                      <span>Payment QR</span>
                  </div>
                  {showQr ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {showQr && (
                  <div className="bg-slate-900 rounded-xl p-6 flex flex-col items-center text-white mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
                      Fast Pay <ChevronRight size={14} className="text-slate-400" />
                    </h3>
                    
                    <div className="bg-white relative w-36 h-36 lg:w-40 lg:h-40 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                      <img
                        onLoad={()=>setLoad(true)}
                        src={data.qrImage}
                        alt="Payment QR"
                        className="w-[180px] max-w-none"
                      />
                    </div>
                    
                    <p className="text-[10px] text-slate-400 text-center leading-relaxed px-4">
                      Scan the QR code with any UPI app to pay instantly. 
                      Please show the success screen to your waiter.
                    </p>
                  </div>
                )}
              </div>
            )}
            <button 
                onClick={()=>{
                  setShowQr(true);
                  if(!load && data.qrImage)return ;
                  if(["paid","prepaid"].includes(data.paymentStatus)){
                    setPrint(data._id)
                  }else{
                    setOpen(true);
                  }
                }}
                className="w-full cursor-pointer flex items-center justify-center gap-2 bg-slate-900 border-2 border-slate-200 text-white mt-5 py-3 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 print:hidden"
              >
              Confirm & Print Bill
            </button>
          </div>

          {/* Unique Zigzag Bottom Edge */}
          <div 
            className="h-3 w-full"
            style={{
              backgroundColor: "white",
              backgroundImage: `linear-gradient(-45deg, transparent 75%, #f8fafc 75%), linear-gradient(45deg, transparent 75%, #f8fafc 75%)`,
              backgroundSize: '10px 15px',
              backgroundPosition: '0 0',
              transform: 'rotate(180deg)'
            }}
          ></div>
        </div>
      </div>
      {open && <AdminBillModal setPrint={setPrint} setOpen={setOpen} data={data} />}
    </>
  );
}