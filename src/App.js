import './App.css';
import Home from './pages/Home.js';
import SignUp from './pages/SignUp/signup.js';
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

// --- Main App Component ---
function App() {
  return (
    <AuthProvider>
        <StoreProvider>
          <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home/>}/>
              
              {/* Updated Login Routes - Customer login as main entry point */}
              <Route path="/login" element={<CustomerLogin/>}/>
              <Route path="/login/customer" element={<CustomerLogin/>}/>
              <Route path="/login/admin" element={<EmployeeLogin/>}/>
              <Route path="/login/employee" element={<EmployeeLogin/>}/>
              
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

            {/* Legacy admin routes - keep for backward compatibility */}
            <Route path="/admin/signin" element={<EmployeeLogin/>}/>
            <Route path="/customer/signin" element={<CustomerLogin/>}/>
          </Routes>
        </BrowserRouter>
        </ThemeProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

// --- CSS Styles ---

export default App;
