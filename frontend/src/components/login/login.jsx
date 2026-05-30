import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearError, setError, setUser } from '../../features/userSlice';
import { useNavigate } from 'react-router-dom';
import AuthNotice from '../authNotice/authNotice';
import './login.css';
import { setAuthSession } from '../../cookiesHandler';
import { loginUser } from '../../services/authApi';
import { validateEmail } from '../../utils/validation';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const validateForm = (values) => {
    const errors = {};
    const emailError = validateEmail(values.email);

    if (emailError) {
      errors.email = emailError;
    }

    if (!values.password) {
      errors.password = 'Password is required.';
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
      setFeedback({ message: 'Please fix the highlighted fields before logging in.', type: 'error' });
      dispatch(setError('Please fix the highlighted fields before logging in.'));
      return;
    }

    setIsSubmitting(true);
    setFeedback({ message: '', type: 'info' });

    try {
      const response = await loginUser(formData);
      dispatch(setUser(response));
      dispatch(clearError());
      setAuthSession(response);
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

  const isSubmitDisabled =
    isSubmitting ||
    !formData.email.trim() ||
    !formData.password ||
    Object.keys(fieldErrors).length > 0;

  return (
    <div className="login-container">
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
          {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
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
          {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
        </div>
        {isSubmitting && <p className="form-status">Signing you in...</p>}
        <button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
