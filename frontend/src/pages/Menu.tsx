import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { itemsApi } from '../api/items';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { CATEGORIES } from '../utils/helpers';
import type { Item } from '../api/types';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const availableOnly = searchParams.get('available') === 'true';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = searchQuery
          ? await itemsApi.search(searchQuery)
          : await itemsApi.getAll();
        setItems(data);
      } catch {
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchQuery]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory) {
      result = result.filter((i) => i.category === selectedCategory);
    }
    if (availableOnly) {
      result = result.filter((i) => i.available);
    }
    return result;
  }, [items, selectedCategory, availableOnly]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params, { replace: true });
  };

  const existingCategories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category).filter(Boolean));
    return CATEGORIES.filter((c) => cats.has(c));
  }, [items]);

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover delicious meals, snacks, and beverages</p>
      </div>

      <div className="menu-controls">
        <div className="search-bar">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => updateParam('q', e.target.value)}
            aria-label="Search menu"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => updateParam('q', '')} aria-label="Clear search">
              &times;
            </button>
          )}
        </div>

        <div className="filter-row">
          <div className="category-chips">
            <button
              className={`chip ${!selectedCategory ? 'chip-active' : ''}`}
              onClick={() => updateParam('category', '')}
            >
              All
            </button>
            {existingCategories.map((cat) => (
              <button
                key={cat}
                className={`chip ${selectedCategory === cat ? 'chip-active' : ''}`}
                onClick={() => updateParam('category', selectedCategory === cat ? '' : cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="toggle-label">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => updateParam('available', e.target.checked ? 'true' : '')}
            />
            <span>Available only</span>
          </label>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading menu..." />
      ) : error ? (
        <EmptyState icon="!" title="Error" description={error} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon="\uD83D\uDD0D"
          title="No items found"
          description={searchQuery ? `No results for "${searchQuery}"` : 'No items match your filters'}
          action={
            <button className="btn btn-outline" onClick={() => setSearchParams({})}>
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
