# API Endpoints — Food & Beverage Ordering System

Base: `/api`
Auth: JWT Bearer token in `Authorization: Bearer <token>`

## Authentication & Authorization
- POST `/auth/register`
  - Body: { username, email, password, role }  // role = HELPER or OWNER
  - Returns: 201 Created

- POST `/auth/login`
  - Body: { usernameOrEmail, password }
  - Returns: 200 OK { token, expiresInSeconds, role }

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
- Helper: allowed `/items/**`, `/basket/**`, `/orders/**`; forbidden `/admin/**` (403)
- Owner: allowed `/admin/**`, `/items/**`; forbidden `/basket/**`, `/orders/**` (403)
