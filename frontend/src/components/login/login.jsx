import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser,setError } from '../../features/userSlice';
import './login.css'; // Import the CSS file
import { setCookie } from '../../cookiesHandler';

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', formData);
      
      // Storing user in redux state
      dispatch(setUser(response.data));
      alert(`Welcome ${response.data.username}`);

      
      // Store token and user_id in cookies
      const { token, user_id,username } = response.data;
      const expirationTime = new Date(Date.now() + 3600000); // 1 hour expiration time
      setCookie("token",token,expirationTime);
      setCookie("user_id",user_id,expirationTime);
      setCookie("username",username,expirationTime);

    } catch (error) {
      if(error.response && error.response.status === 401){
        alert(error.response.data.error);
        dispatch(setError(error.response.data.error));
      }
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="login-container"> {/* Apply the container style */}
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
