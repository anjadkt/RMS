import { createSlice } from "@reduxjs/toolkit";
import api from "../../../services/axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    login: null,
    isBanned: false,
    loading: false,
    error: null
  },
  reducers: {
    setfetchStart(state) {
      state.loading = true;
    },
    setfetchSuccess(state, action) {
      const { isBanned } = action.payload;
      state.loading = false;
      state.login = true;
      state.isBanned = isBanned || false;
    },
    setFetchFail(state, action) {
      state.loading = false;
      state.login = false;
      state.error = action.payload;
    },
  },
});

export const checkAuth = () => async (dispatch) => {
  dispatch(setfetchStart());
  try {
    const { data } = await api.get("auth/customer");
    dispatch(setfetchSuccess(data.userData));
  } catch (error) {
    dispatch(setFetchFail(error.message));
  }
};


export const { setfetchSuccess, setfetchStart, setFetchFail } =
  userSlice.actions;

export default userSlice.reducer;