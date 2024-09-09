import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice'; // Import your slice reducers
import productsReducer from './slices/productsSlice';
import taxReducer from '@/lib/slices/taxSlice';
import loadingReducer from '@/lib/slices/loadingSlice';
import customersReducer from '@/lib/slices/customersSlice';
import onlineReducer from './slices/onlineSlice';
import checkoutReducer from './slices/checkoutSlice';
import holdCartReducer from '@/lib/slices/holdCartSlice';
import ordersReducer from '@/lib/slices/ordersSlice';
import transactionsReducer from '@/lib/slices/transactionsSlice';
import refundReducer from '@/lib/slices/refundSlice';
import offlineOrdersReducer from '@/lib/slices/offlineOrdersSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
  taxes: taxReducer,
  loading: loadingReducer,
  customers: customersReducer,
  online: onlineReducer,
  checkout: checkoutReducer,
  holdCart: holdCartReducer,
  orders: ordersReducer,
  transactions: transactionsReducer,
  refund: refundReducer,
  offlineOrders: offlineOrdersReducer,
  // Add more reducers here
});

export default rootReducer;
 