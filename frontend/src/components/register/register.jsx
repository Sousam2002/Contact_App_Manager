import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearError, setError } from '../../features/userSlice';
import AuthNotice from '../authNotice/authNotice';
import { registerUser } from '../../services/authApi';
import { validateEmail, validatePassword } from '../../utils/validation';
import './register.css';

const Register = () => {
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const validateForm = (values) => {
    const errors = {};

    if (!values.username.trim()) {
      errors.username = 'Username is required.';
    }

    const emailError = validateEmail(values.email);
    if (emailError) {
      errors.email = emailError;
    }

    const passwordError = validatePassword(values.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    setFieldErrors(validateForm(nextFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFeedback({ message: 'Please fix the highlighted fields before registering.', type: 'error' });
      dispatch(setError('Please fix the highlighted fields before registering.'));
      return;
    }

    setIsSubmitting(true);
    setFeedback({ message: '', type: 'info' });

    try {
      const response = await registerUser(formData);
      dispatch(clearError());
      setFeedback({
        message: `Hi ${response.username}, registered successfully. You can log in now.`,
        type: 'success'
      });
      setFormData({
        username: '',
        email: '',
        password: ''
      });
      setFieldErrors({});
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

  const isSubmitDisabled =
    isSubmitting ||
    !formData.username.trim() ||
    !formData.email.trim() ||
    !formData.password.trim() ||
    Object.keys(fieldErrors).length > 0;

  return (
    <div className="register-container">
      <h1>Register</h1>
      <AuthNotice message={feedback.message} type={feedback.type} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="register-username">Username:</label>
          <input
            type="text"
            id="register-username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
          {fieldErrors.username && <p className="field-error">{fieldErrors.username}</p>}
        </div>
        <div>
          <label htmlFor="register-email">Email:</label>
          <input
            type="email"
            id="register-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
          {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="register-password">Password:</label>
          <input
            type="password"
            id="register-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
          <p className="field-hint">Use at least 8 characters with at least 1 letter and 1 number.</p>
          {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
        </div>
        {isSubmitting && <p className="form-status">Creating your account...</p>}
        <button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
