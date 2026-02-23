# Domain Analysis — Food & Beverage Ordering System

## Core Entities
- **User**: Authenticated account with a role (HELPER or OWNER).
- **Item**: Food/beverage catalog entry with name, description, price, availability, and category.
- **Category**: Groups items (e.g., Beverages, Mains, Desserts).
- **Basket**: One active basket per Helper, saved persistently.
- **BasketItem**: Line item in a basket (item + quantity + unitPrice snapshot).
- **Order**: Finalized basket submission stored permanently.
- **OrderItem**: Line item in an order (item + quantity + unitPrice snapshot + itemName snapshot).

## Relationships (with multiplicities)
- A **User (Helper)** has **exactly 1 Basket**: `User 1 — 1 Basket`
- A **Basket** contains **0..*** **BasketItems** (composition): `Basket 1 *— 0..* BasketItem`
- An **Item** can appear in **0..*** **BasketItems**: `Item 1 — 0..* BasketItem`
- A **User (Helper)** can create **0..*** **Orders**: `User 1 — 0..* Order`
- An **Order** contains **1..*** **OrderItems** (composition): `Order 1 *— 1..* OrderItem`
- An **Item** can appear in **0..*** **OrderItems**: `Item 1 — 0..* OrderItem`
- A **Category** contains **0..*** **Items**: `Category 1 — 0..* Item`

## Key Business Rules (FRD alignment)
- Guests can only access registration/login pages and auth endpoints.
- Helper can browse/search/filter items; cannot add/edit/delete catalog items.
- Owner can add/edit/delete items; cannot place orders or manage baskets.
- Unavailable items are visible but cannot be added to basket.
- Basket is persisted after every modification (add/update/remove).
- Submitting basket creates an Order with timestamp; basket can be cleared after submission.
