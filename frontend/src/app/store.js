import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import contactsReducer from '../features/contactSlice';
export const store = configureStore({
    reducer: {
        user: userReducer,
        contacts:contactsReducer
        // Add other reducers if any
    },
});


