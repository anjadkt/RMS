import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
  name : "user",
  initialState : {
    cart : [],
    phone : null,
    login : false,
    isBanned : false,
    notification : [],
    orders : [],
    role : null
  },
  reducers : {
    setUserData(state,action){
      const {cart,phone,login,isBanned,notification,orders,role} = action.payload ;
      state.cart =  cart ;
      state.phone = phone ;
      state.login = login ;
      state.isBanned = isBanned ;
      state.notification = notification ;
      state.orders = orders ;
      state.role = role ;
    }
  }
});

export const {setUserData} = userSlice.actions ;
export default userSlice.reducer ;