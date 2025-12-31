import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import orderReducer from '../features/orders/orderSlice.js'
import cartReducer from '../features/cart/cartSlice.js'

const store = configureStore({
  reducer : {
    user : userReducer,
    order : orderReducer,
    cart : cartReducer
  }
});

export default store