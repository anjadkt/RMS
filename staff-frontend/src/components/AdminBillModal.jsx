import { useState } from "react";
import { X, ShieldCheck, CreditCard, ReceiptText, AlertCircle } from "lucide-react";
import api from "../services/axios.js";

export default function AdminBillModal({ data, setOpen , setPrint }) {
  const [password, setPassword] = useState("");
  const [method, setMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [loading,setLoading] = useState(false);

  const validate = () => {
    const err = {};
    if (!password.trim()) err.password = "Admin password required";
    if (!method) err.method = "Select payment method";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleConfirm = async () => {
    if (validate()) {
      try{
        setLoading(true);
        const {data : billData} = await api.post('/admin/bills',{id : data._id , password , paymentMethod : method ,orderIds :data.orderIds});
        setPrint(data._id);
      }catch(error){
        const err = {}
        switch(error.status){
          case 400 : 
           err.password =  "Password Incorrect!"
           break ;
          case 404 : 
           err.method = "bill not found!"
           break
        }
        setErrors(err);
      }finally{
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-auto animate-in fade-in zoom-in duration-200 h-[550px] scrollbar-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 cursor-pointer text-amber-600 rounded-lg">
              <ReceiptText size={20} />
            </div>
            <h3 className="font-bold text-gray-800 tracking-tight">Bill Confirmation</h3>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bill ID & Status Badge */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Bill ID</p>
              <p className="text-sm font-mono font-bold text-gray-700">{data.billId}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${data.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
              {data.paymentStatus}
            </div>
          </div>

          {/* Items List */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h4 className="text-sm font-black text-gray-900 uppercase">Order Summary</h4>
              <span className="text-xs font-bold text-gray-400">({data.billItems.length} items)</span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {data.billItems?.map((v, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 font-mono text-xs">{i + 1}</span>
                    <span className="font-semibold text-gray-700 capitalize">{v.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-medium">x{v.quantity}</span>
                    <span className="font-bold text-gray-900">₹{v.price * v.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 flex flex-col">
              <div className="flex justify-between items-center">
                <div className="text-xs font-semibold text-gray-500 uppercase">Grand Total</div>
                <div className="text-sm font-semibold text-gray-500">₹{data.billTotal}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs font-semibold text-gray-500 uppercase">Total Paid</div>
                <div className="text-sm font-semibold text-gray-500">₹{data.paidTotal}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-black text-gray-900 uppercase">Grand Total</div>
                <div className="text-2xl font-black text-gray-900 tracking-tighter">₹{data.paymentLeft}</div>
              </div>
            </div>
          </div>

          {/* Validation Fields */}
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-1 block">Admin Authorization</label>
              <div className="relative group">
                <ShieldCheck size={16} className={`absolute left-3 top-3 transition-colors ${errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-black'}`} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => {setPassword(e.target.value); setErrors({...errors, password: null})}}
                  placeholder="Admin Password" 
                  className={`w-full bg-gray-50 border ${errors.password ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:border-black'} rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold outline-none transition-all`}
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.password}</p>}
            </div>

            <div className="relative">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-1 block">Payment Method</label>
              <div className="relative">
                <CreditCard size={16} className={`absolute left-3 top-3 transition-colors ${errors.method ? 'text-red-500' : 'text-gray-400'}`} />
                <select 
                  value={method}
                  onChange={(e) => {setMethod(e.target.value); setErrors({...errors, method: null})}}
                  className={`w-full bg-gray-50 border ${errors.method ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:border-black'} appearance-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold outline-none transition-all cursor-pointer`}
                >
                  <option value="">SELECT OPTION</option>
                  <option value="upi">UPI / Online</option>
                  <option value="in-hand">Cash In-Hand</option>
                </select>
              </div>
              {errors.method && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.method}</p>}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={handleConfirm}
            className="w-full bg-black cursor-pointer text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-200 hover:shadow-gray-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {
              loading ? "Processing..." : "Complete & Print Bill"
            }
          </button>
        </div>

      </div>
    </div>
  );
}