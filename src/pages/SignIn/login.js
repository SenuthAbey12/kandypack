import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './login.css'


export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: "55px" }}>
      
      <div className='sign-split-screen'>
        <div className='sign-left'>
          <h3>for admin</h3>
          <p>
            Access your personalized dashboard, track academic progress, submit assignments, and stay updated with the latest announcements. Empower your learning journey with a seamless and secure student experience.
          </p>
          <button onClick={() => navigate('/login/admin')}>Login</button>
          
        </div>
        <div className='sign-right'>
          <h3>for users</h3>
          <p>
            Manage your classes, upload materials, evaluate student performance, and communicate efficiently. Streamline your teaching workflow with all the tools you need in one place.
          </p>
          <button onClick={() => navigate('/login/customer')}>Login</button>
          <h6>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </h6>
        </div>
      </div>
    </div>
  )
}
