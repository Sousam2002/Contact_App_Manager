import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser,setError } from '../../features/userSlice';
import './login.css'; // Import the CSS file

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
      // console.log(response.data);
      dispatch(setUser(response.data));
      alert(`Welcome ${response.data.username}`);
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
