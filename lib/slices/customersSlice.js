import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomersFromDB } from '@/lib/db';
import { fetchAndSaveCustomers } from '../dataService';
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { dispatch }) => {

    try {
      let customers = await getCustomersFromDB();
      console.log('Fetched customers from DB:', customers);
      if (customers.length === 0) {
        dispatch(setLoading(true));
        await fetchAndSaveCustomers(dispatch);
        customers = await getCustomersFromDB();
        console.log('Fetched customers from DB after saving:', customers);
      }
      dispatch(setLoading(false));
      return customers;
    } catch (error) {
      dispatch(setLoading(false));
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    selectedCustomer: [],
    loading: false,
  },
  reducers: {
    setCustomers:(state, action)=> {
      state.customers = action.payload
    },
    setSelectedCustomer:(state, action)=>{
        state.selectedCustomer = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        console.log('Action payload in fulfilled:', action.payload);
        state.customers = action.payload;
        state.loading = false;
      })
      .addCase(fetchCustomers.rejected, (state) => {
        state.loading = false;
      });
  },
});





export const{setCustomers, setSelectedCustomer} = customersSlice.actions;

export default customersSlice.reducer;
