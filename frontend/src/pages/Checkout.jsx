import { useDispatch, useSelector } from "react-redux"
import { fetchCart } from "../app/features/cart/cartSlice"
import { useEffect } from "react"

export default function Checkout(){
  const dispatch = useDispatch()
  const {cart} = useSelector(state => state.cart);
  
  useEffect(()=>{
    dispatch(fetchCart());
  },[dispatch])

  return(
    <>
     Cart
    </>
  )
}