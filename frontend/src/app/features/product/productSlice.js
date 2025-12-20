import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
  name : "product",
  initialState :{
    searchProduct :[],
    categorizedProduct : [],
    allCategory :[]
  },
  reducers :{
    setSearch(state,action){
      state.searchProduct = action.payload ;
    },
    setCategoryName(state,action){
      state.allCategory = action.payload ;
    }
  }
});

export default productSlice.reducer ;

export const {setSearch} = productSlice.actions ;