import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import db, {
  saveCart,
  getCarts,
  updateCart,
  deleteCart,
  clearIndexCart,
  deleteHeldCart
} from '@/lib/db';


export const setHoldCartItems = createAsyncThunk('cart/setHoldCartItems', async (cart, { rejectWithValue }) => {
  await deleteHeldCart(cart.id);
//  console.log(cart);
  await clearIndexCart();

async function saveCartItems(cart) {
  for (const element of cart.items) {
    await saveCart(element);
  }
}

// Call the function
saveCartItems(cart);
return cart;

});

// Async thunk to fetch cart items from IndexedDB
export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async () => {
  try {
    const items = await getCarts();
    return items;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
});

// Async thunk to add an item to the cart in IndexedDB
export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (item, { rejectWithValue }) => {
    try {
      await saveCart(item);
      return item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove an item from the cart in IndexedDB
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { rejectWithValue }) => {
    console.log(id);
    try {
      await deleteCart(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update an item in the cart in IndexedDB
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      await updateCart(id, updates);
      return { id, updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to clear all items from the cart in IndexedDB
export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await clearIndexCart('carts');
    return [];
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    discount: 0,
    discountType: 'fixed',
    loyaltyPoints: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    setDiscountType: (state, action) => {
      state.discountType = action.payload;
    },
    calculateTotalPrice: (state, action) => {
      const { subTotalPrice, taxAmounts } = action.payload;
      const totalTax = taxAmounts.reduce((total, tax) => total + parseFloat(tax.amount), 0);
      state.totalAmount = subTotalPrice + totalTax - (state.discountType === 'fixed' ? state.discount : (subTotalPrice * state.discount) / 100);
    },
    setLoyaltyPoints: (state, action) => {
      state.loyaltyPoints = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.updates };
        }
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalAmount = 0;
        state.discount = 0;
        state.loyaltyPoints = 0;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
 
      .addCase(setHoldCartItems.fulfilled, (state, action) =>{
          state.items = action.payload.items;
        //  state.discount = action.payload.discount;
        //  state.discountType = action.payload.discountType;
      })
      ;
  },
});

export const { setDiscount, setDiscountType, calculateTotalPrice, setLoyaltyPoints } = cartSlice.actions;
export default cartSlice.reducer;
