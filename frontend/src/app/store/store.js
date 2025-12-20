import {configureStore} from "@reduxjs/toolkit"
import userReducer from '../features/user/userSlice.js'
import productReducer from '../features/product/productSlice.js'

const store = configureStore({
  reducer : {
    user : userReducer,
    product : productReducer
  }
});

export default store