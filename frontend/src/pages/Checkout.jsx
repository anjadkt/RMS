import { useNavigate } from "react-router-dom";
import { fetchCart } from "../app/features/cart/cartSlice";
import { useDispatch,useSelector } from "react-redux";
import { useEffect , useState } from "react";
import { addToCart,removeFromCart } from "../app/features/cart/cartSlice";
import DotLoader from '../components/DotLoader.jsx'
import api from "../services/axios.js";
// import SlideToOrder from '../components/OrderButton.jsx'

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orderLoading , setOrderLoading] = useState(false);
  const [form,setForm] = useState({
    name : "",
    tableNumber : ""
  });
  const [error,setError] = useState({});

  const {cart,loading} = useSelector(state => state.cart);

  const calcTotal = cart.reduce((accum,val)=>accum + (val.item.price * val.quantity),0);

  const handleChange =(e)=>{
        setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const makeOrder = async () =>{
    try{
      setOrderLoading(true);
      const {data} = await api.post('/user/order',form);
      setError({});
      navigate('/history');

    }catch(error){
      switch(error.status){
        case 400 : 
         setError({tableNumber : "Required!" });
         break ;
        case 404 :
          setError({tableNumber : "Wrong Table Number!" });
         break ;
        case 406 :
          setError({tableNumber : "Cart is Empty!" });
         break ;
      }
    }finally{
      setOrderLoading(false);
    }
  }

  useEffect(()=>{
    dispatch(fetchCart());
  },[dispatch])

  if(loading)return <DotLoader />

  return (
    <div className="min-h-screen bg-[#fff5f7] p-4 max-w-md mx-auto">

      <div className="flex items-center justify-between mb-6">
        <button onClick={()=>navigate('/')}>
          <img className="h-3" src="/icons/leftArrow.png" alt="" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Checkout</h1>
        <div onClick={()=> navigate('/history')}><img className="h-4 opacity-80" src="/icons/history.png" alt="history" /></div>
      </div>

      <div className='h-0.5 mb-5 w-full relative bg-gray-200 font-[Reem_Kufi] font-medium flex items-center justify-center'>
        <h2 className='bg-[#fff5f7] text-[#cd0045]/60 rounded-3xl text-sm xl:text-xl px-2'>Items Summary</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-3">
        {
          cart.length < 1 ? (
            <h1 className="text-xs font-semibold uppercase tracking-wide text-gray-500 text-center py-6">
              Cart is empty 
              <button onClick={()=>navigate('/')} className="border py-1 px-3 rounded-sm text-white bg-[#cd0045]">View Menu</button>
            </h1>
          ) : cart?.map((v,i)=>(
            <div key={v.item._id} className="flex items-center justify-between px-4 py-2">

             <div className="bg-gray-200 p-2 rounded-md w-[50px]">
              <img className="h-8" src={v.item.image} alt={v.item.name} />
             </div>

             <div className="flex flex-col items-center">
              <div className="font-[Reem_Kufi] text-sm text-gray-800">{v.item.name}</div>
              <div className="flex items-center gap-2">
                <div 
                  className="border border-gray-600 p-0.5 rounded-sm"
                  onClick={()=>dispatch(removeFromCart(v.item._id))}
                >
                  <img className="h-[14px]" src="/icons/minus.png" alt="minus" />
                </div>
                <div>{v.quantity}</div>
                <div 
                  className="border border-gray-600 p-0.5 rounded-sm"
                  onClick={()=>dispatch(addToCart(v.item._id))}
                >
                  <img className="h-[14px]" src="/icons/plus.png" alt="plus" />
                </div>
              </div>
             </div>

             <div className="text-xs font-semibold text-gray-700">
              ₹{v.item.price * v.quantity}
             </div>

            </div>
          ))
        }
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-3">
        <div className="flex justify-between font-semibold text-gray-800">
          <span>Total</span>
          <span>₹{calcTotal || "0"}</span>
        </div>
      </div>

      <div className='h-0.5 my-6 w-full relative bg-gray-200 font-[Reem_Kufi] font-medium flex items-center justify-center'>
        <h2 className='bg-[#fff5f7] text-[#cd0045]/60 rounded-3xl text-sm xl:text-xl px-2'>Dine-In Details</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-start justify-center gap-2">
        <div className="flex flex-col gap-2">
          <input
            onChange={handleChange}
            name = "name"
            type="text"
            placeholder="Name"
            className="border rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-1 focus:ring-[#cd0045]"
          />

          <input
            onChange={handleChange}
            name = "tableNumber"
            type="text"
            placeholder="Scan/Type Table NO:"
            className="border rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-1 focus:ring-[#cd0045]"
          />
          <div className="text-xs text-red-600 ml-1 -mt-1">{error.tableNumber || ""}</div>
        </div>

        <div className="w-1/2 h-20 flex items-center justify-center
          border rounded-lg bg-gray-100 text-xs text-gray-500">
          QR Scan
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-3">
        <div 
        onClick={makeOrder}
        className="flex items-center justify-center w-full h-12 bg-[#cd0045] rounded-full text-sm font-semibold text-white">
          {
            orderLoading ? (<span className="inline-block h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />) : "Confirm & Call waiter"
          }
        </div>
      </div>

    </div>
  );
}