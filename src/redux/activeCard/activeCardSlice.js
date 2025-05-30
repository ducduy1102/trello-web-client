import { createSlice } from "@reduxjs/toolkit";

// Initialize the value of a Slice in redux
const initialState = {
  currentActiveCard: null,
};

// Initialize a slice in the redux store
export const activeCardSlice = createSlice({
  name: "activeCard",
  initialState,
  // Reducers: data is processed synchronously
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null;
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

export const { clearCurrentActiveCard, updateCurrentActiveCard } =
  activeCardSlice.actions;

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard;
};

// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer;
