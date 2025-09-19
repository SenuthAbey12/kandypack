import './App.css';
import Home from'./pages/Home.js';
import Login from './pages/SignIn/login.js';
import SignUp from './pages/SignUp/signup.js';
import Adminsignin from './pages/SignIn/admin_signin.js';
import Cussignin from './pages/SignIn/cus_signin.js';
import Dashboard from './pages/Dashboard/Dashboard.js'
import Admin from './pages/Admin/Admin.js';
import AdminOverview from './pages/Dashboard/Admin.js';
import Product from './pages/Product.js';
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
  <Route path="/admin" element={<Admin/>}/>
  <Route path="/admin/overview" element={<AdminOverview/>}/>
        <Route path="/products" element={<Product/>}/>
        
      </Routes>
    </BrowserRouter>
    
  );
}

// --- CSS Styles ---

export default App;
