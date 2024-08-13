import { createSlice } from '@reduxjs/toolkit';


const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    cardPayment: 0,
    cashPayment: 0,
    change: 0,
    tendered: 0,
  },
  reducers: {
    cardPaymentHandle: (state, action)=>{
        state.cardPayment = parseFloat(action.payload);
    },
    cashPaymentHandle: (state, action)=>{
        state.cashPayment = parseFloat(action.payload);
    },
    changeHandle: (state, action)=>{
        state.change =  (state.cashPayment + state.cardPayment) - parseFloat(action.payload);
    },
    tenderedHandle: (state, action)=>{
        state.tendered = action.payload;
    }
  }
});


export const { cardPaymentHandle, cashPaymentHandle, changeHandle, tenderedHandle} = checkoutSlice.actions;
export default checkoutSlice.reducer;
