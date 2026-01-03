import { useEffect , useState } from "react";
import AdminHeader from "../components/AdminHeader";
import api from "../services/axios";

export default function AdminDashboard() {

  const [data,setData] = useState({});
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    async function fetchData() {
      try{
        setLoading(true);
        const {data:orderData} = await api.get('/admin/orders');
        setData(orderData);
      }catch(error){
        console.log(error.message);
      }finally{
      setLoading(false);
      }
    }
    fetchData();
  },[]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="fixed top-26 left-1 flex flex-col items-start gap-2 bg-transprent z-40">
        <button className="flex items-center cursor-pointer justify-center gap-3 w-full text-xs font-bold py-2 px-2 rounded-sm bg-black text-white shadow-lg transition-all hover:scale-105">
          TODAY
        </button>
        <button className="flex cursor-pointer items-center gap-3 w-full text-xs font-bold py-3 px-5 rounded-xl text-slate-600 transition-all hover:bg-white hover:text-black">
          ALL TIME
        </button>
        <button className="flex cursor-pointer items-center gap-3 w-full text-xs font-bold py-3 px-5 rounded-xl text-slate-600 transition-all hover:bg-white hover:text-black">
          CHARTS
        </button>
      </div>

      <main className="ml-24 p-8 mt-16">

        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Today's Summary
            </h1>
            <p className="text-slate-500 mt-1">Overview of your store's performance..</p>
          </header>

          {
            loading ? (
              <div className="flex items-center justify-center h-40 w-full">
                <span className="inline-block h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Today's Revenue</p>
                    <div className={`text-3xl font-bold mt-2 text-emerald-600`}>
                      ₹{data.totalToday}
                    </div>
                </div>


                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Revenue</p>
                    <div className={`text-3xl font-bold mt-2 text-amber-600`}>
                    ₹{data.pendingToday}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Incoming Revenue</p>
                    <div className={`text-3xl font-bold mt-2 text-blue-600`}>
                      ₹{data.progressToday}
                    </div>
                </div>
              </section>
            )
          }

          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            Order status
            <span className="h-px flex-1 bg-slate-200"></span>
          </h2>

          {
            loading ? (
              <div className="flex items-center justify-center h-40 w-full">
                <span className="inline-block h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center transition-all hover:border-black active:scale-95 cursor-pointer">
                  <div className="text-xl font-bold text-slate-900">{data.allOrdersCount || 0}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-1 truncate">
                    All Orders
                  </div>
                </div>
                {data.orderCountToday?.map((order) => (
                  <div key={order._id} className={`${order._id === "pending" ? "bg-red-100 text-red-700 border border-red-300" : "border-slate-100 text-slate-900 bg-white" } p-4 rounded-xl border shadow-sm text-center transition-all hover:border-black active:scale-95 cursor-default`}>
                    <div className="text-xl font-bold ">{order.orderCount || 0}</div>
                    <div className="text-[10px] uppercase font-bold mt-1 truncate">
                      {order._id}
                    </div>
                  </div>
                ))}
              </section>
            )
          }

          <h2 className="text-lg font-bold text-slate-800 mt-8 flex items-center gap-2">
            Table status
            <span className="h-px flex-1 bg-slate-200"></span>
          </h2>

          {
            loading ? (
              <div className="flex items-center justify-center h-40 w-full">
                <span className="inline-block h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center transition-all hover:border-black active:scale-95 cursor-default">
                  <div className="text-xl font-bold text-slate-900">{data.totalTableCount || 0}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-1 truncate">
                    All Tables
                  </div>
                </div>
                {data.currentTables?.map((table) => (
                  <div key={table._id} className={`border-slate-100 text-slate-900 bg-white p-4 rounded-xl border shadow-sm text-center transition-all hover:border-black active:scale-95 cursor-pointer`}>
                    <div className="text-xl font-bold ">{table.count || 0}</div>
                    <div className="text-[10px] uppercase font-bold mt-1 truncate">
                      {table._id === false ? "Active Talbes" : "Occupied Tables"}
                    </div>
                  </div>
                ))}
              </section>
            )
          }

        </div>

        <div className="mt-20">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              All Time Summary
            </h1>
            <p className="text-slate-500 mt-1">Complete Overview of your store's performance..</p>
          </header>
        </div>

      </main>
    </div>
  );
}