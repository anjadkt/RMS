import {createSlice} from '@reduxjs/toolkit'

const webSlice = createSlice({
  name : "website",
  initialState : {
    logo : null,
    restaurentName : null,
  },
  reducers : {
    setWebsiteData(state,action){
      state.logo = action.payload.logo ;
      state.restaurentName = action.payload.restaurentName ;
    }
  }
});

export default webSlice.reducer ;

export const {setWebsiteData} = webSlice.actions ;