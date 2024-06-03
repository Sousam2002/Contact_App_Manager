import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contacts: [],
  };
  
  const contactSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
      createContact(state, action) {
        state.contacts.push(action.payload);
      },
      deleteContact(state, action) {
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
      },
      setContacts(state,action){
        state.contacts = action.payload;
      },
      setContact(state){

      },
      updateContact(state,action){
        
      }

    },
  });

export const { createContact, deleteContact, setContacts, setContact, updateContact } = contactSlice.actions;

export default contactSlice.reducer;