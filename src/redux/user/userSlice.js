import authorizedAxiosInstance from "@/utils/authorizeAxios";
import { API_ROOT } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Create value state of slice
const initialState = {
  currentUser: null,
};

export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    );
    return response.data;
  }
);

// Create slice on store
export const userSlice = createSlice({
  name: "user",
  initialState,

  // extraReducers: Nơi xử lý data bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
// export const { } = userSlice.actions;

export const selectCurrentUser = (state) => {
  return state.user.currentUser;
};

export const userReducer = userSlice.reducer;
