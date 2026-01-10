import { useEffect, useState } from "react";
import { Search, Plus, Minus, Utensils, ShoppingBag, X, Info } from "lucide-react";
import Nav from "../components/Nav";
import api from "../services/axios.js";
import { useDispatch, useSelector } from "react-redux"
import { fetchCart, addToCart, removeFromCart } from "../app/features/cart/cartSlice.js";

export default function Order() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState([]);
  const [error, setError] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  const dispatch = useDispatch();
  const { cart, loading } = useSelector(state => state.cart);

  const makeOrder = async () => {
    if (!tableNumber) return setError("Table Number required!");
    try {
      setOrderLoading(true);
      const { data } = await api.post('/user/order', { tableNumber });
      setError("");
      dispatch(fetchCart())
    } catch (error) {
      switch (error.status) {
        case 400: setError("Required!"); break;
        case 404: setError("Wrong Table Number!"); break;
        case 406: setError("Cart is Empty!"); break;
        default: setError("Something went wrong");
      }
    } finally {
      setOrderLoading(false);
    }
  }

  useEffect(() => {
    dispatch(fetchCart())
  }, []);

  async function searchItem(e) {
    setQuery(e.target.value);
    if (!e.target.value) return setSearch([]);
    try {
      const { data } = await api.get(`/items?q=${e.target.value}`);
      setSearch(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 flex justify-center items-center lg:pl-54">
        <span className="h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </main>
      <Nav />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Main Content Area - Responsive padding for sidebar */}
      <main className="flex-1 p-4 md:p-8 lg:pl-64 max-w-5xl mx-auto w-full pb-32 lg:pb-8">
        
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">New Order</h1>
          <p className="text-slate-500 text-sm">Search items and assign to a table</p>
        </header>

        {/* Search Bar Container */}
        <div className="relative mb-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              onBlur={() => setTimeout(() => setQuery(""), 200)} // Delay to allow onMouseDown
              placeholder="Search dishes, drinks, or desserts..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-base"
              value={query}
              onChange={searchItem}
            />
          </div>

          {/* Search Dropdown Results */}
          {query && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
              {search.length > 0 ? (
                search.map(item => (
                  <div 
                    onMouseDown={() => dispatch(addToCart(item._id))}
                    key={item._id} 
                    className={`flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors ${!item.isAvailable ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-700">{item.name}</div>
                        <div className="text-sm text-blue-600 font-semibold">₹{item.price}</div>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-900 text-white rounded-lg">
                      <Plus size={18} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">No items found.</div>
              )}
            </div>
          )}
        </div>

        {/* Cart Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
              <ShoppingBag size={14} className="text-slate-400" /> 
              Selected Items <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full ml-1">{cart?.length || 0}</span>
            </div>
          </div>
          
          {cart?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50 text-slate-400">
              <Utensils size={40} className="mb-3 opacity-20" />
              <p className="font-medium">No items in the order yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cart?.map(v => (
                <div key={v.item._id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={v.item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50 flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-sm text-slate-800 truncate">{v.item.name}</div>
                      <div className="text-xs text-slate-500 font-medium">₹{v.item.price} per unit</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 ml-4">
                    <button 
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:text-red-500 transition-colors"
                      onClick={() => dispatch(removeFromCart(v.item._id))}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-slate-800 w-6 text-center text-sm">{v.quantity}</span>
                    <button 
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:text-blue-500 transition-colors"
                      onClick={() => dispatch(addToCart(v.item._id))}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer Action Card */}
        <div >
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:flex-1 relative">
                <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  onChange={(e) => setTableNumber(e.target.value)} 
                  value={tableNumber}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-bold text-white appearance-none"
                >
                  <option value="">Assign Table</option>
                  {[...Array(9)].map((_, i) => (
                    <option key={i} value={"TBL-0" + (i + 1)}>Table 0{i + 1}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="w-full sm:w-auto sm:px-12 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:bg-slate-700 disabled:text-slate-400 flex items-center justify-center gap-2"
                disabled={orderLoading || cart?.length === 0}
                onClick={makeOrder}
              >
                {orderLoading ? (
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Order</>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 flex items-center justify-center gap-2 text-red-400 text-xs font-bold animate-pulse">
                <Info size={14} /> {error}
              </div>
            )}
          </div>
        </div>

      </main>
      <Nav />
    </div>
  );
}