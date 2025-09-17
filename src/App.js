import './App.css';
import Home from'./pages/Home.js';
import Login from './pages/login.js';
import SignUp from './pages/signup.js';
import Adminsignin from './pages/admin_signin.js';
import Cussignin from './pages/cus_signin.js';
import { BrowserRouter,Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login/admin" element={<Adminsignin/>}/>
        <Route path="/login/customer" element={<Cussignin/>}/>

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
