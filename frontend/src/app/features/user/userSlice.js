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
    role : null
  },
  reducers : {
    setUserData(state,action){
      
    }
  }
});

export const {setUserData} = userSlice.actions ;
export default userSlice.reducer ;