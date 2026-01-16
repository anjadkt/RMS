import Nav from "../components/Nav.jsx";
import { useEffect, useState } from 'react';
import api from "../services/axios.js";
import WaiterBillComp from "../components/WaiterBillComp.jsx";
import { Receipt, Loader2 } from 'lucide-react';

export default function WaiterBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const { data } = await api.post('/waiter/bills', { paymentStatus: "billed" });
        setBills(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Nav />
      
      <main className="pb-24 pt-6 px-4 lg:pl-64 lg:pt-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="text-blue-600" size={28} />
              Pending Bills
            </h2>
          </div>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {bills.length} Pending
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <Loader2 className="animate-spin text-black" size={30} />
          </div>
        ) : bills.length > 0 ? (
          /* Bill Grid: Displays in 1 column on mobile, 2 on tablet, 3 on large screens */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start justify-items-center">
            {bills.map((v, index) => (
              <div key={v._id || index} className="w-full flex justify-center">
                 <WaiterBillComp data={v} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-3xl border-2 border-dashed border-slate-200 p-10">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
               <Receipt size={48} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Pending Bills</h3>
            <p className="text-slate-500 text-center max-w-xs mt-2">
              All tables have been settled. New bills will appear here once orders are placed.
            </p>
          </div>
        )}

      </main>
    </div>
  )
}