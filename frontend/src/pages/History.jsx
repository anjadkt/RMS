import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import api from "../services/axios";
import DotLoader from "../components/DotLoader";
import OrderHistory from "../components/Order.jsx"
import Nav from '../components/Nav.jsx'
import Header from "../components/Header.jsx";

export default function History() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const { data } = await api.get('/user/order');
        setOrders(data.orders);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders()
  }, [])

  if (loading) return <DotLoader />

  return (
    <div className="min-h-screen bg-gray-50 lg:mt-16">
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* MOBILE HEADER */}
      <div className="bg-white sticky top-0 z-40 px-5 py-4 lg:hidden border-b border-gray-100 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <img className="h-4 rotate-180" src="/icons/leftArrow.png" alt="back" />
        </button>
        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter font-[REM]">Order History</h1>
        <div className="w-8"></div>
      </div>

      <main className="max-w-7xl mx-auto px-5 py-8 pb-28">
        {orders.length < 1 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-[2rem] shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🥡</div>
            <h1 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">No Orders Yet!</h1>
            <p className="text-sm text-gray-500 max-w-xs mb-6 px-4">
              Your history is looking a bit hungry. Let's fill it up with some delicious memories!
            </p>
            <button 
              className="bg-[#cd0045] text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-[#cd0045]/20 hover:scale-105 transition-all" 
              onClick={() => navigate('/')}
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map(v => (
              <OrderHistory key={v._id} data={v} />
            ))}
          </div>
        )}
      </main>
      <Nav />
    </div>
  )
}