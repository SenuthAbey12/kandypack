import React from 'react'
import { Link } from 'react-router-dom'
export default function Home() {
  return (
    <div>
        <h1>Welcome to kandypack lifestore </h1>
        <Link to='/login'><button variant="light">Sign In</button></Link>
        <Link to='/signup'><button variant="light">Sign Up</button></Link>
        <Link to ='/dashboard'><button  variant="light">Dashboard</button></Link>
    </div>
  )
}
