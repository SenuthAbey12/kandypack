import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SignUp/signup.css';

export default function SignUp() {
  const [form, setForm] = useState({
    Name: '',
    Address: '',
    mobileNo: '',
    DOB: '',
    Grade: '',
    email: '',
    password: '',
    confirmPwd: '',
    Subject: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nav = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {
    setError('');
    setSuccess('');

    // Password match validation
    if (form.password !== form.confirmPwd) {
      setError('Passwords do not match');
      return;
    }

    // Basic required fields check
    if (!form.Name || !form.Address || !form.mobileNo || !form.email || !form.username || !form.password) {
      setError('Please fill all required fields.');
      return;
    }

    // ===== FRONTEND-ONLY BEHAVIOR =====
    // Simulate a successful signup and navigate after a short delay.
    setSuccess('Signup successful!');
    setTimeout(() => nav('/home'), 2000);
  };

  return (
    <div className="su-container">
      <img src="/download.jpg" alt="banner" className="su-logo-img" />
      <div className="su-box">
        <h1>Welcome!</h1>
        <h2>Customer Registration</h2>
        <hr />

      
            <div className="su-form-group">
              <label htmlFor="cus_name">Name</label>
              <input type="text" id="cus_name" placeholder="Enter your name" value={form.Name} onChange={handleChange} />
            </div>
            <div className="su-form-group">
              <label htmlFor="Address">Address</label>
              <input type="text" id="Address" placeholder="Enter your address" value={form.Address} onChange={handleChange} />
            </div>
            <div className="su-form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" placeholder="Enter your city" value={form.Address} onChange={handleChange} />
            </div>
            <div className="su-form-group">
              <label htmlFor="mobileNo">Mobile No</label>
              <input type="tel" id="mobileNo" placeholder="07XXXXXXXX" value={form.mobileNo} onChange={handleChange} />
            </div>
            <div className="su-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Email" value={form.email} onChange={handleChange} />
            </div>
            <div className="su-form-group">
              <label htmlFor="username">Username</label>
              <input type="email" id="username" placeholder="username" value={form.email} onChange={handleChange} />
            </div>
            <div className="su-form-group">
              <label htmlFor="password">Create Password</label>
              <input type="password" id="password" placeholder="Create Password" value={form.password} onChange={handleChange} />
            </div>
            <div className="su-form-group">
              <label htmlFor="confirmPwd">Re-enter Password</label>
              <input type="password" id="confirmPwd" placeholder="Confirm Password" value={form.confirmPwd} onChange={handleChange} />
            </div>
          
            
        

        <button className="su-submit-btn" onClick={handleSubmit}>Submit</button>

        {error && <p className="su-error">{error}</p>}
        {success && <p className="su-success">{success}</p>}
      </div>
    </div>
  );
}
