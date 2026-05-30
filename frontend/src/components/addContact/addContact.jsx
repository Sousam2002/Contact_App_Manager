import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearSelectedContact,
    createContact,
    setContactError,
    startSave,
    updateContact,
} from "../../features/contactSlice";
import {
    createContactRequest,
    updateContactRequest,
} from "../../services/contactApi";
import "./addContact.css";

const AddContact = ({ activeToken, onStartAction }) => {
    const dispatch = useDispatch();
    const { selectedContact, isSaving } = useSelector((state) => state.contacts);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    useEffect(() => {
        if (selectedContact) {
            setFormData({
                name: selectedContact.name || "",
                email: selectedContact.email || "",
                phone: selectedContact.phone || "",
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: ""
            });
        }
    }, [selectedContact]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onStartAction?.();
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!activeToken) {
            dispatch(setContactError("You need to be signed in to manage contacts."));
            return;
        }

        onStartAction?.();
        dispatch(startSave());

        try {
            const response = selectedContact
                ? await updateContactRequest(activeToken, selectedContact._id, formData)
                : await createContactRequest(activeToken, formData);

            if (selectedContact) {
                dispatch(updateContact(response));
                dispatch(clearSelectedContact());
            } else {
                dispatch(createContact(response));
            }

            setFormData({
                name: "",
                email: "",
                phone: ""
            });
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.response?.data?.error || "Failed to save contact.";
            dispatch(setContactError(errorMessage));
        }
    };

    const handleCancelEdit = () => {
        onStartAction?.();
        dispatch(clearSelectedContact());
        setFormData({
            name: "",
            email: "",
            phone: ""
        });
    };

    return (
        <div className="add-contact-container">
            <h2>{selectedContact ? "Edit Contact" : "Add Contact"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSaving}
                        required
                    />
                </div>
                {isSaving && (
                    <p className="contact-form-status">
                        {selectedContact ? "Saving contact changes..." : "Creating contact..."}
                    </p>
                )}
                <div className="contact-form-actions">
                    <button type="submit" disabled={isSaving}>
                        {isSaving
                            ? selectedContact
                                ? "Saving..."
                                : "Adding..."
                            : selectedContact
                                ? "Save Contact"
                                : "Add Contact"}
                    </button>
                    {selectedContact && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddContact;
