import {configureStore} from "@reduxjs/toolkit"
import userReducer from '../features/user/userSlice.js'
import productReducer from '../features/product/productSlice.js'
import websiteReducer from '../features/website/webSlice.js'
import cartReducer from '../features/cart/cartSlice.js'

const store = configureStore({
  reducer : {
    user : userReducer,
    product : productReducer,
    website :websiteReducer,
    cart : cartReducer
  }
});

export default store