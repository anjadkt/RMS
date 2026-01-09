import {createSlice} from '@reduxjs/toolkit'
import api from '../../../services/axios.js'

const webSlice = createSlice({
  name : "website",
  initialState : {
    scroll : 0,
    settings : {},
    bestSelling : [],
    loading : false,
    specialItems : [],
    status : "open",
    error : null,
    offer : null,
    isVisible : true
  },
  reducers : {
    startfetching(state){
      state.loading = true ;
    },
    setWebsiteData(state,action){
      state.settings = action.payload.settings ;
      state.bestSelling = action.payload.bestSelling ;
      state.specialItems = action.payload.specialItems ;
      state.status = action.payload.settings.status ;
      state.loading = false ;
      state.offer = action.payload.mainOffer ;
      state.isVisible = true;
    },
    setScroll(state,action){
      state.scroll = action.payload ;
    },
    fetchFail(state,action){
      state.loading = false ;
      state.error = action.payload ;
    },
    setIsVisible(state){
      state.isVisible = false ;
    }
  }
});

export const getWebsiteData = () => async (dispatch) => {
  try{
    dispatch(startfetching());
    const {data : websiteData} = await api.get('/resto?settings=true&best=true&special=true');
    const mainOffer = websiteData.settings.offers.filter(v => v.isMain === true);
    dispatch(setWebsiteData({...websiteData,mainOffer : mainOffer[0]}));
  }catch(error){
    dispatch(fetchFail(error.message));
  }
}

export default webSlice.reducer ;

export const {setWebsiteData,setScroll,startfetching , setIsVisible , fetchFail} = webSlice.actions ;