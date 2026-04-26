import React, { useState ,useEffect} from "react";
import  axios from "axios";
import './contactCard.css';

const ContactCard = ({ contact }) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
  var d = new Date(contact.createdAt);
  var day = days[d.getDay()];
  var date = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();
  return (
    <div className="contact-card">
      {avatarUrl && <img className="avatar" src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarUrl)}`} alt="Avatar" />}
      <div className="contact-details">
        <h3>{`${contact.name}`.toUpperCase()}</h3>
        <p><b>Email:</b> {contact.email}</p>
        <p><b>Phone:</b> {contact.phone}</p>
        <p><b>Created On:</b> {`${day} , ${date}/${month}/${year}`}</p>
      </div>
  </div>

  );
};

export default ContactCard;