import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAndSaveTaxes } from '@/lib/dataService';
import { getTaxesFromDB } from '@/lib/db';

export const fetchTaxes = createAsyncThunk(
  'taxes/fetchTaxes',
  async (_, { dispatch }) => {
    let taxes = await getTaxesFromDB();
    // console.log('Fetched taxes from DB:', taxes);
    if (taxes.length === 0) {
      await fetchAndSaveTaxes(dispatch);
      taxes = await getTaxesFromDB();
      // console.log('Fetched taxes from DB after saving:', taxes);
    }
    return taxes;
  }
);



const taxSlice = createSlice({
  name: 'taxes',
  initialState: {
    rates: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaxes.fulfilled, (state, action) => {
        // console.log('Action payload in fulfilled:', action.payload);
        state.rates = action.payload;
        state.loading = false;
      })
      .addCase(fetchTaxes.rejected, (state) => {
        state.loading = false;
      });
  },
});







export default taxSlice.reducer;
