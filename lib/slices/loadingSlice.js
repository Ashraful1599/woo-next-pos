import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    loading: false,
    progress: 0,
    message: ""
  },
  reducers: {
    setLoading: (state, action)=>{
        state.loading = action.payload;
    },
    setProgress: (state, action)=>{
        state.progress = action.payload
    },
    setMessage: (state, action)=>{
        state.message = action.payload
    }
    }
});






export const { setLoading, setProgress, setMessage } = loadingSlice.actions;
export default loadingSlice.reducer;
