import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { createContact } from "../../features/contactSlice";

const AddContact = () => {
    const dispatch = useDispatch();
    // const contacts = useSelector((state)=> state.contacts);
    // console.log(contacts);
    const token = useSelector((state) => state.user.token);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/contacts", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Contact added successfully");
            dispatch(createContact(formData));
            // Optionally, you can reset the form after successful submission
            setFormData({
                name: "",
                email: "",
                phone: ""
            });
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    return (
        <div>
            <h2>Add Contact</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
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
                        required
                    />
                </div>
                <button type="submit">Add Contact</button>
            </form>
        </div>
    );
};

export default AddContact;
