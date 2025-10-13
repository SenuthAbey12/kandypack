# Customer Order Flow (Place → Created → Visible)

This workflow describes the end-to-end path from the moment a customer clicks “Place New Order” to the order being created in the backend and shown on the Customer Page, aligned with the current code and routes in this repository.

- Frontend: React app under `src/` with axios services in `src/services/api.js`.
- Backend: Express API under `backend/`, orders routes in `backend/routes/orders.js`, mounted under `/api/orders` with JWT protection.
- Auth: JWT via `backend/routes/auth.js` and middleware in `backend/middleware/auth.js`.

## High-level sequence

1) Customer clicks “Place New Order” on the Customer Page → navigates to `/products`.
2) Customer selects items and enters destination details.
3) Frontend posts to `POST /api/orders` with `{ destination_city, destination_address, items[] }`.
4) Backend validates, creates the order + items, updates stock, responds 201 with order payload.
5) Frontend returns to the Customer Page; it fetches `GET /api/orders`.
6) The newly created order appears in Dashboard and Current Orders.

---

## Frontend journey

### 1) Entry point: Customer Page → Place New Order

- File: `src/pages/Portal/CustomerPage.js`
- Control: the “Place New Order” buttons call `navigate('/products')`.

What `/products` should provide:
- Product catalog for selecting `{ product_id, quantity }`.
- Form fields for destination: `destination_city`, `destination_address`.
- A summary (cart) and a Submit/Place Order action that calls the Orders API.

### 2) API call for creating the order

- Service file: `src/services/api.js`
- Method: `ordersAPI.create(orderData)` → `POST /api/orders`

Expected request body:
- `destination_city` (string, required)
- `destination_address` (string, required)
- `items` (array, required): each `{ product_id, quantity, price }`

Success response (201):
- `{ message, order: { ...createdOrder, items: [...] } }`

### 3) After success (UX)

- Show a confirmation/toast.
- Navigate back to the Customer Page (`/portal/customer` or your configured route).
- Customer Page automatically fetches latest orders and displays the new one.

---

## Backend journey

### Mount and protection

- File: `backend/server.js`
- Mount: `app.use('/api/orders', authenticateToken, orderRoutes)`
- All order routes require a valid JWT (customer role enforced per-route).

### Create order endpoint (current implementation)

- File: `backend/routes/orders.js`
- Endpoint: `POST /api/orders` (requires `requireCustomer`)

Server-side flow:
1) Validate body fields: destination + non-empty items array.
2) Generate `order_id`.
3) For each item, fetch product and validate stock; accumulate weight/volume totals.
4) Insert into `orders` with `(order_id, customer_id, order_date, destination_city, destination_address, total_weight, total_volume, order_status='Pending')`.
5) Insert each item into `order_item (order_item_id, order_id, product_id, quantity, price)`; decrement product stock.
6) Return 201 with the created order and its items.

### List orders for Customer Page

- Endpoint: `GET /api/orders` (requires `requireCustomer`)
- Returns paginated list of customer orders with `item_count` and `total_amount`.

The Customer Page (`CustomerPage.js`) consumes this endpoint, normalizes status to UI labels, and infers progress for the progress bar.

---

## Data shapes

### Create order example (request)

```json
{
  "destination_city": "Colombo",
  "destination_address": "123 Galle Rd, Colombo 03",
  "items": [
    { "product_id": "P001", "quantity": 10, "price": 600.00 },
    { "product_id": "P003", "quantity": 5,  "price": 1200.00 }
  ]
}
```

### Create order example (response)

```json
{
  "message": "Order created successfully",
  "order": {
    "order_id": "ORD_...",
    "customer_id": "CUS001",
    "order_date": "2025-10-13T10:22:00.000Z",
    "destination_city": "Colombo",
    "destination_address": "123 Galle Rd, Colombo 03",
    "order_status": "Pending",
    "items": [
      { "order_item_id": "OI_...", "product_id": "P001", "quantity": 10, "price": 600.00, "product_name": "Detergent Box" }
    ]
  }
}
```

### List orders example (response)

```json
{
  "orders": [
    {
      "order_id": "ORD_...",
      "customer_id": "CUS001",
      "order_date": "2025-10-13T10:22:00.000Z",
      "order_status": "Pending",
      "item_count": 2,
      "total_amount": 9000.0
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1, "pages": 1 }
}
```

---

## Customer Page loading and display

- File: `src/pages/Portal/CustomerPage.js`
- Fetches `ordersAPI.getAll({ page, limit })` on mount.
- Maps backend fields to UI shape and normalizes statuses:
  - `pending/confirmed → Processing`, `scheduled → Scheduled`, `in_transit → In Transit`, `delivered → Delivered`, `cancelled → Cancelled`.
- Shows new orders in Dashboard and Current Orders automatically.
- Includes loading, error, and empty states.

---

## Error handling

Frontend:
- Validate destination fields and item quantities before submit.
- Display backend errors (e.g., insufficient stock) without losing form.

Backend:
- 400 for missing fields or stock issues.
- 401/403 for missing/invalid tokens.
- 500 for server errors.

---

## Schema alignment notes (important)

There are differences between the advanced SQL scripts and the current route code:

- Routes reference:
  - `orders.destination_city`, `orders.destination_address`, `orders.order_status`, `orders.total_weight`, `orders.total_volume`.
  - `order_item.price` (per-item unit price at time of order).
  - `product.weight_per_item`, `product.volume_per_item`.

- Advanced scripts frequently use:
  - `orders.status` (instead of `order_status`), possibly no destination fields (derived via `v_orders_enriched`).
  - `order_item.unit_price` or totals via `v_order_totals`.
  - `product.space_consumption` (instead of weight/volume split).

Choose one alignment strategy:

1) Match the route code: initialize DB with `backend/scripts/setup-database.js` (fields as routes expect).
2) Refactor the routes to the advanced schema: update column names (`status` vs `order_status`), compute space via `space_consumption`, use `unit_price`, and adjust SELECTs to use views like `v_order_totals` and `v_orders_enriched`.

---

## Acceptance criteria

- Clicking “Place New Order” routes to `/products`.
- Customer selects valid items and sets destination fields.
- `POST /api/orders` returns 201 with the created order.
- Returning to Customer Page shows the new order without manual refresh.
- Errors are surfaced clearly (validation, stock, auth).

---

## Enhancements & next steps

- Implement the `/products` cart + checkout component that calls `ordersAPI.create`.
- After creation, route back to Customer Page with a success toast.
- Add pagination controls to Order History (using backend `pagination`).
- Order details drawer via `GET /api/orders/:id` (show line items and totals).
- Tracking: integrate `GET /api/orders/:id/tracking` for live timelines.
