// slices/transactionsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAndSaveTransactions } from '@/lib/dataService'; // Assuming similar service exists for transactions
import { getTransactions, addTransactionsToDB } from '@/lib/db'; // Assuming similar DB operations for transactions
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';
import { toast } from 'react-toastify';

// Example of an async thunk for fetching transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      let transactions = await getTransactions();
      if (transactions.length === 0) {
        dispatch(setLoading(true));
        await fetchAndSaveTransactions(dispatch);
        transactions = await getTransactions();
      }
      dispatch(setLoading(false)); 
      return transactions;
    } catch (error) {
      dispatch(setLoading(false));
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addTransactionToDB = createAsyncThunk(
  'transactions/addTransactionToDB',
  async (transactionData, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      await addTransactionsToDB(transactionData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    loading: false,
    error: null,
    progress: '0.00%',
  },
  reducers: {
    setTransactions: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.progress = 0;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...action.payload].reverse();
        state.progress = 100;
      })      
      // .addCase(addTransactionToDB.fulfilled, (state, action) => {
      //   state.items = [...state.items, action.payload];
      // })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
