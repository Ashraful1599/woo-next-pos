import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setSelectedCustomer } from './customersSlice';

import db, {
  saveCart,
  getCarts,
  getCart,
  updateCart,
  deleteCart,
  clearIndexCart,
  deleteHeldCart,
  getCustomerFromDB
} from '@/lib/db';


export const setHoldCartItems = createAsyncThunk('cart/setHoldCartItems', async ( cart , { dispatch, rejectWithValue }) => {

   // console.log(cart);

  try {
    await clearIndexCart();
    async function saveCartItems(cart) {
      for (const element of cart.items) {
        await saveCart(element);
      }
    }
    await saveCartItems(cart); // Await the async function

    if(cart.customerId !== undefined){
      const customer = await getCustomerFromDB(cart.customerId);
      dispatch(setSelectedCustomer(customer));
    } else {
      dispatch(setSelectedCustomer([]));
    }
    await deleteHeldCart(cart.id);
    return cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
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
    if(item.id == undefined) {

      function generateUniqueId() {
        return Date.now();
      }

      item = {
        ...item,
        id: generateUniqueId()
      };
    } else {
      item = item;
    }
 
   // // console.log('item',item);
    try {


      const audio = new Audio('/pip.mp3');
      audio.volume = 0.4; // Set volume to 50%
      audio.play();

         const product = await getCart(item.id);

          if (product && product.id == item.id){
              const qtyUpdate = {
                quantity: item.quantity+product.quantity,
              }
              await updateCart(item.id, qtyUpdate);
               const items = await getCarts();
               return items;
          }else{
            
            await saveCart(item);
            const items = await getCarts();
            return items;
          }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);






// Async thunk to remove an item from the cart in IndexedDB
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { rejectWithValue }) => {
  //  // console.log(id);
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
// export const calculateLoyaltyPoints = createAsyncThunk(
//   'cart/calculateLoyaltyPoints',
//   async ({ items }, { rejectWithValue }) => {
//     try {
//       let totalLoyaltyPoints = 0;
//       items.forEach((item) => {
//         const loyaltyCategory = item.categories?.find((category) => category.slug === "loyalty3");
//         if (loyaltyCategory) {
//           totalLoyaltyPoints += Number(item.price) * 0.03 * item.quantity;
//         }
//       });
//       console.log('totalLoyaltyPoints',totalLoyaltyPoints)
//       return 4;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );



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
    subTotal: 0,
    taxAmounts: [],
    totalAmount: 0,
    totalAmountWithLoyalty: 0,
    discount: 0,
    discountType: 'fixed',
    discountAmount: 0,  // fixed or percentace number of discount like 20%
    loyaltyPoints: 0,
    customerId: 0,
    customerEmail: '',
    holdCartNote:'',
    status: 'idle',
    error: null,
  }, 
  reducers: {
    setCustomerId: (state, action) =>{
      state.customerId = action.payload
    },    
    setCustomerEmail: (state, action) =>{
      state.customerEmail = action.payload
    },    
    setHoldCartNote: (state, action) =>{
      state.holdCartNote = action.payload
    },
    setTaxAmounts: (state, action) =>{
      const calculatedTaxAmounts = action.payload.map((tax) => ({
        ...tax,
        amount: ((state.subTotal * tax.rate) / 100).toFixed(2),
      }));
      state.taxAmounts = calculatedTaxAmounts;
    },
    setSubTotal: (state, action)=>{
      state.subTotal = state.items?.reduce((sum, item) => sum + Number(item.sale_price) * item.quantity, 0);
    },
    setDiscount: (state, action) => {
      state.discountAmount = action.payload;
      const totalTax = state.taxAmounts.reduce((total, tax) => total + parseFloat(tax.amount), 0);
      state.discount =  state.discountType === "percentage" ? ((state.subTotal+totalTax) * state.discountAmount / 100).toFixed(2) : state.discountAmount.toFixed(2)
    },
    setDiscountType: (state, action) => {
      state.discountType = action.payload;
    },     
    setDiscountAmount: (state, action) => {
      state.discountAmount = action.payload;
    },    
    calculateTotalPrice: (state, action) => {
    //  const { state.subTotal, taxAmounts } = action.payload;
   //   console.log('action', action.payload)
      if(action.payload == undefined){
        const totalTax = state.taxAmounts.reduce((total, tax) => total + parseFloat(tax.amount), 0);
        state.totalAmount = (state.subTotal + totalTax) - state.discount;
        state.totalAmountWithLoyalty = (state.subTotal + totalTax) - state.discount;
      }else if(action.payload != undefined){
        const totalTax = state.taxAmounts.reduce((total, tax) => total + parseFloat(tax.amount), 0);
        state.totalAmountWithLoyalty = (state.subTotal + totalTax) - state.discount;
        state.totalAmount = (state.subTotal + totalTax) - state.discount - action.payload;
      }
    },
    setLoyaltyPoints: (state, action) => {
      state.loyaltyPoints = action.payload;
    },
    calculateLoyaltyPoints: (state, action) =>{
          let totalLoyaltyPoints = 0;
          state.items.forEach((item) => {
            const loyalty_value = Number(item.loyalty_value);
            if (loyalty_value>0) {
              totalLoyaltyPoints += (Number(item.sale_price) * Number(item.quantity) * loyalty_value) / 100;
            }
          });
         // console.log('totalLoyaltyPoints',totalLoyaltyPoints)
          state.loyaltyPoints = totalLoyaltyPoints;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload;
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
         // console.log(action.payload);
          state.items = action.payload.items;
          state.discountAmount = action.payload.discountAmount;
          state.discountType = action.payload.discountType;
          //state.discount = action.payload.discount;
         // state.loyaltyPoints = action.payload.loyaltyPoints;

      })
      ;
  },
});

export const { setSubTotal,setTaxAmounts, setDiscount, setDiscountType,setDiscountAmount, calculateTotalPrice, setLoyaltyPoints, setCustomerId, setCustomerEmail, setHoldCartNote,calculateLoyaltyPoints } = cartSlice.actions;
export default cartSlice.reducer;
