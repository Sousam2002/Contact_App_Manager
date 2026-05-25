import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearError, setError } from '../../features/userSlice';
import AuthNotice from '../authNotice/authNotice';
import './register.css';

const Register = () => {
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ message: '', type: 'info' });

    try {
      const response = await axios.post('http://localhost:5001/api/users/register', formData);
      dispatch(clearError());
      setFeedback({
        message: `Hi ${response.data.username}, registered successfully. You can log in now.`,
        type: 'success'
      });
      setFormData({
        username: '',
        email: '',
        password: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      if (errorMessage) {
        setFeedback({ message: errorMessage, type: 'error' });
        dispatch(setError(errorMessage));
      }
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="register-container">
      <h1>Register</h1>
      <AuthNotice message={feedback.message} type={feedback.type} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>
        {isSubmitting && <p className="form-status">Creating your account...</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
