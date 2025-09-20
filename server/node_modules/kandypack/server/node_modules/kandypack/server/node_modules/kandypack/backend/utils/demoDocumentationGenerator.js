const fs = require('fs').promises;
const path = require('path');

/**
 * Demo database documentation generator 
 * Works even when MySQL is not connected
 */
class DemoDocumentationGenerator {
  constructor() {
    this.docPath = path.join(__dirname, '../../DATABASE_STRUCTURE.md');
  }

  // Simulated table data for demo
  getDemoTables() {
    return ['admin', 'customer', 'product', 'orders', 'order_item', 'train_shipments', 'truck_deliveries'];
  }

  getDemoTableStructure(tableName) {
    const structures = {
      admin: [
        { Field: 'admin_id', Type: 'varchar(8)', Null: 'NO', Key: 'PRI', Default: null, Extra: '' },
        { Field: 'name', Type: 'varchar(100)', Null: 'NO', Key: '', Default: null, Extra: '' },
        { Field: 'password', Type: 'varchar(255)', Null: 'NO', Key: '', Default: null, Extra: '' }
      ],
      customer: [
        { Field: 'customer_id', Type: 'varchar(40)', Null: 'NO', Key: 'PRI', Default: null, Extra: '' },
        { Field: 'name', Type: 'varchar(100)', Null: 'NO', Key: '', Default: null, Extra: '' },
        { Field: 'phone_no', Type: 'varchar(15)', Null: 'YES', Key: '', Default: null, Extra: '' },
        { Field: 'city', Type: 'varchar(50)', Null: 'YES', Key: '', Default: null, Extra: '' },
        { Field: 'address', Type: 'varchar(200)', Null: 'YES', Key: '', Default: null, Extra: '' },
        { Field: 'user_name', Type: 'varchar(50)', Null: 'NO', Key: 'UNI', Default: null, Extra: '' },
        { Field: 'password', Type: 'varchar(255)', Null: 'NO', Key: '', Default: null, Extra: '' }
      ],
      product: [
        { Field: 'product_id', Type: 'varchar(40)', Null: 'NO', Key: 'PRI', Default: null, Extra: '' },
        { Field: 'product_name', Type: 'varchar(100)', Null: 'NO', Key: '', Default: null, Extra: '' },
        { Field: 'description', Type: 'text', Null: 'YES', Key: '', Default: null, Extra: '' },
        { Field: 'price', Type: 'decimal(10,2)', Null: 'NO', Key: '', Default: null, Extra: '' },
        { Field: 'weight_per_item', Type: 'decimal(8,2)', Null: 'NO', Key: '', Default: null, Extra: '' },
        { Field: 'volume_per_item', Type: 'decimal(8,2)', Null: 'NO', Key: '', Default: null, Extra: '' },
        { Field: 'category', Type: 'varchar(50)', Null: 'YES', Key: '', Default: null, Extra: '' },
        { Field: 'available_quantity', Type: 'int', Null: 'YES', Key: '', Default: '0', Extra: '' }
      ],
      orders: [
        { Field: 'order_id', Type: 'varchar(40)', Null: 'NO', Key: 'PRI', Default: null, Extra: '' },
        { Field: 'customer_id', Type: 'varchar(40)', Null: 'YES', Key: 'MUL', Default: null, Extra: '' },
        { Field: 'order_date', Type: 'datetime', Null: 'NO', Key: '', Default: null, Extra: '' },
        { Field: 'destination_city', Type: 'varchar(50)', Null: 'YES', Key: '', Default: null, Extra: '' },
        { Field: 'destination_address', Type: 'varchar(200)', Null: 'YES', Key: '', Default: null, Extra: '' },
        { Field: 'total_weight', Type: 'decimal(8,2)', Null: 'YES', Key: '', Default: null, Extra: '' },
        { Field: 'total_volume', Type: 'decimal(8,2)', Null: 'YES', Key: '', Default: null, Extra: '' },
        { Field: 'order_status', Type: "enum('Pending','Confirmed','In Transit','Delivered','Cancelled')", Null: 'YES', Key: '', Default: 'Pending', Extra: '' }
      ],
      order_item: [
        { Field: 'order_item_id', Type: 'varchar(40)', Null: 'NO', Key: 'PRI', Default: null, Extra: '' },
        { Field: 'order_id', Type: 'varchar(40)', Null: 'YES', Key: 'MUL', Default: null, Extra: '' },
        { Field: 'product_id', Type: 'varchar(40)', Null: 'YES', Key: 'MUL', Default: null, Extra: '' },
        { Field: 'quantity', Type: 'int', Null: 'NO', Key: '', Default: null, Extra: '' },
        { Field: 'price', Type: 'decimal(10,2)', Null: 'NO', Key: '', Default: null, Extra: '' }
      ]
    };
    return structures[tableName] || [];
  }

