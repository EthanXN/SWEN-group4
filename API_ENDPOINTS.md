# API Endpoints — Food & Beverage Ordering System

Base: `http://localhost:8080`
Auth: Session-based (HTTP session cookies), send `credentials: 'include'` with every request

## Authentication & Authorization
- POST `/auth/register`
  - Body: { username, password }
  - Returns: 201 { message: "Registration successful" }

- POST `/auth/login`
  - Body: { username, password }
  - Returns: 200 { username, role, message: "Login successful" }

- POST `/auth/logout`
  - Returns: 200 { message: "Logout successful" }

- GET `/auth/status`
  - Returns: 200 { username, role } or 401 if not logged in

## Helper: Catalog Browsing
- GET `/items`
  - Query params (optional): `q`, `categoryId`, `availableOnly`
  - Returns: list of items

- GET `/items/{id}`
  - Returns: item details

## Helper: Basket (Persisted)
- GET `/basket`
  - Returns: basket + basket items + total

- POST `/basket/items`
  - Body: { itemId, quantity }
  - Returns: updated basket

- PUT `/basket/items/{basketItemId}`
  - Body: { quantity }
  - Returns: updated basket

- DELETE `/basket/items/{basketItemId}`
  - Returns: updated basket

## Helper: Orders
- POST `/orders/submit`
  - Converts current basket into an Order, saves Order + OrderItems
  - Returns: { orderId, submittedAt, totalCost }

- GET `/orders`
  - Returns: helper’s orders

- GET `/orders/{orderId}`
  - Returns: order + items

## Owner: Catalog Management (Owner Only)
- GET `/admin/items`
  - Returns: all items (including unavailable)

- POST `/admin/items`
  - Body: { name, description, price, categoryId, available }
  - Returns: created item

- PUT `/admin/items/{id}`
  - Body: { name, description, price, categoryId, available }
  - Returns: updated item

- DELETE `/admin/items/{id}`
  - Recommended behavior: soft delete -> set available=false
  - Returns: 204 No Content

## Access Control Rules
- Guest: only `/auth/**`
- Helper: allowed `/items/**`, `/collection/**`; forbidden if not logged in (401)
- Owner: allowed `/items/**` (POST/PUT/DELETE); forbidden `/collection/**` (403)
