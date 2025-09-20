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

// Portal Components
import CustomerPortalRouter from './pages/Portal/CustomerPortalRouter.js';
import EmployeePortalRouter from './pages/Portal/EmployeePortalRouter.js';
import CustomerLogin from './pages/Auth/CustomerLogin.js';
import EmployeeLogin from './pages/Auth/EmployeeLogin.js';

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
import { AuthProvider } from './context/AuthContextNew';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';

// --- Main App Component ---
function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            
            {/* Portal Login Routes */}
            <Route path="/customer/login" element={<CustomerLogin/>}/>
            <Route path="/employee/login" element={<EmployeeLogin/>}/>
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/auth" element={<AuthPage/>}/>
            <Route path="/login/admin" element={<Adminsignin/>}/>
            <Route path="/login/customer" element={<Cussignin/>}/>
            
            {/* Public Routes */}
            <Route path="/products" element={<Product/>}/>
            <Route path="/products/learn-more" element={<LearnMoreProducts/>}/>
            <Route path="/checkout" element={<Checkout/>}/>

            {/* Customer Portal - Protected */}
            <Route path="/customer/*" element={
              <ProtectedRoute requiredPortal="customer">
                <CustomerPortalRouter/>
              </ProtectedRoute>
            }/>

            {/* Employee Portal - Protected */}
            <Route path="/employee/*" element={
              <ProtectedRoute requiredPortal="employee">
                <EmployeePortalRouter/>
              </ProtectedRoute>
            }/>

            {/* Legacy Account Routes - Redirect to appropriate portal */}
            <Route path="/account/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route path="/account/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
            <Route path="/account/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
            <Route path="/account/password" element={<ProtectedRoute><Password/></ProtectedRoute>} />
            <Route path="/account/addresses" element={<ProtectedRoute><Addresses/></ProtectedRoute>} />
            <Route path="/account/payments" element={<ProtectedRoute><Payments/></ProtectedRoute>} />

            {/* Legacy Support Routes */}
            <Route path="/support/track-order" element={<ProtectedRoute><TrackOrder/></ProtectedRoute>} />
            <Route path="/support/returns" element={<ProtectedRoute><Returns/></ProtectedRoute>} />
            <Route path="/support/chat" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
            <Route path="/support/packaging-help" element={<ProtectedRoute><PackagingHelp/></ProtectedRoute>} />

            {/* Legacy Dashboard Route - Redirect based on portal type */}
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <DashboardRouter/>
              </ProtectedRoute>
            }/>
            
            {/* Legacy Admin Routes - Redirect to employee portal */}
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
          </Routes>
        </BrowserRouter>
        </ThemeProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;