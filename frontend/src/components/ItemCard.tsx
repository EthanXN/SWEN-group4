import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice, categoryColor, categoryEmoji } from '../utils/helpers';
import type { Item } from '../api/types';

interface Props {
  item: Item;
}

export default function ItemCard({ item }: Props) {
  const { role } = useAuth();
  const { addItem, items } = useCart();
  const inCart = items.some((ci) => ci.item.id === item.id);

  return (
    <div className={`item-card ${!item.available ? 'item-unavailable' : ''}`}>
      <Link to={`/menu/${item.id}`} className="item-card-image">
        <div
          className="item-placeholder"
          style={{ background: `linear-gradient(135deg, ${categoryColor(item.category)}22, ${categoryColor(item.category)}44)` }}
        >
          <span className="item-emoji">{categoryEmoji(item.category)}</span>
        </div>
        {!item.available && <span className="unavailable-badge">Unavailable</span>}
      </Link>

      <div className="item-card-body">
        {item.category && (
          <span className="item-category" style={{ color: categoryColor(item.category) }}>
            {item.category}
          </span>
        )}
        <Link to={`/menu/${item.id}`} className="item-name">{item.name}</Link>
        {item.description && (
          <p className="item-desc">{item.description.length > 80 ? item.description.slice(0, 80) + '...' : item.description}</p>
        )}
        <div className="item-card-footer">
          <span className="item-price">{formatPrice(item.price)}</span>
          {role === 'HELPER' && item.available && (
            <button
              className={`btn btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => addItem(item)}
            >
              {inCart ? 'Add More' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
