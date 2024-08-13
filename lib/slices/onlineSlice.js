import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    isOnline: true,
};

const onlineSlice = createSlice({
    name: 'online',
    initialState,
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