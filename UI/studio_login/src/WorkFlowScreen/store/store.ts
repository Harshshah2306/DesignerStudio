import { configureStore } from "@reduxjs/toolkit";
import { uiDesignerSlice } from './UIDesigner/UIDesigner-slice'

export const store = configureStore({
  reducer: {
      [uiDesignerSlice.name]: uiDesignerSlice.reducer
  }
});

export type AppStore = typeof store;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = typeof store.dispatch;