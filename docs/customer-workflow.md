# Customer Page Workflow

This document describes the end-to-end workflow for the Customer Portal page in the Kandypack application. It covers user journeys, data model, UI flows, backend integration plan, and operational considerations.

## 1) Overview
- Frontend: React SPA (React Router), context-based auth (`AuthContext`), axios for API (planned).
- Backend: Express + MySQL, JWT auth (`backend/routes/auth.js`), DB access via `mysql2/promise` wrapper (`backend/config/database.js`).
- Namespace: Customer portal mounted at `/customer` on the frontend, backend routes mounted under `/api/*`.
- Current tabs/sections: Dashboard, Current Orders, Order History, Track Delivery, Support.
- Persistence (current): localStorage per-user key; (future): backend APIs.

## 2) User Journeys (Happy Paths)

### 2.1 Dashboard
- Purpose: Snapshot of key stats + quick actions.
- Inputs: `orders[]` (from localStorage/API), derived stats.
- UI:
  - Stats cards: Total Orders, Active Shipments, Rail Deliveries, Avg. Days.
  - Quick Actions: Place New Order (→ `/products`), Track Shipment (modal), Get Support (switch tab).
  - Recent Orders preview (top 3).
- Actions:
  - Place New Order → navigate `/products`.
  - Track Shipment → open tracking modal.
  - Get Support → set active tab to `support`.
- Empty state: No orders → CTA to start ordering.

### 2.2 Current Orders
- Purpose: Monitor in-progress orders.
- Filter: status in `['Processing','In Transit','Scheduled']`.
- UI per order (OrderCard): ID, date, status badge, transport mode, route, items preview, progress bar, ETA/actual, assignments (train/truck).
- Simulation: Background interval advances progress and status (Processing → In Transit → Delivered).

### 2.3 Order History
- Purpose: Review completed orders.
- Filter: status === `Delivered`.
- UI: Same OrderCard layout; no progress emphasis.

### 2.4 Track Delivery
- Purpose: Look up shipment by Order ID.
- Inputs: trackingId string.
- Behavior:
  - If found: timeline (Placed → Processing → Rail → Last-Mile → Delivered) + current status.
  - If not found: friendly error state.
- Entry points: Quick Action button (modal) and Track Delivery tab.

### 2.5 Support
- Purpose: Support info and FAQs.
- Content: Contact details (phone, email, hours) + FAQs (lead time, space consumption, last-mile).

## 3) Data Model

### 3.1 Order
```ts
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
}

interface AssignmentTrain { trip_id: string; departure: string; }
interface AssignmentTruck { truck_id: string; driver: string; }

type OrderStatus = 'Processing' | 'In Transit' | 'Scheduled' | 'Delivered' | 'Cancelled';

type TransportMode = 'Rail' | 'Road';

interface Order {
  id: string;                     // e.g., KP-2024-001
  customer_id: string;
  status: OrderStatus;
  transport_mode: TransportMode;
  route: string;                  // e.g., "Kandy → Colombo"
  items: OrderItem[];
  total_space: number;
  total_value: number;
  order_date: string;             // YYYY-MM-DD
  estimated_delivery: string;     // YYYY-MM-DD
  actual_delivery: string | null; // YYYY-MM-DD
  progress: number;               // 0..100
  delivery_city: string;
  train_assignment?: AssignmentTrain | null;
  truck_assignment?: AssignmentTruck | null;
  customer_notes?: string;
}
```

### 3.2 Derived Stats
- totalOrders: `orders.length`
- activeShipments: count of status in `['Processing','In Transit','Scheduled']`
- railDeliveries: count where `transport_mode === 'Rail'`
- averageDeliveryTime: avg days between `order_date` and `actual_delivery` for delivered orders
- totalOrderValue: sum of `total_value` across orders

## 4) State, Persistence, and Transitions
- Source of truth: component state backed by localStorage. Key: `kandypack_orders:{user.id|email|guest}`.
- Load on mount, save on change (try/catch guarded).
- Simulation: 10s interval: Processing +5%, In Transit +10%; promote statuses; set `actual_delivery` at 100%.
- Future: replace with backend polling or SSE for real-time updates.

## 5) Backend Integration Plan (Proposed)

### 5.1 Endpoints
- GET `/api/orders?scope=current|history` → list orders
- GET `/api/orders/:id` → order details
- POST `/api/orders` → create order (if initiated from portal later)
- GET `/api/tracking/:id` → tracking snapshot/timeline

### 5.2 Auth and Headers
- Auth: JWT in `Authorization: Bearer <token>`.
- Content: `application/json`.

### 5.3 Responses & Errors
- 200 OK: payloads as per `Order` and arrays
- 401 Unauthorized: missing/invalid token
- 404 Not Found: unknown order id
- 500 Server Error: message for user + log server-side

### 5.4 Pagination and Filtering
- History: support `?page` & `?limit`; optional `?from` `?to` date filters.

## 6) UX Validations and Errors
- Tracking: require non-empty ID; show not-found message when applicable.
- Current Orders: empty state guidance.
- Network (future): loading indicators, retry, and non-blocking toasts.
- Accessibility: focus trap in modal; keyboard support; ARIA labels.

## 7) Edge Cases
- No orders at all → dashboard and lists show empty states with clear CTAs.
- Very large history → paginate/virtualize list.
- Orders missing assignment info → display placeholders (e.g., "Awaiting truck assignment").
- Time skew (client vs server) → rely on server timestamps when API-connected.

## 8) Implementation Notes
- Tabs controlled via `activeTab` state: 'dashboard' | 'current' | 'history' | 'tracking' | 'support'.
- Quick action buttons should prefer navigation or modal toggles; avoid complex logic inline.
- Keep styles consistent with the app theme (purple gradient). Consider extracting to CSS module later.

## 9) Next Steps
- Replace localStorage with real API calls.
- Add loading and error handling UI components.
- Add responsive sidebar collapse on small screens.
- If needed, reintroduce an Analytics tab as a separate feature with dedicated endpoints.
