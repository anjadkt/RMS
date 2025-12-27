import {createSlice} from '@reduxjs/toolkit'

const webSlice = createSlice({
  name : "website",
  initialState : {
    logo : null,
    restaurentName : null,
    scroll : 0
  },
  reducers : {
    setWebsiteData(state,action){
      state.logo = action.payload.logo ;
      state.restaurentName = action.payload.restaurentName ;
    },
    setScroll(state,action){
      state.scroll = action.payload ;
    }
  }
});

export default webSlice.reducer ;

export const {setWebsiteData,setScroll} = webSlice.actions ;