import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsApi } from '../api/items';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/helpers';
import type { Item } from '../api/types';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      setItems(await itemsApi.getAll());
    } catch {
      showToast('Failed to load items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAvailability = async (item: Item) => {
    setToggling(item.id);
    try {
      const updated = await itemsApi.update(item.id, { ...item, available: !item.available });
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      showToast(`${item.name} is now ${!item.available ? 'available' : 'unavailable'}`, 'success');
    } catch {
      showToast('Failed to update item', 'error');
    } finally {
      setToggling(null);
    }
  };

  const deleteItem = async (item: Item) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await itemsApi.delete(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      showToast(`${item.name} deleted`, 'success');
    } catch {
      showToast('Failed to delete item', 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>{items.length} item{items.length !== 1 ? 's' : ''} in catalog</p>
        </div>
        <Link to="/admin/items/new" className="btn btn-primary">
          + Add Item
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading catalog..." />
      ) : items.length === 0 ? (
        <EmptyState
          icon="\uD83D\uDCE6"
          title="No items yet"
          description="Start building your menu by adding items."
          action={<Link to="/admin/items/new" className="btn btn-primary">Add First Item</Link>}
        />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={!item.available ? 'row-unavailable' : ''}>
                  <td>{item.id}</td>
                  <td>
                    <strong>{item.name}</strong>
                    {item.description && <br />}
                    {item.description && <small className="text-muted">{item.description.slice(0, 60)}</small>}
                  </td>
                  <td>{item.category || '\u2014'}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    <button
                      className={`toggle-btn ${item.available ? 'on' : 'off'}`}
                      onClick={() => toggleAvailability(item)}
                      disabled={toggling === item.id}
                      aria-label={`Toggle availability for ${item.name}`}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <Link to={`/admin/items/${item.id}/edit`} className="btn btn-outline btn-xs">
                        Edit
                      </Link>
                      <button className="btn btn-danger btn-xs" onClick={() => deleteItem(item)}>
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
