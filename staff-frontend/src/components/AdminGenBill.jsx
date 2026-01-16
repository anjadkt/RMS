import { Receipt, X, Trash2, ArrowRight } from 'lucide-react';

export default function AdminGenBill({ billLoading , genBill, selectedOrders, setSelectedOrders}) {
  
  if (!selectedOrders || selectedOrders.length === 0) return null;

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-black/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-6">
        
        {/* Left Section: Info & IDs */}
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="bg-white/20 p-2 rounded-lg shrink-0">
            <Receipt size={20} className="text-white" />
          </div>
          
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">
              {selectedOrders.length} {selectedOrders.length === 1 ? 'Order' : 'Orders'} Selected
            </span>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={()=>setSelectedOrders()}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            title="Clear Selection"
          >
            <X size={20} />
          </button>
          
          <button 
            onClick={genBill}
            className="flex items-center gap-2 bg-white text-black px-2 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all active:scale-95 whitespace-nowrap"
          >
            {billLoading ? "Processing..." : "Generate Bill"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}