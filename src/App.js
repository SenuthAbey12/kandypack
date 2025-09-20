import './App.css';
import Home from './pages/Home.js';
import Login from './pages/SignIn/login.js';
import SignUp from './pages/SignUp/signup.js';
import Adminsignin from './pages/SignIn/admin_signin.js';
import Cussignin from './pages/SignIn/cus_signin.js';
import DashboardRouter from './pages/Dashboard/DashboardRouter.js'
import Admin from './pages/Admin/Admin.js';
import AdminOverview from './pages/Dashboard/Admin Dashboard.js';
import Product from './pages/Product.js';
import LearnMoreProducts from './pages/LearnMoreProducts.js';
import AuthPage from './pages/AuthPage.js';
// Account & Support pages
import Profile from './pages/Account/Profile.js';
import Orders from './pages/Account/Orders.js';
import Settings from './pages/Account/Settings.js';
import Password from './pages/Account/Password.js';
import Addresses from './pages/Account/Addresses.js';
import Payments from './pages/Account/Payments.js';
import TrackOrder from './pages/Support/TrackOrder.js';
import Returns from './pages/Support/Returns.js';
import Chat from './pages/Support/Chat.js';
import PackagingHelp from './pages/Support/PackagingHelp.js';
import ProtectedRoute from './Components/ProtectedRoute.js';
import Checkout from './pages/Checkout.js';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';

// Portal Components
import EmployeeLogin from './pages/Auth/EmployeeLogin.js';
import CustomerLogin from './pages/Auth/CustomerLogin.js';
import EmployeePortalRouter from './pages/Portal/EmployeePortalRouter.js';
import CustomerPortalRouter from './pages/Portal/CustomerPortalRouter.js';
import { AuthProvider as AuthProviderNew } from './context/AuthContextNew.js';

// --- Main App Component ---
function App() {
  return (
    <AuthProvider>
      <AuthProviderNew>
        <StoreProvider>
          <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/auth" element={<AuthPage/>}/>
              <Route path="/products" element={<Product/>}/>
              <Route path="/products/learn-more" element={<LearnMoreProducts/>}/>
              <Route path="/checkout" element={<Checkout/>}/>

              {/* New Portal System */}
              <Route path="/employee/login" element={<EmployeeLogin/>}/>
              <Route path="/customer/login" element={<CustomerLogin/>}/>
              <Route path="/employee/*" element={<EmployeePortalRouter/>}/>
              <Route path="/customer/*" element={<CustomerPortalRouter/>}/>

                {/* Account Routes */}
                <Route path="/account/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
                <Route path="/account/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
                <Route path="/account/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
              <Route path="/account/password" element={<ProtectedRoute><Password/></ProtectedRoute>} />
              <Route path="/account/addresses" element={<ProtectedRoute><Addresses/></ProtectedRoute>} />
              <Route path="/account/payments" element={<ProtectedRoute><Payments/></ProtectedRoute>} />

              {/* Support Routes */}
              <Route path="/support/track-order" element={<ProtectedRoute><TrackOrder/></ProtectedRoute>} />
              <Route path="/support/returns" element={<ProtectedRoute><Returns/></ProtectedRoute>} />
              <Route path="/support/chat" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
              <Route path="/support/packaging-help" element={<ProtectedRoute><PackagingHelp/></ProtectedRoute>} />

            {/* Protected Dashboard Route - routes to Admin/Customer automatically */}
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <DashboardRouter/>
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
        </ThemeProvider>
      </StoreProvider>
      </AuthProviderNew>
    </AuthProvider>
  );
}

// --- CSS Styles ---

export default App;
