export function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'N/A';
  return `$${price.toFixed(2)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Beverages: '#1565C0',
  Appetizers: '#EF6C00',
  'Main Course': '#C62828',
  Desserts: '#6A1B9A',
  Sides: '#2E7D32',
  Specials: '#AD1457',
};

export function categoryColor(category: string | null | undefined): string {
  if (!category) return '#78909C';
  return CATEGORY_COLORS[category] || '#78909C';
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Beverages: '\u2615',
  Appetizers: '\uD83E\uDD57',
  'Main Course': '\uD83C\uDF5D',
  Desserts: '\uD83C\uDF70',
  Sides: '\uD83E\uDD6C',
  Specials: '\u2B50',
};

export function categoryEmoji(category: string | null | undefined): string {
  if (!category) return '\uD83C\uDF7D';
  return CATEGORY_EMOJIS[category] || '\uD83C\uDF7D';
}

export const CATEGORIES = [
  'Beverages',
  'Appetizers',
  'Main Course',
  'Desserts',
  'Sides',
  'Specials',
];
