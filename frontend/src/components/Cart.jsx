import { useEffect, useState } from "react";
import { useSelector , useDispatch } from "react-redux";
import {fetchCart} from '../app/features/cart/cartSlice.js'
import {useNavigate} from 'react-router-dom'

export default function Cart({isItems}) {
  const { scroll } = useSelector((state) => state.website);
  const {cart} = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  },[dispatch]);

  if (!cart.length) return null;

  return (
    <>
      <div
        className={`flex items-center justify-between px-4 w-[280px] fixed left-1/2 -translate-x-1/2 z-50
        transition-all duration-300
        overflow-hidden h-11
        bg-black/50 shadow-xl rounded-2xl
        xl:bottom-3 lg:bottom-3 xl:py-6
        ${scroll > 100 || isItems ? "bottom-1" : "bottom-12"}`}
        onClick={()=>navigate('/cart')}
      >
        <div className="flex -space-x-2">
          {cart.slice(0, 4).map((v, i) => (
            <img
              key={i}
              src={v.item.image}
              alt={v.item.name}
              className="h-6 w-6 rounded-full border-2 border-white object-cover"
            />
          ))}
          {cart.length > 4 && (
            <div className="h-6 w-6 rounded-full bg-gray-200 text-xs font-semibold
            flex items-center justify-center">
              +{cart.length - 4}
            </div>
          )}
        </div>

        <div className="text-sm font-semibold text-white whitespace-nowrap">
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </div>

        <div>
          <button
            className="bg-[#cd0045] text-white px-2 py-1 rounded-lg
            text-sm font-semibold hover:opacity-90 transition whitespace-nowrap"
          >
            View Cart
          </button>
        </div>
      </div>
    </>
  );
}
