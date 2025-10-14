# Customer Page Module

This folder contains all customer-related pages and components for the KandyPack customer portal.

## Structure

```
Customer_Page/
├── CustomerPage.js          # Main customer dashboard component
├── index.js                 # Exports for easy importing
└── Support/                 # Customer support related pages
    ├── Chat.js             # Live chat support
    ├── PackagingHelp.js    # Packaging assistance
    ├── Returns.js          # Return request handling
    └── TrackOrder.js       # Order tracking interface
```

## Usage

### Import the main customer page:
```javascript
import { CustomerPage } from './pages/Portal/Customer_Page';
```

### Import specific support components:
```javascript
import { Chat, PackagingHelp, Returns, TrackOrder } from './pages/Portal/Customer_Page';
```

## Features

- **CustomerPage.js**: Comprehensive customer dashboard with order management, tracking, profile settings, and quick actions
- **Support/**: Collection of customer service tools including live chat, packaging help, returns processing, and order tracking

## Routes

- `/customer` - Main customer dashboard
- `/support/chat` - Customer service chat
- `/support/returns` - Returns and refunds
- `/support/track` - Order tracking
- `/support/packaging-help` - Packaging assistance

All routes are protected and require customer authentication.