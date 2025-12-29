import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import orderReducer from '../features/orders/orderSlice.js'

const store = configureStore({
  reducer : {
    user : userReducer,
    order : orderReducer
  }
});

export default store