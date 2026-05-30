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
import {
    findDuplicateContact,
    normalizeEmail,
    normalizePhone,
    validateEmail,
    validatePhone,
} from "../../utils/validation";
import "./addContact.css";

const AddContact = ({ activeToken, onStartAction }) => {
    const dispatch = useDispatch();
    const { contacts, selectedContact, isSaving } = useSelector((state) => state.contacts);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [fieldErrors, setFieldErrors] = useState({});

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
        setFieldErrors({});
    }, [selectedContact]);

    const validateForm = (values) => {
        const errors = {};

        if (!values.name.trim()) {
            errors.name = "Name is required.";
        }

        const emailError = validateEmail(values.email);
        if (emailError) {
            errors.email = emailError;
        }

        const phoneError = validatePhone(values.phone);
        if (phoneError) {
            errors.phone = phoneError;
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        onStartAction?.();
        const nextFormData = { ...formData, [name]: value };
        setFormData(nextFormData);
        setFieldErrors(validateForm(nextFormData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!activeToken) {
            dispatch(setContactError("You need to be signed in to manage contacts."));
            return;
        }

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            dispatch(setContactError("Please fix the highlighted fields before saving this contact."));
            return;
        }

        const duplicateContact = findDuplicateContact(contacts, formData, selectedContact?._id);
        if (duplicateContact) {
            const duplicateField =
                normalizeEmail(duplicateContact.email) === normalizeEmail(formData.email)
                    ? "email"
                    : normalizePhone(duplicateContact.phone) === normalizePhone(formData.phone)
                        ? "phone number"
                        : "details";

            dispatch(setContactError(`A contact with this ${duplicateField} already exists.`));
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
            setFieldErrors({});
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
        setFieldErrors({});
    };

    const isSubmitDisabled =
        isSaving ||
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim() ||
        Object.keys(fieldErrors).length > 0;

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
                    {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
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
                    {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
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
                    <p className="field-hint">Use 7 to 15 digits. Spaces, dashes, and a leading + are allowed.</p>
                    {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
                </div>
                {isSaving && (
                    <p className="contact-form-status">
                        {selectedContact ? "Saving contact changes..." : "Creating contact..."}
                    </p>
                )}
                <div className="contact-form-actions">
                    <button type="submit" disabled={isSubmitDisabled}>
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
