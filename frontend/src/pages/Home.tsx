import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const FEATURED_CATEGORIES = [
  { name: 'Beverages', emoji: '\u2615', desc: 'Coffee, tea, juices & more' },
  { name: 'Main Course', emoji: '\uD83C\uDF5D', desc: 'Hearty meals to satisfy' },
  { name: 'Desserts', emoji: '\uD83C\uDF70', desc: 'Sweet treats & pastries' },
  { name: 'Appetizers', emoji: '\uD83E\uDD57', desc: 'Light bites to start' },
];

export default function Home() {
  const { isLoggedIn, role } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Fresh Food,<br />Delivered Fast</h1>
          <p>Browse our curated menu of delicious meals, snacks, and beverages. Order in just a few taps.</p>
          {isLoggedIn && role === 'HELPER' ? (
            <Link to="/menu" className="btn btn-primary btn-lg">Browse Menu</Link>
          ) : isLoggedIn && role === 'OWNER' ? (
            <Link to="/admin" className="btn btn-primary btn-lg">Go to Dashboard</Link>
          ) : (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
            </div>
          )}
        </div>
        <div className="hero-visual">
          <img src="/dashboard.png" alt="FreshBite dashboard preview" className="hero-image" />
        </div>
      </section>

      <section className="section categories-section">
        <h2 className="section-title">Explore Categories</h2>
        <div className="category-grid">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={isLoggedIn ? `/menu?category=${encodeURIComponent(cat.name)}` : '/login'}
              className="category-card"
            >
              <span className="category-emoji">{cat.emoji}</span>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Browse</h3>
            <p>Explore our menu with search and category filters</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Add to Cart</h3>
            <p>Pick your favorites and customize quantities</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Order</h3>
            <p>Review and submit your order in seconds</p>
          </div>
        </div>
      </section>
    </div>
  );
}
