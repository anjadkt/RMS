import { useDispatch, useSelector } from "react-redux"
import {addToCart,removeFromCart} from "../app/features/cart/cartSlice.js"
import { useNavigate } from "react-router-dom";


export default function ItemButton({cartItem}){
  const {cart} = useSelector(state => state.cart);
  const {login} = useSelector(state => state.user);
  const isInCart = cart.find(v => v.item._id === cartItem._id );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return(
    <>
      <button className={` ${isInCart ? "hidden" : "block"} px-4.5 relative py-1.5 cursor-pointer text-xs font-bold rounded-sm 
        border border-[#cd0045] text-[#cd0045]`}
        onClick={()=>{
          if(!login)return navigate('/login');
          dispatch(addToCart(cartItem._id))
        }}
      >
      ADD
      <div className="absolute -top-1 right-1">+</div>
     </button>

     <button onClick={()=>{if(!login)return navigate('/login');}} className={` ${isInCart ? "block" : "hidden"} w-[60px] px-1 flex items-center justify-between 
      font-bold rounded-sm border bg-[#cd0045] border-[#cd0045] text-white cursor-pointer
      `}>
      <div className="text-2xl" onClick={()=>dispatch(removeFromCart(cartItem._id))} >-</div>
      <div className="text-sm">{isInCart?.quantity || 1}</div>
      <div className="text-base" onClick={()=>dispatch(addToCart(cartItem._id))}>+</div>
     </button>
    
    </>
  )
}