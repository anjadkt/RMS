import { createSlice } from "@reduxjs/toolkit";
import api from "../../../services/axios";

const orderSlice = createSlice({
  name : "order",
  initialState : {
    orders : [],
    loading : false,
    error : null
  },
  reducers : {
    fetchOrdersStart(state){
      state.loading = true ;
    },
    fetchOrderSuccess(state,action){
      state.loading = false ;
      state.orders = action.payload
    },
    fetchOrderFail(state,action){
      state.loading = false ;
      state.error = action.payload
    }
  }
});

export const fetchOrders = (status = "All") => async (dispatch) =>{
  try{
    dispatch(fetchOrdersStart());
    const {data} = await api.get(`/waiter/orders?s=${status === "All" ? "" : status}`);
    dispatch(fetchOrderSuccess(data.orders));
  }catch(error){
    dispatch(fetchOrderFail(error.message));
  }
}


export default orderSlice.reducer ;
export const {fetchOrdersStart,fetchOrderSuccess,fetchOrderFail} = orderSlice.actions