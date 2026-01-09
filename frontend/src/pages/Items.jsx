import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DotLoader from '../components/DotLoader.jsx';
import api from '../services/axios.js';
import Cart from "../components/Cart.jsx";
import ItemButton from "../components/ItemButton.jsx";
import { Clock, ArrowLeft, Info, Sparkles } from "lucide-react";

export default function Items() {
  const [itemObj, setItemObj] = useState({ items: [], category: "" });
  const [loading, setLoading] = useState(false);
  const { c } = useParams();
  const navigate = useNavigate();
  const { items } = itemObj;

  useEffect(() => {
    async function fetchItem() {
      try {
        setLoading(true);
        const { data } = await api.get(`/items/category?c=${c}`);
        setItemObj(data[0] || { items: [], category: "" });
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [c]);

  if (loading) return <DotLoader />;

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          
          <h1 className="text-xl font-black font-[REM] uppercase tracking-tighter text-[#cd0045]">
            {itemObj?.category || "Menu"}
          </h1>
          
          <div className="w-10"></div> {/* Spacer for symmetry */}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {!items || items.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="text-5xl mb-4 grayscale opacity-50">👨‍🍳</div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Coming Soon</h2>
              <p className="text-sm text-gray-400 font-medium max-w-xs mt-2">
                Our chefs are perfecting the secret ingredients for this category.
              </p>
            </div>
          ) : (
            items.map((v, i) => (
              <div 
                key={i} 
                className={`group relative ${!v.isAvailable ? "grayscale pointer-events-none" : "bg-white border shadow-lg border-gray-100"}  rounded-2xl p-5 flex gap-4 hover:shadow-xl shadow-gray-200/50 transition-all duration-300`}
              >
                {/* 1. Left Content: Details */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    {/* Extra Feature: Bestseller Badge */}
                    {v.isBest && (
                      <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">
                        <Sparkles size={10} fill="currentColor" /> Bestseller
                      </div>
                    )}
                    
                    <h2 className="text-base lg:text-lg font-black text-gray-800 uppercase leading-tight tracking-tight mb-1">
                      {v.name}
                    </h2>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        className="h-3.5 w-3.5 object-contain" 
                        src={v.isVeg ? "/icons/veg.png" : "/icons/non-veg.png"} 
                        alt="type" 
                      />
                      <span className="text-sm font-black text-gray-900">₹{v.price}</span>
                    </div>

                    {/* Extra Feature: Small Description */}
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-3 line-clamp-2">
                      {v.description || "Freshly prepared with authentic ingredients and our signature seasoning."}
                    </p>
                  </div>

                  {/* Timing & Offer */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Clock size={12} />
                      <span>{v.prepTime}-{v.prepTime + 5} min</span>
                    </div>
                    
                    {v.offer && (
                      <div className="flex items-center gap-1 text-[10px] font-black text-[#cd0045] uppercase bg-[#cd0045]/5 px-2 py-0.5 rounded-md">
                        <Info size={10} />
                        <span>{v.offer}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Right Content: Image & Action */}
                <div className="relative flex-shrink-0">
                  <div className="h-28 w-28 lg:h-32 lg:w-32 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Floating Item Button */}
                  <div className="absolute bg-white rounded-sm -bottom-3 left-1/2 -translate-x-1/2 shadow-lg scale-110">
                    <ItemButton cartItem={v}/>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Cart isItems={true} />
    </div>
  );
}