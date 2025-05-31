import authorizedAxiosInstance from "@/utils/authorizeAxios";
import { API_ROOT } from "@/utils/constants";
import { generatePlaceholderCard } from "@/utils/formatters";
import { mapOrder } from "@/utils/sorts";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";

// Create value state of slice
const initialState = {
  currentActiveBoard: null,
};

export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    );
    return response.data;
  }
);

// Create slice on store
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  // reducers: Synchronous data processing
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      state.currentActiveBoard = action.payload;
    },
    updateCardInBoard: (state, action) => {
      // Update nested data
      // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload;

      // Find board -> column -> card
      const column = state.currentActiveBoard.columns.find(
        (i) => i._id === incomingCard.columnId
      );

      if (column) {
        const card = column.cards.find((i) => i._id === incomingCard._id);
        if (card) {
          // card.title = incomingCard.title;
          // or card["title"] = incomingCard["title"];
          // card["description"] = incomingCard["description"];
          // Object.keys gets all properties (keys) of incomingCard into an array then forEach to update
          Object.keys(incomingCard).forEach((key) => {
            card[key] = incomingCard[key];
          });
        }
      }
    },
  },
  // extraReducers: asynchronous data processing
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload is the response.data returned above fetchBoardDetailsAPI()
      let board = action.payload;

      // Board members are a combination of the two arrays owners and members
      board.FE_allUsers = board.owners.concat(board.members);

      // Handle data
      board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

      board.columns.forEach((column) => {
        // Handling empty column drag and drop when f5
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          // Arrange the order of cards in the parent before passing them down to the child
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
        }
      });

      // Update data
      state.currentActiveBoard = board;
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard, updateCardInBoard } =
  activeBoardSlice.actions;

// Selectors
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard;
};

// export default activeBoardSlice.reducer;
export const activeBoardReducer = activeBoardSlice.reducer;
