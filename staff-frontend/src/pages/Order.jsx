import { useEffect, useState } from "react";
import { Search, Plus, Minus, Utensils, ShoppingBag, X } from "lucide-react";
import Nav from "../components/Nav";
import api from "../services/axios.js";
import {useDispatch,useSelector} from "react-redux"
import { fetchCart , addToCart , removeFromCart } from "../app/features/cart/cartSlice.js";

export default function Order() {
  const [query, setQuery] = useState("");
  const [search,setSearch] = useState([]);
  const [error,setError] = useState("");
  const [tableNumber,setTableNumber] = useState("");
  const [orderLoading,setOrderLoading] = useState(false);

  const dispatch = useDispatch();
  const {cart,loading} = useSelector(state => state.cart);

  const makeOrder = async () =>{
    if(!tableNumber)return setError("Table Number requried!");
    try{
      setOrderLoading(true);
      const {data} = await api.post('/user/order',{tableNumber});
      setError("");
      dispatch(fetchCart())
    }catch(error){
      switch(error.status){
        case 400 : 
         setError( "Required!" );
         break ;
        case 404 :
          setError("Wrong Table Number!");
         break ;
        case 406 :
          setError("Cart is Empty!");
         break ;
      }
    }finally{
      setOrderLoading(false);
    }
  }


  useEffect(()=>{
    dispatch(fetchCart())
  },[]);


  async function searchItem(e){
    setQuery(e.target.value);
    if(!e.target.value)return setSearch([]);

    try{
      const {data} = await api.get(`/items?q=${e.target.value}`);
      setSearch(data);
    }catch(error){
      console.log(error.message);
    }
  }

  if(loading)return (
    <>
    <main className="flex justify-center h-screen items-center">
      <span className="inline-block text-center h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
    </main>
    <Nav/>
    </>
  )

  return (
    <div className=" bg-slate-50 pb-20 lg:pb-0 lg:pl-64">
      <main className="p-4 max-w-3xl mx-auto">
        
        <div className="relative mb-8 mt-4">
          <div className="relative group">
            <Search
             className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              onBlur={()=>setQuery("")}
              placeholder="Search Products.." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-gray-200 transition-all text-sm"
              value={query}
              onChange={searchItem}
            />
          </div>

          {query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
              {search.map(item => (
                <div 
                  onMouseDown={()=>dispatch(addToCart(item._id))}
                  key={item._id} 
                  className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0">

                  <div className="flex items-center gap-3 ">
                    <img src={item.image} alt="" className="w-6 h-6 rounded-xs object-contain bg-slate-100" />
                    <div className="font-semibold text-slate-600">{item.name}</div>
                  </div>
                  <button 
                    className="p-2 bg-blue-100 text-gray-500 rounded-xl "
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
            <ShoppingBag size={14} /> Selected Items ({cart?.length})
          </div>
          
          {          
            cart?.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
              No Items Added!
            </div>
          ) : (
            <div className="space-y-3">
              {cart?.map(v => (
                <div key={v.item._id} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={v.item.image} alt="" className="w-8 h-8 rounded-xs object-contain" />
                    <div>
                      <div className="font-bold text-xs text-gray-500">{v.item.name}</div>
                      <div className="text-xs text-black/90 font-semibold">₹{v.item.price}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                    <button 
                     className="p-1 bg-white rounded-lg shadow-sm"
                     onClick={()=>dispatch(removeFromCart(v.item._id))}
                     >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold text-slate-700 w-4 text-center">{v.quantity}</span>
                    <button 
                      className="p-1 bg-white rounded-lg shadow-sm"
                      onClick={()=>dispatch(addToCart(v.item._id))}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-10">
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select onChange={(e)=>setTableNumber(e.target.value)} className="w-full pl-10 pr-0 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700">
                <option className="w-10">Select Table</option>
                {[...Array(9)].map((_, i) => (
                  <option key={i} value={"TBL-0"+ (i+1)}>TBL-0{i+1}</option>
                ))}
              </select>
            </div>
            <button className="flex-1 bg-black/80 text-white font-bold py-2 px-8 rounded-xl shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none"
            disabled={orderLoading}
            onClick={makeOrder}
            >
              {
                orderLoading ? (
                  <span className="inline-block h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) :  "Create Order"
              }
            </button>
          </div>
        </div>
        <div className="text-center font-medium text-red-500 text-sm mt-2">
          {error || ""}
        </div>

      </main>
      <Nav />
    </div>
  );
}