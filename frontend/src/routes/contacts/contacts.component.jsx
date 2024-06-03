import React from "react";
import ContactList from "../../components/contactList/contactList";
import AddContact from "../../components/addContact/addContact";
import { useSelector } from "react-redux";

const Contacts = () => {
    const contacts = useSelector(state => state.contacts);
    return(
        <>
        <AddContact/>
        <ContactList contacts={contacts}/>
        </>
    )
}

export default Contacts;