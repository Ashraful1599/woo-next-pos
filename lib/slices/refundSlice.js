import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const refundSlice = createSlice({
  name: 'refund',
  initialState: {
    item: [],
    refundTotal: 0,
    refundRestock: true,
    refundStatus: 'idle',
    error: null,
  },
  reducers: {
    setRefundRestock: (state, action) => {
      state.refundRestock = action.payload;
    },
    setRefundItem: (state, action) =>{
        state.item = action.payload
    }
  },
});

export const { setRefundRestock, setRefundItem } = refundSlice.actions;
export default refundSlice.reducer;
