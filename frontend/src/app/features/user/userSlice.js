import { createSlice } from "@reduxjs/toolkit";
import api from "../../../services/axios.js";

const userSlice = createSlice({
  name: "user",
  initialState: {
    login: null,
    role : null,
    isBanned: false,
    loading: false,
    name : null,
    error: null,
    notification : []
  },
  reducers: {
    setfetchStart(state) {
      state.loading = true;
    },
    setfetchSuccess(state, action) {
      const { isBanned , name , role } = action.payload;
      state.loading = false;
      state.login = true;
      state.isBanned = isBanned || false;
      state.name = name ;
      state.role = role ;
    },
    setFetchFail(state, action) {
      state.loading = false;
      state.login = false;
      state.error = action.payload;
    },
    setLogout(state){
      state.login = null,
      state.isBanned = false,
      state.loading = false,
      state.error = null
    },
    setNotification(state,action){
       state.notification = [action.payload,...state.notification] ;
    },
    removeNotification(state,action){
      state.notification = state.notification.filter(v => v._id !== action.payload);
    }
  },
});

export const checkAuth = () => async (dispatch) => {
  dispatch(setfetchStart());
  try {
    const { data } = await api.get("auth/user");
    dispatch(setfetchSuccess(data.userData));
  } catch (error) {
    if(error.status === 403){
      dispatch(setLogout());
    }else{
      dispatch(setFetchFail(error.message));
    }
  }
};

export const showNotification = (notiData) => async (dispatch) =>{
  dispatch(setNotification(notiData));
  setTimeout(()=>{
    dispatch(removeNotification(notiData._id));
  },8000);
}


export const { setfetchSuccess, setfetchStart, setFetchFail , setLogout, setNotification , removeNotification } =
  userSlice.actions;

export default userSlice.reducer;