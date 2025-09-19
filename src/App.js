import './App.css';
import Home from './pages/Home.js';
import Login from './pages/SignIn/login.js';
import SignUp from './pages/SignUp/signup.js';
import Adminsignin from './pages/SignIn/admin_signin.js';
import Cussignin from './pages/SignIn/cus_signin.js';
import Dashboard from './pages/Dashboard/Dashboard.js'
import Admin from './pages/Admin/Admin.js';
import AdminOverview from './pages/Dashboard/Admin Dashboard.js';
import Product from './pages/Product.js';
import AuthPage from './pages/AuthPage.js';
import ProtectedRoute from './Components/ProtectedRoute.js';
import Checkout from './pages/Checkout.js';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';

// --- Main App Component ---
function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/auth" element={<AuthPage/>}/>
            <Route path="/products" element={<Product/>}/>
            <Route path="/checkout" element={<Checkout/>}/>

            {/* Protected Dashboard Route - Access based on user role */}
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            }/>
            
            {/* Admin Only Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <Admin/>
              </ProtectedRoute>
            }/>
            <Route path="/admin/overview" element={
              <ProtectedRoute requiredRole="admin">
                <AdminOverview/>
              </ProtectedRoute>
            }/>
            
            {/* Legacy login routes */}
            <Route path="/login/admin" element={<Adminsignin/>}/>
            <Route path="/login/customer" element={<Cussignin/>}/>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}

// --- CSS Styles ---

export default App;
