import React, { useState, useEffect } from "react";
import axios from "axios";
import "./contactCard.css";

const ContactCard = ({ contact, isSelected = false }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const initials = `${contact.name || ""}`
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!process.env.REACT_APP_API_KEY) {
        setAvatarUrl("");
        return;
      }

      try {
        const API_KEY = process.env.REACT_APP_API_KEY;
        const url = `https://api.multiavatar.com/${contact.email}.svg?apikey=${API_KEY}`;
        const response = await axios.get(url);
        setAvatarUrl(response.data); // Assuming the SVG data is directly available in the response
      } catch (error) {
        setAvatarUrl("");
      }
    };

    fetchAvatar();
  }, [contact.email]);

  const createdDate = contact.createdAt ? new Date(contact.createdAt) : null;
  const formattedDate = createdDate
    ? new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(createdDate)
    : null;

  return (
    <div className={`contact-card ${isSelected ? "contact-card-selected" : ""}`}>
      {avatarUrl ? (
        <img
          className="avatar"
          src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarUrl)}`}
          alt="Avatar"
        />
      ) : (
        <div className="avatar avatar-fallback">{initials}</div>
      )}
      <div className="contact-details">
        <h3>{`${contact.name}`.toUpperCase()}</h3>
        <p><b>Email:</b> {contact.email}</p>
        <p><b>Phone:</b> {contact.phone}</p>
        {formattedDate && <p><b>Created On:</b> {formattedDate}</p>}
      </div>
    </div>
  );
};

export default ContactCard;