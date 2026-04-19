import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadOrders } from '../context/CartContext';
import EmptyState from '../components/EmptyState';
import { formatPrice, formatDate } from '../utils/helpers';
import type { LocalOrder } from '../api/types';

export default function Orders() {
  const [orders] = useState<LocalOrder[]>(loadOrders);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h1>Your Orders</h1>
        <EmptyState
          icon="\uD83D\uDCCB"
          title="No orders yet"
          description="Once you place an order, it will appear here."
          action={<Link to="/menu" className="btn btn-primary">Browse Menu</Link>}
        />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div
              className="order-header"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div>
                <strong>Order #{order.id.slice(0, 8).toUpperCase()}</strong>
                <span className="order-date">{formatDate(order.submittedAt)}</span>
              </div>
              <div className="order-meta">
                <span className="order-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <span className="order-total">{formatPrice(order.totalCost)}</span>
                <span className="expand-arrow">{expandedId === order.id ? '\u25B2' : '\u25BC'}</span>
              </div>
            </div>

            {expandedId === order.id && (
              <div className="order-details">
                {order.items.map((oi) => (
                  <div key={oi.id} className="order-detail-item">
                    <span>{oi.name}</span>
                    <span>x{oi.quantity}</span>
                    <span>{formatPrice(oi.price * oi.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
