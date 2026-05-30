import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contacts: [],
    selectedContact: null,
    isFetching: false,
    isSaving: false,
    deletingContactId: null,
    error: null,
    successMessage: null,
};
  
  const contactSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
      startFetch(state) {
        state.isFetching = true;
        state.error = null;
        state.successMessage = null;
      },
      startSave(state) {
        state.isSaving = true;
        state.error = null;
        state.successMessage = null;
      },
      startDelete(state, action) {
        state.deletingContactId = action.payload;
        state.error = null;
        state.successMessage = null;
      },
      createContact(state, action) {
        state.contacts = [action.payload, ...state.contacts];
        state.isSaving = false;
        state.error = null;
        state.successMessage = "Contact added successfully.";
      },
      deleteContact(state, action) {
        state.contacts = state.contacts.filter((contact) => contact._id !== action.payload);
        state.deletingContactId = null;
        if (state.selectedContact?._id === action.payload) {
          state.selectedContact = null;
        }
        state.error = null;
        state.successMessage = "Contact deleted successfully.";
      },
      setContacts(state, action) {
        state.contacts = action.payload;
        state.isFetching = false;
        state.error = null;
        if (state.selectedContact) {
          state.selectedContact =
            action.payload.find((contact) => contact._id === state.selectedContact._id) || null;
        }
      },
      setContact(state, action) {
        state.selectedContact = action.payload;
        state.successMessage = null;
        state.error = null;
      },
      clearSelectedContact(state) {
        state.selectedContact = null;
      },
      updateContact(state, action) {
        state.contacts = state.contacts.map((contact) =>
          contact._id === action.payload._id ? action.payload : contact
        );
        state.selectedContact = action.payload;
        state.isSaving = false;
        state.error = null;
        state.successMessage = "Contact updated successfully.";
      },
      setContactError(state, action) {
        state.error = action.payload;
        state.isFetching = false;
        state.isSaving = false;
        state.deletingContactId = null;
      },
      clearContactFeedback(state) {
        state.error = null;
        state.successMessage = null;
      },
      resetContactsState() {
        return { ...initialState };
      }

    },
  });

export const {
  startFetch,
  startSave,
  startDelete,
  createContact,
  deleteContact,
  setContacts,
  setContact,
  clearSelectedContact,
  updateContact,
  setContactError,
  clearContactFeedback,
  resetContactsState,
} = contactSlice.actions;

export default contactSlice.reducer;
