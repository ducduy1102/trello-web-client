import { createSlice } from "@reduxjs/toolkit";

// Initialize the value of a Slice in redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false,
};

// Initialize a slice in the redux store
export const activeCardSlice = createSlice({
  name: "activeCard",
  initialState,
  // Reducers: data is processed synchronously
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true;
    },
    // Clear data and close modal activeCard
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null;
      state.isShowModalActiveCard = false;
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload;
      // Update currentActiveCard data in Redux
      state.currentActiveCard = fullCard;
    },
  },
  // ExtraReducers: Asynchronous data processing
  extraReducers: (builder) => {},
});

export const {
  showModalActiveCard,
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
} = activeCardSlice.actions;

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard;
};

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard;
};

// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer;
