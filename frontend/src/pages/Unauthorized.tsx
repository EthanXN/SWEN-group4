import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Unauthorized() {
  const { role } = useAuth();

  return (
    <div className="error-page">
      <h1>403</h1>
      <p>You don't have permission to access this page.</p>
      {role === 'HELPER' ? (
        <Link to="/menu" className="btn btn-primary">Go to Menu</Link>
      ) : role === 'OWNER' ? (
        <Link to="/admin" className="btn btn-primary">Go to Dashboard</Link>
      ) : (
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      )}
    </div>
  );
}
