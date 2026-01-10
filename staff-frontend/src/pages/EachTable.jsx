import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import api from "../services/axios";
import TableOrder from "../components/tableOrder";
import { ChevronDown, ChevronUp, ArrowLeft, Receipt, Users } from "lucide-react";
import Bill from "../components/Bill";

export default function EachTable() {
  const [fall, setFall] = useState(false);
  const [drop, setDrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [table, setTables] = useState({});

  const [orderIds, setOrderId] = useState([]);

  const [billData, setBillData] = useState({});

  const { id } = useParams();

  const toggleCustomer = (index) => {
    setDrop((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  async function generateBill() {
    try {
      setLoading(true);
      const { data } = await api.post('/waiter/orders/bill', { orderIds, tableId: table._id });
      setBillData(data.billData);
      setFall(true);
    } catch (error) {
      if (error.status === 400) setError({ data: "Select an Order!" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(orderIds.length===0)return ;
    generateBill();
  },[orderIds])

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const { data } = await api.get(`/waiter/table/${id}`);
        console.log(data);
        setTables(data.table);
        setOrders(data.orders);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 lg:px-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-slate-800">
              Table {table.tableNumber?.replace("TBL-", "") || "..."}
            </h1>
            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Active Session</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl border border-blue-100">
          <Users size={16} />
          <span className="text-xs lg:text-sm font-bold">{orders.length} Customers</span>
        </div>
      </header>

      <main className="pt-24 px-4 flex flex-col items-center max-w-4xl lg:max-w-6xl mx-auto lg:flex-row lg:items-start lg:gap-10">
        {loading && !orders.length ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="w-full space-y-3">
            {orders.map((v, i) => (
              <div key={i} className="w-full">
                <button 
                  onClick={() => toggleCustomer(i)}
                  className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl border transition-all duration-200 shadow-sm
                    ${drop.includes(i) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${drop.includes(i) ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {i + 1}
                    </div>
                    <span className="font-bold tracking-tight">{v.customerNames[0] || `Customer ${i+1}`}</span>
                  </div>
                  <div>{drop.includes(i) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${drop.includes(i) ? "max-h-[2000px] mt-4 mb-6" : "max-h-0"}`}>
                  <div className="flex flex-col items-center gap-4">
                    {v.orders?.map(order => (
                      <TableOrder key={order._id} setOrderId={setOrderId} data={order} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bill Actions */}
        <div className="w-full max-w-2xl mt-8 space-y-4">

          <button 
            onClick={() => setFall(!fall)}
            className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl border-2 border-dashed transition-all
              ${fall ? "bg-emerald-50 border-emerald-500 text-emerald-800" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
          >
            <div className="flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
              <Receipt size={16} /> {fall ? "Hide Bill Preview" : "View Generated Bill"}
            </div>
            <div>{fall ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
          </button>

          <div className={`overflow-hidden transition-all duration-500 ${fall ? "opacity-100" : "opacity-0"}`}>
            {fall && (
              Object.keys(billData).length ? (
                <div className="bg-white rounded-3xl p-1 shadow-2xl border border-slate-200">
                  <Bill orderIds={orderIds} restaurantInfo={billData.restaurantInfo} billInfo={billData.billInfo} orderDetails={billData.orderDetails} billSummary={billData.billSummary}/>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-100 rounded-2xl text-slate-400 font-bold border border-slate-200">
                  No Bill Generated Yet
                </div>
              )
            )}
          </div>
        </div>
        
      </main>
    </div>
  )
}