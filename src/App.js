import './App.css';
import Home from'./pages/Home.js';
import Login from './pages/login.js';
import SignUp from './pages/signup.js';
import Adminsignin from './pages/admin_signin.js';
import Cussignin from './pages/cus_signin.js';
import Dashboard from './pages/Dashboard/Dashboard.js'
import { BrowserRouter,Routes, Route } from 'react-router-dom';


// --- Main App Component ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/login/admin" element={<Adminsignin/>}/>
        <Route path="/login/customer" element={<Cussignin/>}/>

      </Routes>
    </BrowserRouter>
    
  );
}

// --- CSS Styles ---

export default App;
