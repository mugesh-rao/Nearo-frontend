import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../utils/BaseApi";

// actions

export const allOrders = createAsyncThunk(
  "allOrders",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        { url: "orders/get_all_order_list", method: "post", data },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    order_data: [],
    loading: false,
    error: null,
  },
  extraReducers: {
    [allOrders.pending]: (state) => {
      state.loading = true;
    },
    [allOrders.fulfilled]: (state, action) => {
      state.loading = false;
      state.order_data.push(action.payload);
    },
    [allOrders.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export default orderSlice.reducer;
