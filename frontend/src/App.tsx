import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import ItemDetails from './pages/ItemDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserForm from './pages/AdminUserForm';
import AdminItemForm from './pages/AdminItemForm';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Authenticated (any role) */}
                <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                <Route path="/menu/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />

                {/* Helper only */}
                <Route path="/cart" element={<ProtectedRoute requiredRole="HELPER"><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute requiredRole="HELPER"><Checkout /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute requiredRole="HELPER"><Orders /></ProtectedRoute>} />

                {/* Owner only */}
                <Route path="/admin" element={<ProtectedRoute requiredRole="OWNER"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute requiredRole="OWNER"><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/users/new" element={<ProtectedRoute requiredRole="OWNER"><AdminUserForm /></ProtectedRoute>} />
                <Route path="/admin/users/:id/edit" element={<ProtectedRoute requiredRole="OWNER"><AdminUserForm /></ProtectedRoute>} />
                <Route path="/admin/items/new" element={<ProtectedRoute requiredRole="OWNER"><AdminItemForm /></ProtectedRoute>} />
                <Route path="/admin/items/:id/edit" element={<ProtectedRoute requiredRole="OWNER"><AdminItemForm /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
