import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsApi } from '../api/items';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { CATEGORIES } from '../utils/helpers';

export default function AdminItemForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    itemsApi
      .getById(Number(id))
      .then((item) => {
        setName(item.name || '');
        setDescription(item.description || '');
        setPrice(item.price != null ? String(item.price) : '');
        setCategory(item.category || '');
        setAvailable(item.available);
      })
      .catch(() => setError('Item not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = (): boolean => {
    if (!name.trim()) { setError('Name is required'); return false; }
    if (price && (isNaN(Number(price)) || Number(price) < 0)) {
      setError('Price must be a positive number');
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
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        price: price ? Number(price) : null,
        category: category || null,
        available,
      };

      if (isEdit && id) {
        await itemsApi.update(Number(id), payload);
        showToast('Item updated', 'success');
      } else {
        await itemsApi.create(payload);
        showToast('Item created', 'success');
      }
      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
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
        <span>{isEdit ? 'Edit Item' : 'New Item'}</span>
      </nav>

      <h1>{isEdit ? 'Edit Item' : 'Create Item'}</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this item..."
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <span>Available for ordering</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
