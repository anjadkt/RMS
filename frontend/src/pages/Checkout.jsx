import { useNavigate } from "react-router-dom";
import { fetchCart } from "../app/features/cart/cartSlice";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { addToCart,removeFromCart } from "../app/features/cart/cartSlice";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {cart} = useSelector(state => state.cart);

  const calcTotal = cart.reduce((accum,val)=>accum + (val.item.price * val.quantity),0);

  useEffect(()=>{
    dispatch(fetchCart());
  },[dispatch])

  return (
    <div className="min-h-screen bg-[#fff5f7] p-4 max-w-md mx-auto">

      <div className="flex items-center justify-between mb-6">
        <button onClick={()=>navigate('/')}>
          <img className="h-3" src="/icons/leftArrow.png" alt="" />
        </button>
        <h1 className="text-lg -ml-4 font-semibold text-gray-800">Checkout</h1>
        <div></div>
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

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-center gap-2">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Name"
            className="border rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-1 focus:ring-[#cd0045]"
          />

          <input
            type="text"
            placeholder="Scan/Type Table NO:"
            className="border rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-1 focus:ring-[#cd0045]"
          />

        </div>

        <div className="w-1/2 h-20 flex items-center justify-center
          border rounded-lg bg-gray-100 text-xs text-gray-500">
          QR Scan
        </div>
      </div>

      {/* Slider Button */}
      <div className="bg-white rounded-xl shadow-sm p-3">
        <div className="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden">

          {/* Sliding knob */}
          <div className="absolute left-1 top-1 h-10 w-10 bg-[#cd0045]
            rounded-full flex items-center justify-center text-white
            animate-pulse">
            →
          </div>

          {/* Text */}
          <p className="absolute inset-0 flex items-center justify-center
            text-sm font-semibold text-gray-600">
            Slide to Pay
          </p>
        </div>
      </div>

    </div>
  );
}