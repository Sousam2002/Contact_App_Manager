import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: null,
    userId: null,
    token: null,
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setUser: (state, action) => {
            state.username = action.payload.username ?? null;
            state.userId = action.payload.userId ?? action.payload.user_id ?? action.payload._id ?? null;
            state.token = action.payload.token ?? null;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearUser:(state)=>{
            state.username = null;
            state.userId = null;
            state.token = null;
            state.error = null;
        }
    },
});

export const { setUser, setError, clearError,clearUser } = userSlice.actions;

export default userSlice.reducer;