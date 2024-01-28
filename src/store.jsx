import { configureStore } from "@reduxjs/toolkit";
import { Reducers } from "./Reducers";


import { combineReducers } from "@reduxjs/toolkit";
import { orderSlice } from "./features/OrderSlice";



const rootReducer=combineReducers({
    showHide: Reducers,
    order:orderSlice.reducer
})




const store = configureStore({
  reducer: rootReducer,
});
export default store;
