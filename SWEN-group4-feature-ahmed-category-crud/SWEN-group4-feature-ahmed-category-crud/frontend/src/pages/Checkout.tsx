import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, categoryEmoji } from '../utils/helpers';
import type { LocalOrder } from '../api/types';

type Step = 'review' | 'payment' | 'confirm';

export default function Checkout() {
  const { items, totalPrice, checkout } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('review');
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<LocalOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + tax;

  const handleSubmit = async () => {
    setSubmitting(true);
    const order = await checkout();
    setSubmitting(false);
    if (order) {
      setCompletedOrder(order);
      setStep('confirm');
    }
  };

  if (items.length === 0 && step !== 'confirm') {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <div className="empty-state">
          <h3>Nothing to check out</h3>
          <p>Your cart is empty.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="progress-bar">
        {(['review', 'payment', 'confirm'] as Step[]).map((s, i) => (
          <div key={s} className={`progress-step ${step === s ? 'active' : ''} ${(['review', 'payment', 'confirm'].indexOf(step) > i) ? 'done' : ''}`}>
            <div className="step-circle">{i + 1}</div>
            <span>{s === 'review' ? 'Review' : s === 'payment' ? 'Payment' : 'Confirmation'}</span>
          </div>
        ))}
      </div>

      {step === 'review' && (
        <div className="checkout-section">
          <h2>Review Your Order</h2>
          <div className="checkout-items">
            {items.map(({ item, quantity }) => (
              <div key={item.id} className="checkout-item">
                <span className="checkout-emoji">{categoryEmoji(item.category)}</span>
                <div className="checkout-item-info">
                  <strong>{item.name}</strong>
                  <span>Qty: {quantity}</span>
                </div>
                <span>{formatPrice((item.price ?? 0) * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-totals">
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="summary-row"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
            <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => setStep('payment')}>
            Continue to Payment
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div className="checkout-section">
          <h2>Payment Method</h2>
          <p className="demo-notice">Demo Mode &mdash; no actual charges will be made.</p>

          <div className="payment-options">
            {[
              { id: 'card', label: 'Credit / Debit Card', icon: '\uD83D\uDCB3' },
              { id: 'wallet', label: 'Digital Wallet', icon: '\uD83D\uDCF1' },
              { id: 'cash', label: 'Pay on Pickup', icon: '\uD83D\uDCB5' },
            ].map((pm) => (
              <label key={pm.id} className={`payment-option ${paymentMethod === pm.id ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value={pm.id}
                  checked={paymentMethod === pm.id}
                  onChange={() => setPaymentMethod(pm.id)}
                />
                <span className="payment-icon">{pm.icon}</span>
                <span>{pm.label}</span>
              </label>
            ))}
          </div>

          {paymentMethod === 'card' && (
            <div className="card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    e.target.value = digits.replace(/(.{4})/g, '$1 ').trim();
                  }}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    maxLength={5}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      e.target.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2, 4) : digits;
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    maxLength={4}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '');
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="checkout-nav">
            <button className="btn btn-outline" onClick={() => setStep('review')}>Back</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Placing Order...' : `Place Order \u2014 ${formatPrice(grandTotal)}`}
            </button>
          </div>
        </div>
      )}

      {step === 'confirm' && completedOrder && (
        <div className="checkout-section confirmation">
          <div className="confirm-icon">&#10003;</div>
          <h2>Order Placed!</h2>
          <p>Your order has been submitted successfully.</p>

          <div className="order-receipt">
            <div className="receipt-header">
              <span>Order #{completedOrder.id.slice(0, 8).toUpperCase()}</span>
              <span>{new Date(completedOrder.submittedAt).toLocaleString()}</span>
            </div>
            {completedOrder.items.map((oi) => (
              <div key={oi.id} className="receipt-item">
                <span>{oi.name} x{oi.quantity}</span>
                <span>{formatPrice(oi.price * oi.quantity)}</span>
              </div>
            ))}
            <div className="receipt-total">
              <strong>Total</strong>
              <strong>{formatPrice(completedOrder.totalCost * 1.08)}</strong>
            </div>
          </div>

          <div className="confirm-actions">
            <Link to="/orders" className="btn btn-primary">View Orders</Link>
            <Link to="/menu" className="btn btn-outline">Order More</Link>
          </div>
        </div>
      )}
    </div>
  );
}
