// slices/offlineOrdersSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAndSaveOrders } from '@/lib/dataService';
import { getOrders, addOrderToindexDB, addTransactionToindexDB, addOfflineOrderToindexDB, getOfflineOrders, deleteOfflineOrdertoDB } from '@/lib/db';
import { toast } from 'react-toastify';
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';
import { getCustomerFromDB } from "@/lib/db";
import { getTaxesFromDB } from "@/lib/db";

// Async thunk for fetching orders
export const fetchOfflineOrders = createAsyncThunk(
  'offlineOrders/fetchOfflineOrders',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let orders = await getOfflineOrders();
      dispatch(setLoading(false));
      return orders;
    } catch (error) {
      dispatch(setLoading(false));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOfflineOrder = createAsyncThunk(
  'offlineOrders/deleteOfflineOrder',
  async (offline_id, { dispatch, rejectWithValue }) => {
    try {
      return await deleteOfflineOrdertoDB(offline_id)
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const setSelectedItem = createAsyncThunk(
  'offlineOrders/setSelectedItem',
  async (item, { dispatch, rejectWithValue }) => {
    try {


      let customerData = {}
        if(item.customer_id != undefined){
        const customer = await getCustomerFromDB(item.customer_id);
          customerData = {
            address1: customer.billing.address_1,
            address2: customer.billing.address_2,
            city: customer.billing.city,
            country: customer.billing.country,
            fname: customer.billing.first_name,
            lname: customer.billing.last_name,
            phone: customer.billing.phone,
            postcode: customer.billing.postcode,
            state: customer.billing.state,
      }
        }
        const tax_lines = await getTaxesFromDB();
        const updatedTaxLines = tax_lines.map(taxLine => {
          const { rate, ...rest } = taxLine;
          return { ...rest, total: rate };
        });

        const itemNew = {
          ...item, 
          billing: customerData, 
          tax_lines: updatedTaxLines,
          discount: item.discountedAmount
        }

      console.log(itemNew);
      return itemNew;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Async thunk for adding an order to the database
export const addOfflineOrderToDB = createAsyncThunk(
  'offlineOrders/addOfflineOrderToDB',
  async (res, { rejectWithValue }) => {
    try {
      await addOfflineOrderToindexDB(res);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const offlineOrdersSlice = createSlice({
  name: 'offlineOrders',
  initialState: {
    items: [],
    selectedItem: {},
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
      .addCase(fetchOfflineOrders.pending, (state) => {
        state.loading = true;
        state.progress = 0;
      })
      .addCase(fetchOfflineOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...action.payload].reverse();
        state.progress = 100;
      })      
      .addCase(fetchOfflineOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setSelectedItem.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
      });
  },
});

export const { setOrders } = offlineOrdersSlice.actions;

export default offlineOrdersSlice.reducer;

