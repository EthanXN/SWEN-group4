import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../api/users';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import type { User } from '../api/types';

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(await usersApi.getAll());
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteUser = async (user: User) => {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    try {
      await usersApi.delete(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      showToast('User deleted successfully', 'success');
    } catch {
      showToast('Failed to delete user', 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Users</h1>
          <p>{users.length} user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin" className="btn btn-outline">
            Catalog
          </Link>
          <Link to="/admin/users/new" className="btn btn-primary">
            + Add User
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon="\uD83D\uDC65"
          title="No users"
          description="No users are available."
          action={<Link to="/admin/users/new" className="btn btn-primary">Add User</Link>}
        />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Cart items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
                  </td>
                  <td>{user.collection?.length ?? 0}</td>
                  <td>
                    <div className="action-btns">
                      <Link to={`/admin/users/${user.id}/edit`} className="btn btn-outline btn-xs">
                        Edit
                      </Link>
                      <button type="button" className="btn btn-danger btn-xs" onClick={() => deleteUser(user)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
