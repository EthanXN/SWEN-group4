# FreshBite — Food & Beverage Ordering Frontend

<!--
  INTERNAL NOTES (Phase 0 — Backend Discovery Summary)

  Backend base URL: http://localhost:8080
  CORS: Allows http://localhost:4200 with credentials

  Auth: Session-based (HttpSession), NOT JWT
    POST /auth/login   { username, password } -> { username, role, message }
    POST /auth/logout   -> { message }
    GET  /auth/status   -> { username, role } | 401

  Items:
    GET    /items            -> Item[]
    GET    /items/{id}       -> Item
    GET    /items/search?query=  -> Item[]
    POST   /items            -> Item (OWNER only)
    PUT    /items/{id}       -> Item (OWNER only)
    DELETE /items/{id}       -> { message } (OWNER only)

  Collection (Basket):
    GET    /collection            -> Item[] (HELPER only)
    POST   /collection/{itemId}   -> { message, collection } (HELPER only)
    DELETE /collection/{itemId}   -> { message, collection } (HELPER only)
    POST   /collection/commit     -> { message, committedItems, collection } (HELPER only)

  Entities:
    User: id, username, password, role (OWNER|HELPER), collection (ManyToMany Item)
    Item: id, name, description, price, available, category

  Roles:
    - username "admin" -> OWNER
    - all others -> HELPER

  Constraints:
    - CORS origin: http://localhost:4200
    - Session timeout: 30 minutes
    - Login auto-creates new users
    - Error responses use { "error": "..." } shape
    - 401 = not logged in, 403 = wrong role, 404 = not found
-->

## Tech Stack

- React 18 + TypeScript
- Vite 6 (dev server + build)
- React Router v6
- No UI framework — lightweight custom CSS

## Prerequisites

- Node.js 18+ and npm
- Backend running at `http://localhost:8080` (Spring Boot + MariaDB via XAMPP)

## Quick Start

```bash
# 1. Start the backend
cd ../backend
./mvnw spring-boot:run

# 2. Install frontend deps (first time only)
cd ../frontend
npm install

# 3. Start dev server
npm run dev
```

The app opens at **http://localhost:4200**.

## Environment Variables

Copy `.env.example` to `.env` if needed. By default, the Vite dev server proxies API requests to `http://localhost:8080`, so no env config is required for local development.

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | _(empty)_ | Set only if NOT using the dev proxy (e.g., production) |

## Test Accounts

| Username | Password | Role |
|----------|----------|------|
| `admin` | _(empty)_ | OWNER — manage catalog |
| `alice` | `password123` | HELPER — browse & order |
| _any new name_ | _your choice_ | HELPER (auto-created on first login) |

> **Note:** The backend auto-creates accounts on first login. Only "admin" gets the OWNER role.

## Project Structure

```
frontend/
  src/
    api/          API client, endpoint functions, TypeScript types
    auth/         AuthContext provider, ProtectedRoute guard
    context/      CartContext, ToastContext (global state)
    pages/        Route-level page components
    components/   Reusable UI components
    styles/       CSS variables (brand) + global styles
    utils/        Formatting helpers
```

## Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Home / Landing | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/menu` | Menu catalog (search, filter, browse) | Authenticated |
| `/menu/:id` | Item details | Authenticated |
| `/cart` | Shopping cart | HELPER |
| `/checkout` | Checkout flow | HELPER |
| `/orders` | Order history | HELPER |
| `/admin` | Admin dashboard (item management) | OWNER |
| `/admin/items/new` | Create item form | OWNER |
| `/admin/items/:id/edit` | Edit item form | OWNER |
| `/unauthorized` | 403 page | Any |
| `*` | 404 page | Any |

## Security Notes

- **Session storage:** Auth state is maintained via HTTP-only session cookies managed by the backend. The frontend sends `credentials: 'include'` on every request.
- **No tokens in localStorage:** Unlike JWT approaches, session cookies are managed by the browser and are not accessible to JavaScript, reducing XSS attack surface.
- **Role enforcement:** Route guards on the frontend prevent navigation, but the backend independently enforces role checks on every API call.

## Order History

Order history is stored in `localStorage` because the backend's `/collection/commit` endpoint clears the basket without persisting order records. In a production system, orders would be stored server-side.

## E2E Testing Checklist

- [ ] Register a new account and verify redirect to menu
- [ ] Login with "admin" / empty password and verify OWNER dashboard access
- [ ] Login with "alice" / "password123" and verify HELPER menu access
- [ ] Browse menu, use search bar, filter by category
- [ ] View item details page
- [ ] Add items to cart, verify cart badge updates
- [ ] Adjust quantities in cart
- [ ] Remove items from cart
- [ ] Complete checkout flow (Review -> Payment -> Confirm)
- [ ] View order in order history
- [ ] As OWNER: create, edit, toggle availability, delete items
- [ ] Verify 401 redirect to login when session expires
- [ ] Verify 403 page when HELPER tries /admin
- [ ] Verify 404 page for unknown routes
- [ ] Test responsive layout on mobile viewport

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # preview production build locally
```
