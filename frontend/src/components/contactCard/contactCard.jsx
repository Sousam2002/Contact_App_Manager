import React, { useState ,useEffect} from "react";
import  axios from "axios";
import './contactCard.css';

const ContactCard = ({ contact }) => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const API_KEY = process.env.REACT_APP_API_KEY;
        const url = `https://api.multiavatar.com/${contact.email}.svg?apikey=${API_KEY}`;
        const response = await axios.get(url);
        setAvatarUrl(response.data); // Assuming the SVG data is directly available in the response
      } catch (error) {
        console.error('Error fetching avatar', error);
      }
    };

    fetchAvatar();
  }, [contact.email]);

  return (
    <div className="contact-card">
      {avatarUrl && <img className="avatar" src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarUrl)}`} alt="Avatar" />}
      <div className="contact-details">
        <h3>{`${contact.name}`.toUpperCase()}</h3>
        <p>Email: {contact.email}</p>
        <p>Phone: {contact.phone}</p>
        <p>Created At: {new Date(contact.createdAt).toLocaleString()}</p>
        <p>Updated At: {new Date(contact.updatedAt).toLocaleString()}</p>
      </div>
  </div>

  );
};

export default ContactCard;