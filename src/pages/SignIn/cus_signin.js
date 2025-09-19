import React, { useState } from 'react';
import './signin.css';
import { useNavigate, Link } from 'react-router-dom';


export default function Cussignin() {
    const [regNo, setRegNo] = useState('');
  const [pwd, setPwd] = useState('');
  const [remember] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleLogin = () => {
    // Clear any previous error
    setError('');

    // Basic client-side validation
    if (!regNo || !pwd) {
      setError('Please enter your Registration No and Password.');
      return;
    }

    localStorage.setItem('studentId', regNo);
    if (remember) {
      localStorage.setItem('rememberRegNo', regNo);
    } else {
      localStorage.removeItem('rememberRegNo');
    }
    nav('/home');
  };


  return (
  <div className="login-container">
  <img className="login-bg" src="/OIP.jpg" alt="background" />
  <div className="login-content">
    <h1>Welcome back!</h1>
    <h1>Login to your account</h1>
    <hr />
    <div className="login-form-group">
      <input
        type="text"
        placeholder="Registration Number"
        value={regNo}
        onChange={e => setRegNo(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={pwd}
        onChange={e => setPwd(e.target.value)}
      />
      <button className='login-button' onClick={handleLogin}>Next</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    <div className="login-remember-me">
      <input type="checkbox" id="remember" />
      <label htmlFor="remember">Remember me</label>
    </div>
    <p>or</p>
    <h6>
      Don't have an account? <Link to="/signup" style={{ color: 'lightblue' }}>Sign Up</Link>
    </h6>
  </div>
</div>

  );
  
}
