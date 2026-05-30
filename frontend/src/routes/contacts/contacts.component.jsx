import React, { useEffect } from "react";
import ContactList from "../../components/contactList/contactList";
import AddContact from "../../components/addContact/addContact";
import StatusNotice from "../../components/statusNotice/statusNotice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuthSession } from "../../cookiesHandler";
import {
  clearContactFeedback,
  setContactError,
  setContacts,
  startFetch,
} from "../../features/contactSlice";
import { fetchContactsRequest } from "../../services/contactApi";
import "./contacts.component.css";

const Contacts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const { error, successMessage } = useSelector((state) => state.contacts);
  const storedToken = getAuthSession().token;
  const activeToken = token || storedToken;

  useEffect(() => {
    if (!activeToken) {
      navigate("/auth");
    }
  }, [activeToken, navigate]);

  useEffect(() => {
    const loadContacts = async () => {
      dispatch(startFetch());

      try {
        const response = await fetchContactsRequest(activeToken);
        dispatch(setContacts(response));
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.response?.data?.error || "Failed to load contacts.";
        dispatch(setContactError(errorMessage));
      }
    };

    if (activeToken) {
      loadContacts();
    }
  }, [activeToken, dispatch]);

  if (!activeToken) {
    return null;
  }

  return (
    <div className="contacts-page-shell">
      <div className="contacts-header">
        <StatusNotice message={error || successMessage} type={error ? "error" : "success"} />
      </div>
      <div className="contactpage">
        <div className="addcontact-container">
          <AddContact activeToken={activeToken} onStartAction={() => dispatch(clearContactFeedback())} />
        </div>
        <div className="contactlist-container">
          <ContactList activeToken={activeToken} onStartAction={() => dispatch(clearContactFeedback())} />
        </div>
      </div>
    </div>
  );
};

export default Contacts;
