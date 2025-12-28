import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import api from "../../../services/axios";

const cartSlice = createSlice({
  name : "cart",
  initialState : {
    cart : [],
    loading : false,
    error : null
  },
  reducers : {
    cartFetchStart(state){
      state.loading = true
    },
    cartFetchSuccess (state,action){
      state.loading = false
      state.cart = action.payload
    },
    cartFetchFail(state,action){
      state.loading = false 
      state.error = action.payload
    }
  }
});


export const fetchCart = ()=> async (dispatch)=>{
  try{
    dispatch(cartFetchStart());
    const {data} = await api.get("/user/cart");
    dispatch(cartFetchSuccess(data))
  }catch(error){
    dispatch(cartFetchFail(error.message));
  }
}

export const addToCart = (id) => async(dispatch)=>{
  // dispatch(addToCartUpdate(id));
  try{
    const {data} = await api.get(`/user/cart/add/${id}`);
    dispatch(cartFetchSuccess(data.cart));
  }catch(error){
    dispatch(fetchCart());
  }
}

export const removeFromCart = (id) => async(dispatch)=>{
  // dispatch(removeFromCartUpdate(id));
  try{
    const {data} = await api.get(`/user/cart/remove/${id}`);
    dispatch(cartFetchSuccess(data.cart));
  }catch(error){
    dispatch(fetchCart());
  }
}

export default cartSlice.reducer ;

export const {cartFetchFail,cartFetchStart,cartFetchSuccess} = cartSlice.actions