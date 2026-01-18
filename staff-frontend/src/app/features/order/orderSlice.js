import {createSlice} from '@reduxjs/toolkit'
import api from '../../../services/axios';


const orderSlice = createSlice({
  name : "order",
  initialState : {
    orders : [],
    loading : false,
    error : null
  },
  reducers : {
    startFetch (state){
      state.loading = true
    },
    fetchOrders(state,action){
      state.orders = action.payload;
      state.loading = false
    },
    failFetch (state,action){
      state.loading = false ;
      state.error = action.payload
    },
    setPlacedOrders(state,action){
      const exist = state.orders.find(v => v._id === action.payload._id );
      if(!exist){
        state.orders = [action.payload , ...state.orders] ;
      }
    },
    setReadyOrders(state,action){
      state.orders = [action.payload , ...state.orders.filter(v => v._id !== action.payload)]
    }
  }
});


export const fetchWaiterOrders = (status) => async (dispatch) =>{
  try{
    dispatch(startFetch());
    const {data} = await api.get(`/waiter/orders?s=${status === "All" ? "" : status}`);
    dispatch(fetchOrders(data.orders));
  }catch(error){
    dispatch(failFetch());
  }
}

export const fetchKitchenOrders = (status) => async (dispatch) =>{
  try{
    dispatch(startFetch());
    const {data} = await api.get(`/orders/cook/${status}`);
    dispatch(fetchOrders(data));
  }catch(error){
    dispatch(failFetch());
  }
}

export default orderSlice.reducer ;

export const {fetchOrders,startFetch,failFetch,setPlacedOrders,setReadyOrders} = orderSlice.actions ;

