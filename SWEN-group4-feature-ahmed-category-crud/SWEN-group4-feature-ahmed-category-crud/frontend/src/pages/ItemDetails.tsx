import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { itemsApi } from '../api/items';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatPrice, categoryColor, categoryEmoji } from '../utils/helpers';
import type { Item } from '../api/types';

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const { addItem, items: cartItems } = useCart();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  const inCart = item ? cartItems.some((ci) => ci.item.id === item.id) : false;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    itemsApi
      .getById(Number(id))
      .then(setItem)
      .catch(() => setError('Item not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!item) return;
    for (let i = 0; i < qty; i++) {
      await addItem(item);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !item) {
    return <EmptyState icon="404" title="Item not found" description="This item doesn't exist or has been removed." />;
  }

  return (
    <div className="detail-page">
      <nav className="breadcrumbs">
        <Link to="/menu">Menu</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{item.name}</span>
      </nav>

      <div className="detail-grid">
        <div
          className="detail-image"
          style={{
            background: `linear-gradient(135deg, ${categoryColor(item.category)}22, ${categoryColor(item.category)}55)`,
          }}
        >
          <span className="detail-emoji">{categoryEmoji(item.category)}</span>
          {!item.available && <span className="unavailable-badge large">Unavailable</span>}
        </div>

        <div className="detail-info">
          {item.category && (
            <span className="item-category" style={{ color: categoryColor(item.category) }}>
              {item.category}
            </span>
          )}
          <h1>{item.name}</h1>
          <p className="detail-price">{formatPrice(item.price)}</p>
          {item.description && <p className="detail-desc">{item.description}</p>}

          <div className="detail-status">
            <span className={`status-dot ${item.available ? 'available' : 'unavailable'}`} />
            {item.available ? 'Available' : 'Currently Unavailable'}
          </div>

          {role === 'HELPER' && (
            <div className="detail-actions">
              <div className="qty-selector">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={!item.available}>
                  &minus;
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} disabled={!item.available}>
                  +
                </button>
              </div>
              <button
                className="btn btn-primary btn-lg"
                disabled={!item.available}
                onClick={handleAdd}
              >
                {inCart ? `Add ${qty} More` : `Add ${qty} to Cart`}
                {item.price != null && ` \u2014 ${formatPrice(item.price * qty)}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
