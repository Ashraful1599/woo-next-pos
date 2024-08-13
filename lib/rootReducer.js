import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice'; // Import your slice reducers
import productsReducer from './slices/productsSlice';
import taxReducer from '@/lib/slices/taxSlice';
import loadingReducer from '@/lib/slices/loadingSlice';
import customersReducer from '@/lib/slices/customersSlice';
import onlineReducer from './slices/onlineSlice';
import checkoutReducer from './slices/checkoutSlice';
import holdCartReducer from '@/lib/slices/holdCartSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
  taxes: taxReducer,
  loading: loadingReducer,
  customers: customersReducer,
  online: onlineReducer,
  checkout: checkoutReducer,
  holdCart: holdCartReducer,
  // Add more reducers here
});

export default rootReducer;
