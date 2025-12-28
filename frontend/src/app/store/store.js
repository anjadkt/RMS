import {configureStore} from "@reduxjs/toolkit"
import userReducer from '../features/user/userSlice.js'
import websiteReducer from '../features/website/webSlice.js'
import cartReducer from '../features/cart/cartSlice.js'

const store = configureStore({
  reducer : {
    user : userReducer,
    website :websiteReducer,
    cart : cartReducer
  }
});

export default store