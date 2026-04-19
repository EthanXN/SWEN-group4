import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usersApi, type UserUpdatePayload } from '../api/users';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

type Role = 'OWNER' | 'HELPER';

export default function AdminUserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('HELPER');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    usersApi
      .getById(Number(id))
      .then((user) => {
        setUsername(user.username);
        setRole(user.role);
        setPassword('');
      })
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = (): boolean => {
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!isEdit && !password) {
      setError('Password is required for new users');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit && id) {
        const payload: UserUpdatePayload = {
          username: username.trim(),
          role,
        };
        if (password) payload.password = password;
        await usersApi.update(Number(id), payload);
        showToast('User updated', 'success');
      } else {
        await usersApi.create({
          username: username.trim(),
          password,
          role,
        });
        showToast('User created', 'success');
      }
      navigate('/admin/users');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-form-page">
      <nav className="breadcrumbs">
        <Link to="/admin">Dashboard</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/admin/users">Users</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{isEdit ? 'Edit User' : 'New User'}</span>
      </nav>

      <h1>{isEdit ? 'Edit User' : 'Create User'}</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{isEdit ? 'New password' : 'Password *'}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEdit ? 'Leave blank to keep current password' : 'Password'}
            autoComplete="new-password"
            required={!isEdit}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="HELPER">HELPER</option>
            <option value="OWNER">OWNER</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/users')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}
