import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import cartReducer from '../features/cart/cartSlice.js'
import orderReducer from '../features/order/orderSlice.js'

const store = configureStore({
  reducer : {
    user : userReducer,
    cart : cartReducer,
    orders : orderReducer
  }
});

export default store