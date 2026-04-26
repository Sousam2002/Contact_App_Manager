import React from "react";
import ContactList from "../../components/contactList/contactList";
import AddContact from "../../components/addContact/addContact";
import { useSelector } from "react-redux";
import "./contacts.component.css";

const Contacts = () => {
  const contacts = useSelector(state => state.contacts);
  return (
    <div className="contactpage">
      <div className="addcontact-container">
        <AddContact />
      </div>
      <div className="contactlist-container">
        <ContactList contacts={contacts} />
      </div>
    </div>
  );
};

export default Contacts;