  getDemoSampleData(tableName) {
    const sampleData = {
      admin: [
        { admin_id: 'ADM001', name: 'System Administrator', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }
      ],
      customer: [
        { customer_id: 'CUST_001', name: 'John Doe', phone_no: '+1234567890', city: 'Colombo', address: '123 Main Street, Colombo 01, Western Province', user_name: 'johndoe', password: '$2a$10$eImiTXuWVxfM37uY4JANjeBYpJ4iE/e1u/9jHPW.9DvqFaBH6QkMq' },
        { customer_id: 'CUST_002', name: 'Jane Smith', phone_no: '+1987654321', city: 'Kandy', address: '456 Oak Avenue, Kandy Central, Central Province', user_name: 'janesmith', password: '$2a$10$XHT2kYhzYGqZr8vL4N3Q1eUH.jKq7Y2M3F8wVvZ9cX6D5pR7qL9Nm' },
        { customer_id: 'CUST_003', name: 'Mike Johnson', phone_no: '+1555123456', city: 'Galle', address: '789 Beach Road, Galle Fort, Southern Province', user_name: 'mikejohnson', password: '$2a$10$QAZ2wsx3edC4rfv5tgB6yhN7ujM8ik9ol0pP/qW.eR2tY6u7I8o0A' }
      ],
      product: [
        { product_id: 'PROD_001', product_name: 'Premium Electronics Package', description: 'High-quality electronics including smartphones, tablets, and accessories with warranty coverage', price: 299.99, weight_per_item: 2.5, volume_per_item: 0.02, category: 'Electronics', available_quantity: 50 },
        { product_id: 'PROD_002', product_name: 'Fashion Accessories Set', description: 'Trendy fashion accessories including jewelry, bags, and designer clothing items', price: 79.99, weight_per_item: 0.5, volume_per_item: 0.005, category: 'Fashion', available_quantity: 100 },
        { product_id: 'PROD_003', product_name: 'Home & Garden Essentials', description: 'Essential home goods including kitchen appliances, gardening tools, and home decor items', price: 149.99, weight_per_item: 5.0, volume_per_item: 0.1, category: 'Home & Garden', available_quantity: 25 },
        { product_id: 'PROD_004', product_name: 'Educational Books & Media', description: 'Comprehensive educational materials including textbooks, digital media, and learning resources', price: 29.99, weight_per_item: 0.8, volume_per_item: 0.003, category: 'Books', available_quantity: 75 },
        { product_id: 'PROD_005', product_name: 'Professional Sports Equipment', description: 'Quality sports gear including fitness equipment, outdoor gear, and professional sporting goods', price: 199.99, weight_per_item: 3.2, volume_per_item: 0.05, category: 'Sports', available_quantity: 30 }
      ],
      orders: [
        { order_id: 'ORD_001', customer_id: 'CUST_001', order_date: '2025-09-20 10:30:00', destination_city: 'Galle', destination_address: '789 Beach Road, Galle Fort, Southern Province, Sri Lanka', total_weight: 3.0, total_volume: 0.025, order_status: 'Pending' },
        { order_id: 'ORD_002', customer_id: 'CUST_002', order_date: '2025-09-19 14:15:30', destination_city: 'Matara', destination_address: '321 Temple Street, Matara Central, Southern Province, Sri Lanka', total_weight: 5.5, total_volume: 0.105, order_status: 'Confirmed' },
        { order_id: 'ORD_003', customer_id: 'CUST_003', order_date: '2025-09-18 09:45:15', destination_city: 'Kandy', destination_address: '654 Hill Street, Kandy Central, Central Province, Sri Lanka', total_weight: 0.8, total_volume: 0.003, order_status: 'In Transit' }
      ],
      order_item: [
        { order_item_id: 'OI_001', order_id: 'ORD_001', product_id: 'PROD_001', quantity: 1, price: 299.99 },
        { order_item_id: 'OI_002', order_id: 'ORD_002', product_id: 'PROD_003', quantity: 1, price: 149.99 },
        { order_item_id: 'OI_003', order_id: 'ORD_003', product_id: 'PROD_004', quantity: 1, price: 29.99 }
      ],
      train_shipments: [
        { shipment_id: 'SHIP_001', order_id: 'ORD_002', train_id: 'TR_001', departure_date: '2025-09-20', arrival_date: '2025-09-21' },
        { shipment_id: 'SHIP_002', order_id: 'ORD_003', train_id: 'TR_002', departure_date: '2025-09-19', arrival_date: '2025-09-20' }
      ],
      truck_deliveries: [
        { delivery_id: 'DEL_001', order_id: 'ORD_001', truck_id: 'TRK_001', delivery_date: '2025-09-21' },
        { delivery_id: 'DEL_002', order_id: 'ORD_003', truck_id: 'TRK_002', delivery_date: '2025-09-20' }
      ]
    };
    return sampleData[tableName] || [];
  }

