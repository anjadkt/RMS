import { createSlice } from "@reduxjs/toolkit";
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
    },
    clearCart(state){
      state.cart = [],
      state.loading = false,
      state.error = null
    }
  }
});


export const fetchCart = ()=> async (dispatch)=>{
  try{
    dispatch(cartFetchStart());
    const {data} = await api.get("/user/cart");
    dispatch(cartFetchSuccess(data))
  }catch(error){
    if(error.status === 403){
      dispatch(clearCart());
    }else{
      dispatch(cartFetchFail(error.message));
    }
    
  }
}

export const addToCart = (id) => async(dispatch)=>{
  try{
    const {data} = await api.get(`/user/cart/add/${id}`);
    dispatch(cartFetchSuccess(data.cart));
  }catch(error){
    if(error.status === 403){
      dispatch(clearCart());
    }else{
      dispatch(fetchCart());
    }
    
  }
}

export const removeFromCart = (id) => async(dispatch)=>{
  try{
    const {data} = await api.get(`/user/cart/remove/${id}`);
    dispatch(cartFetchSuccess(data.cart));
  }catch(error){
    if(error.status === 403){
      dispatch(clearCart());
    }else{
      dispatch(fetchCart());
    }
  }
}

export default cartSlice.reducer ;

export const {cartFetchFail,cartFetchStart,cartFetchSuccess,clearCart} = cartSlice.actions