// Redux: State management tool
import { configureStore } from "@reduxjs/toolkit";
import { activeBoardReducer } from "./activeBoard/activeBoardSlice";
import { userReducer } from "./user/userSlice";

/**
 * Config redux-persist
 * https://www.npmjs.com/package/redux-persist
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const rootPersistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user"],
};

// Combine reducers
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
});

// Persist Reducers
const persistedReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Skip checking for non-serialized values
    }),
});
