import React, { useEffect } from "react";
import ContactList from "../../components/contactList/contactList";
import AddContact from "../../components/addContact/addContact";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../cookiesHandler";
import "./contacts.component.css";

const Contacts = () => {
  const navigate = useNavigate();
  const contacts = useSelector((state) => state.contacts);
  const token = useSelector((state) => state.user.token);
  const storedToken = getCookie("token");

  useEffect(() => {
    if (!token && !storedToken) {
      navigate("/auth");
    }
  }, [navigate, storedToken, token]);

  if (!token && !storedToken) {
    return null;
  }

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
