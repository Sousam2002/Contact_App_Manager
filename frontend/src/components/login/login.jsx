import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearError, setError, setUser } from '../../features/userSlice';
import { useNavigate } from 'react-router-dom';
import AuthNotice from '../authNotice/authNotice';
import './login.css'; // Import the CSS file
import { setCookie } from '../../cookiesHandler';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ message: '', type: 'info' });

    try {
      const response = await axios.post('http://localhost:5001/api/users/login', formData);
      
      // Storing user in redux state
      dispatch(setUser(response.data));
      dispatch(clearError());
      
      // Store token and user_id in cookies
      const { token, user_id,username } = response.data;
      const expirationTime = new Date(Date.now() + 3600000); // 1 hour expiration time
      setCookie("token",token,expirationTime);
      setCookie("user_id",user_id,expirationTime);
      setCookie("username",username,expirationTime);
      navigate('/contacts');

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      setFeedback({ message: errorMessage, type: 'error' });
      dispatch(setError(errorMessage));
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container"> {/* Apply the container style */}
      <h1>Login</h1>
      <AuthNotice message={feedback.message} type={feedback.type} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            required
          />
        </div>
        {isSubmitting && <p className="form-status">Signing you in...</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
