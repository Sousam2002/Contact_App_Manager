import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setContacts } from "../../features/contactSlice";
import ContactCard from "../contactCard/contactCard";
import "./contactList.css";
// import ContactDelete from "../contactDelete/contactDelete";

const ContactList = ({ contacts }) => {
  // console.log(contacts);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  // const [allcontacts,setallcontactslist] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log("before fetch");
        const response = await axios.get("http://localhost:5001/api/contacts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setContacts(response.data));
        // console.log(contacts);
        // setallcontactslist(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    if (token) {
      fetchContacts();
    } else if (contacts.length === 0) {
      fetchContacts();
    }
  }, [dispatch, token]);

  // console.log(contacts);

  const handleDelete = async (contactId) => {
    try {
      await axios.delete(`http://localhost:5001/api/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedContacts = contacts.filter(
        (contact) => contact._id !== contactId
      );
      dispatch(setContacts(updatedContacts));
      // setcontactslist(updatedContacts);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // console.log("in contact list",contacts.contacts,typeof contacts,Array.isArray(contacts.contacts));
  return (
    <div className="contact-list">
      {contacts.contacts.map((contact) => (
        <div key={contact._id}>
          <div className="eachcontact">
            <ContactCard contact={contact} />
            {/* <ContactDelete contactId={contact._id} /> */}
            <button
              className="deletebutton"
              onClick={() => handleDelete(contact._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    // null
  );
};

export default ContactList;
