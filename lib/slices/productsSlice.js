
// slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAndSaveProducts } from '@/lib/dataService';
import { getProductsFromDB } from '@/lib/db';
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';
import { toast } from 'react-toastify';
// Example of an async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      let products = await getProductsFromDB();

      // if (products.length === 0) {
      //   dispatch(setLoading(true));
      //   // console.log('Calling fetchAndSaveProductsSlice');
      //   await fetchAndSaveProducts(dispatch);
      //   // console.log('fetchAndSaveProductsSlice completed');

      //   // Fetch products again after saving
      //   products = await getProductsFromDB();
      //   // console.log('Products after fetchAndSaveProducts:', products);
      // }

    //  dispatch(setLoading(false));
      return products;
    } catch (error) {
      dispatch(setLoading(false));
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    progress: '0.00%',
  },
  reducers: {
    setProducts:(state, action)=> {
      state.items = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.progress = 0;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.progress = 100;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setProducts } = productsSlice.actions;

export default productsSlice.reducer;
