import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteContact,
  setContact,
  setContactError,
  startDelete,
} from "../../features/contactSlice";
import { deleteContactRequest } from "../../services/contactApi";
import ContactCard from "../contactCard/contactCard";
import "./contactList.css";

const ContactList = ({ activeToken, onStartAction }) => {
  const dispatch = useDispatch();
  const {
    contacts,
    selectedContact,
    isFetching,
    deletingContactId,
  } = useSelector((state) => state.contacts);

  const handleDelete = async (contactId) => {
    if (!activeToken) {
      dispatch(setContactError("You need to be signed in to delete contacts."));
      return;
    }

    onStartAction?.();
    dispatch(startDelete(contactId));

    try {
      await deleteContactRequest(activeToken, contactId);
      dispatch(deleteContact(contactId));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to delete contact.";
      dispatch(setContactError(errorMessage));
    }
  };

  const handleSelect = (contact) => {
    onStartAction?.();
    dispatch(setContact(contact));
  };

  if (isFetching) {
    return <div className="contact-list-state">Loading contacts...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="contact-list-state empty-state">
        <h3>No contacts yet</h3>
        <p>Add your first contact to start building your contact list.</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <div key={contact._id} className={`eachcontact ${selectedContact?._id === contact._id ? "selected-contact" : ""}`}>
          <ContactCard
            contact={contact}
            isSelected={selectedContact?._id === contact._id}
          />
          <div className="contact-actions">
            <button
              className="editbutton"
              type="button"
              onClick={() => handleSelect(contact)}
            >
              {selectedContact?._id === contact._id ? "Editing" : "Edit"}
            </button>
            <button
              className="deletebutton"
              type="button"
              onClick={() => handleDelete(contact._id)}
              disabled={deletingContactId === contact._id}
            >
              {deletingContactId === contact._id ? "Deleting..." : "Delete"}
            </button>
          </div>
          {selectedContact?._id === contact._id && (
            <div className="selected-label">Selected for editing</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactList;
