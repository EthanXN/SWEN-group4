import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantityStepper from '../components/QuantityStepper';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice, categoryEmoji } from '../utils/helpers';

export default function Cart() {
  const { items, loading, totalPrice, removeItem, updateQuantity } = useCart();

  if (loading) return <LoadingSpinner text="Loading cart..." />;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <EmptyState
          icon="\uD83D\uDED2"
          title="Your cart is empty"
          description="Browse the menu and add some items to get started."
          action={<Link to="/menu" className="btn btn-primary">Browse Menu</Link>}
        />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(({ item, quantity }) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <span>{categoryEmoji(item.category)}</span>
              </div>
              <div className="cart-item-info">
                <Link to={`/menu/${item.id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <span className="cart-item-price">{formatPrice(item.price)}</span>
              </div>
              <QuantityStepper
                value={quantity}
                onChange={(val) => updateQuantity(item.id, val)}
              />
              <div className="cart-item-total">
                {formatPrice((item.price ?? 0) * quantity)}
              </div>
              <button
                className="cart-item-remove"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>{formatPrice(totalPrice * 0.08)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(totalPrice * 1.08)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block">
            Proceed to Checkout
          </Link>
          <Link to="/menu" className="btn btn-outline btn-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
