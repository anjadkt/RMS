import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
  name : "user",
  initialState : {
    cart : [],
    phone : null,
    login : null,
    isBanned : false,
    notification : [],
    orders : [],
    role : null,
    name : null
  },
  reducers : {
    setUserData(state,action){
      const {name,login,cart,orders,notification,role,isBanned} = action.payload ;
      state.cart = cart
      state.name = name || ""
      state.login = login
      state.orders = orders
      state.notification = notification
      state.role = role
      state.isBanned = isBanned
    }
  }
});

export const {setUserData} = userSlice.actions ;
export default userSlice.reducer ;