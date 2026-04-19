import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isLoggedIn, username, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">F</span>
          <span className="brand-text">FreshBite</span>
        </Link>

        <div className="navbar-links">
          {isLoggedIn && role === 'HELPER' && (
            <>
              <Link to="/menu" className="nav-link">Menu</Link>
              <Link to="/orders" className="nav-link">Orders</Link>
            </>
          )}
          {isLoggedIn && role === 'OWNER' && (
            <Link to="/admin" className="nav-link">Dashboard</Link>
          )}
        </div>

        <div className="navbar-actions">
          {isLoggedIn && role === 'HELPER' && <CartBadge />}

          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">{username}</span>
              <span className={`role-badge role-${role?.toLowerCase()}`}>{role}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function CartBadge() {
  const { totalItems } = useCart();
  return (
    <Link to="/cart" className="cart-badge-link">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
    </Link>
  );
}
