import { createSlice } from '@reduxjs/toolkit';


const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    cardPayment: 0,
    cashPayment: 0,
    loyaltyPayment: 0,
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
    setLoyaltyPayment: (state, action) =>{
      state.loyaltyPayment = Number(action.payload).toFixed(2)
    },
    changeHandle: (state, action)=>{
        const calChange = (state.cashPayment + state.cardPayment) - parseFloat(action.payload);
        state.change = calChange < 0 ? 0.00 : calChange;
    },
    tenderedHandle: (state, action)=>{
        state.tendered = state.cardPayment+state.cashPayment+parseFloat(state.loyaltyPayment)
    }
  }
});


export const { cardPaymentHandle, cashPaymentHandle, changeHandle, tenderedHandle, setLoyaltyPayment} = checkoutSlice.actions;
export default checkoutSlice.reducer;
