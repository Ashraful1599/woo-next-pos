// holdCartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import db from '@/lib/db';


// Async thunk to fetch cart items from IndexedDB
export const fetchHoldCartItems = createAsyncThunk('holdCart/fetchHoldCartItems', async () => {
  try {
    const items = await db.heldCarts.toArray();
    return items;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
});

export const holdCart = createAsyncThunk('holdCart/holdCart', async (cart, { rejectWithValue }) => {
  try {
    const id = await db.heldCarts.add(cart);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const retrieveCart = createAsyncThunk('holdCart/retrieveCart', async (id, { rejectWithValue }) => {
  try {
    const cart = await db.heldCarts.get(id);
    return cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const holdCartSlice = createSlice({
  name: 'holdCart',
  initialState: {
    holdCartItems: [],
    heldCart: [],
    totalAmount: 0,
    discount: 0,
    discountType: 'fixed',
    loyaltyPoints: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    removeFromholdCart: (state, action) => {
      state.heldCart = state.heldCart.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(holdCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(holdCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.heldCartId = action.payload;
      })
      .addCase(holdCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(retrieveCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(retrieveCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.heldCart = action.payload;
      })
      .addCase(retrieveCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchHoldCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.holdCartItems = action.payload;
      })
      .addCase(fetchHoldCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { removeFromholdCart } = holdCartSlice.actions;

export default holdCartSlice.reducer;
