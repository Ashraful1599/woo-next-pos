import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const onlineSlice = createSlice({
    name: 'online',
    initialState:{
        isOnline: true,
    },
    reducers: {
        goOnline: (state) => {
            state.isOnline = true;
        },
        goOffline: (state) => {
            state.isOnline = false;
        }
    },
});

export const { goOnline, goOffline } = onlineSlice.actions;
export default onlineSlice.reducer;