import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchCart, addToCart, removeFromCart } from "../app/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DotLoader from '../components/DotLoader.jsx';
import api from "../services/axios.js";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orderLoading, setOrderLoading] = useState(false);
  const [form, setForm] = useState({ name: "", tableNumber: "" });
  const [error, setError] = useState({});

  const [searchParams] = useSearchParams();
  const tableFromUrl = searchParams.get("table");

  const { cart, loading } = useSelector(state => state.cart);
  const calcTotal = cart.reduce((accum, val) => accum + (val.item.price * val.quantity), 0);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const makeOrder = async () => {
    try {
      setOrderLoading(true);
      await api.post('/user/order', form);
      setError({});
      navigate('/history');
    } catch (error) {
      if (error.status === 400) setError({ tableNumber: "Table Required!" });
      else if (error.status === 404) setError({ tableNumber: "Invalid Table!" });
      else if (error.status === 406) setError({ tableNumber: "Cart is Empty!" });
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCart());
    if (tableFromUrl) setForm(prev => ({ ...prev, tableNumber: tableFromUrl }));
  }, [dispatch, tableFromUrl]);

  if (loading) return <DotLoader />;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-10">
      {/* --- TOP NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <img className="h-4 rotate-180" src="/icons/leftArrow.png" alt="back" />
          </button>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter font-[REM]"> Checkout</h1>
          <button onClick={() => navigate('/history')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <img className="h-5 opacity-70" src="/icons/history.png" alt="history" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-5 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: ITEM SUMMARY (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Your Selection</h2>
              <span className="text-[10px] bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-bold">
                {cart.length} ITEMS
              </span>
            </div>

            <div className="space-y-4">
              {cart.length < 1 ? (
                <div className="bg-white rounded-[2rem] p-10 text-center border border-dashed border-gray-300">
                  <p className="text-gray-500 font-medium mb-4">Your cart is feeling light...</p>
                  <button onClick={() => navigate('/')} className="text-[#cd0045] font-black uppercase text-sm border-b-2 border-[#cd0045]">
                    Browse Menu
                  </button>
                </div>
              ) : (
                cart.map((v) => (
                  <div 
                    key={v.item._id} 
                    className={`rounded-2xl relative p-4 flex items-center gap-4 shadow-sm border border-gray-50 transition-all ${
                    !v.item.isAvailable ? "bg-gray-50 overflow-hidden" : "bg-white"
                    }`}
                    >
                    {/* --- UNAVAILABLE OVERLAY --- */}
                    {!v.item.isAvailable && (
                    <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex items-center justify-center px-6">
                    {/* Visual Warning Label */}
                    <div className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-xl transform -rotate-2 border border-gray-700">
                    Currently Unavailable
                    </div>

                    {/* Helper text at bottom of card */}
                    <p className="absolute bottom-2 text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                    Will be removed from order automatically
                    </p>
                    </div>
                    )}

                    {/* Item Image */}
                    <div className={`h-16 w-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-2 border border-gray-100 ${!v.item.isAvailable && "grayscale opacity-40"}`}>
                    <img className="h-full object-contain" src={v.item.image} alt="" />
                    </div>

                    {/* Item Details */}
                    <div className={`flex-grow ${!v.item.isAvailable && "opacity-40"}`}>
                    <h3 className="text-sm font-black text-gray-800 uppercase leading-none mb-1">{v.item.name}</h3>
                    <p className="text-xs font-bold text-[#cd0045]">₹{v.item.price}</p>
                    </div>

                    {/* Quantity Controls (Disabled when unavailable) */}
                    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${!v.item.isAvailable ? "opacity-20 pointer-events-none" : ""}`}>
                    <button onClick={() => dispatch(removeFromCart(v.item._id))} className="p-1 hover:bg-white rounded-md transition-colors shadow-sm">
                    <img className="h-3 w-3" src="/icons/minus.png" alt="minus" />
                    </button>
                    <span className="px-3 text-xs font-black text-gray-800">{v.quantity}</span>
                    <button onClick={() => dispatch(addToCart(v.item._id))} className="p-1 hover:bg-white rounded-md transition-colors shadow-sm">
                    <img className="h-3 w-3" src="/icons/plus.png" alt="plus" />
                    </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bill Details Section */}
            <div className="mt-8 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Bill Details</h3>
               <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>Item Total</span>
                    <span>₹{calcTotal}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-green-600">
                    <span>Restaurant Charges</span>
                    <span>FREE</span>
                  </div>
                  <div className="h-[1px] bg-gray-100 my-2"></div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-black text-gray-800 uppercase">To Pay</span>
                    <span className="text-xl font-black text-gray-900">₹{calcTotal}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT: DINE-IN DETAILS (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Service Details</h2>
              
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-50">
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Your Name</label>
                    <input
                      name="name"
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full mt-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#cd0045]/10 focus:border-[#cd0045] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Table Selection</label>
                    <div className="flex gap-3 mt-1">
                      <input
                        name="tableNumber"
                        onChange={handleChange}
                        defaultValue={tableFromUrl || ""}
                        placeholder="Table No"
                        className={`flex-grow bg-gray-50 border ${error.tableNumber ? 'border-red-500' : 'border-gray-100'} rounded-xl px-4 py-3 text-sm outline-none`}
                      />
                      <div className="w-14 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-[#cd0045] transition-colors">
                        <img className="h-5 invert" src="/icons/searchfood.png" alt="scan" />
                      </div>
                    </div>
                    {error.tableNumber && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{error.tableNumber}</p>}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <button
                    onClick={makeOrder}
                    disabled={orderLoading || cart.length === 0}
                    className="w-full bg-[#cd0045] text-white rounded-2xl py-4 font-black uppercase tracking-widest text-sm shadow-lg shadow-[#cd0045]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:grayscale disabled:opacity-50"
                  >
                    {orderLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Confirm Order"
                    )}
                  </button>
                  <p className="text-[9px] text-gray-400 text-center mt-4 font-medium italic">
                    By clicking, a waiter will be notified to assist you.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}