// slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAndSaveOrders } from '@/lib/dataService';
import { getOrders,addOrderToindexDB, addTransactionToindexDB, updateCustomerToDB } from '@/lib/db';
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';
import { toast } from 'react-toastify';

// Example of an async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      let orders = await getOrders();
      if (orders.length === 0) {
        dispatch(setLoading(true));
        await fetchAndSaveOrders(dispatch);
        orders = await getOrders();
      }
      dispatch(setLoading(false)); 
      return orders;
    } catch (error) {
      dispatch(setLoading(false));
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addOrderToDB = createAsyncThunk(
  'orders/addOrderToDB',
  async (res, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      await addOrderToindexDB(res);

      res.transactions.map( async (tran)=>{
        await addTransactionToindexDB(tran);
      })

      if(res.customer_id && res.customer_total_loyalty){
        await updateCustomerToDB(res.customer_id, {customer_total_loyalty: res.customer_total_loyalty});
      }
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);




const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    lastOrderId: null,
    error: null,
    progress: '0.00%',
  },
  reducers: {
    setOrders: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.progress = 0;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...action.payload].reverse();
        state.progress = 100;
      })      
      // .addCase(addOrderToDB.fulfilled, (state, action) => {
      //   state.items = action.payload;
      // })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