  formatTableStructure(structure) {
    let markdown = '| Column | Type | Null | Key | Default | Extra |\n';
    markdown += '|--------|------|------|-----|---------|-------|\n';
    
    structure.forEach(col => {
      markdown += `| ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default || 'NULL'} | ${col.Extra} |\n`;
    });
    
    return markdown;
  }

  formatSampleData(data) {
    if (data.length === 0) return '*No data available*\n';
    
    const columns = Object.keys(data[0]);
    let markdown = '| ' + columns.join(' | ') + ' |\n';
    markdown += '|' + columns.map(() => '---').join('|') + '|\n';
    
    data.forEach(row => {
      const values = columns.map(col => {
        let value = row[col];
        if (value === null) return 'NULL';
        // Show full values without truncation
        return value;
      });
      markdown += '| ' + values.join(' | ') + ' |\n';
    });
    
    return markdown;
  }

  async generateDemoDocumentation() {
    const tables = this.getDemoTables();
    const timestamp = new Date().toLocaleString();
    
    let documentation = `# 📊 KandyPack Database Documentation

*Last Updated: ${timestamp}*
*Status: Demo Mode (MySQL Connection Error)*

## 🗄️ Database Overview

**Database Name:** kandypack  
**Total Tables:** ${tables.length}  
**Database Engine:** MySQL  
**Connection Status:** ❌ Disconnected (Demo Mode)

## 📋 Table Summary

`;

    // Add table summary with demo row counts
    const demoCounts = { admin: 1, customer: 3, product: 5, orders: 3, order_item: 3, train_shipments: 2, truck_deliveries: 2 };
    
    tables.forEach(tableName => {
      const count = demoCounts[tableName] || 0;
      documentation += `- **${tableName}**: ${count} records\n`;
    });

    documentation += '\n## 📊 Detailed Table Information\n\n';

    // Add detailed information for each table
    tables.forEach(tableName => {
      console.log(`📖 Documenting table: ${tableName}`);
      
      const structure = this.getDemoTableStructure(tableName);
      const sampleData = this.getDemoSampleData(tableName);
      const rowCount = demoCounts[tableName] || 0;

      documentation += `### 🏷️ ${tableName}\n\n`;
      documentation += `**Records:** ${rowCount}\n\n`;

      // Table structure
      documentation += '#### 📐 Table Structure\n\n';
      documentation += this.formatTableStructure(structure);
      documentation += '\n';

      // Sample data
      documentation += '#### 📄 Sample Data\n\n';
      documentation += this.formatSampleData(sampleData);
      documentation += '\n';

      documentation += '---\n\n';
    });

    documentation += this.generateUsageNotes();

    return documentation;
  }

  generateUsageNotes() {
    return `## 📝 Usage Notes

### 🔐 Authentication Tables
- **admin**: Stores administrator accounts with hashed passwords
- **customer**: Stores customer accounts with profile information

### 🛍️ Product Management
- **product**: Catalog of available products with pricing and inventory
- Products have weight and volume for shipping calculations

### 📦 Order System
- **orders**: Main order records with customer and delivery information
- **order_item**: Individual items within each order
- Order status tracking: Pending → Confirmed → In Transit → Delivered

### 🚚 Logistics Management
- **train_shipments**: Rail transport tracking
- **truck_deliveries**: Road transport tracking

### 🔧 Data Integrity
- Foreign key constraints ensure referential integrity
- Customer deletion would affect related orders (cascade handling needed)
- Product deletion requires checking for existing order items

### 📊 Performance Considerations
- Indexes on primary keys and foreign keys
- Consider adding indexes on frequently queried columns:
  - customer.user_name (for login)
  - orders.order_status (for status filtering)
  - product.category (for product browsing)

### ⚠️ Connection Status
- **Current Status**: Demo Mode
- **Issue**: MySQL connection failed
- **Resolution**: Check MySQL service, credentials, and network connectivity
- **Action Required**: Fix database connection to enable live documentation

---

*This documentation is automatically generated and updated when database changes occur.*
*Currently running in demo mode due to database connection issues.*
`;
  }

  async saveDocumentation() {
    try {
      const documentation = await this.generateDemoDocumentation();
      await fs.writeFile(this.docPath, documentation, 'utf8');
      console.log('✅ Database documentation (demo mode) saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving database documentation:', error);
      return false;
    }
  }
}

module.exports = DemoDocumentationGenerator;