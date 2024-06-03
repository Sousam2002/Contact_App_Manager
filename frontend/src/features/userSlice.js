import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState:{
        username:null,
        user_id:null,
        error:null
    },
    reducers:{
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.user_id = action.payload.user_id;
            state.token = action.payload.token;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearUser:(state)=>{
            state.username=null;
            state.user_id=null;
            state.token=null;
        }
    },
});

export const { setUser, setError, clearError,clearUser } = userSlice.actions;

export default userSlice.reducer;