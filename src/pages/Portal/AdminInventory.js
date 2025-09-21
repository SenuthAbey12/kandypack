import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

const AdminInventory = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [inventory, setInventory] = useState([
    { id: 1, product: 'Electronics', category: 'Consumer Goods', stock: 1250, reorderLevel: 200, location: 'Warehouse A-B2', lastUpdated: '2024-01-22', cost: 125000, supplier: 'TechCorp Ltd' },
    { id: 2, product: 'Fashion Items', category: 'Apparel', stock: 3400, reorderLevel: 500, location: 'Warehouse A-C1', lastUpdated: '2024-01-22', cost: 68000, supplier: 'Fashion Hub' },
    { id: 3, product: 'Home & Garden', category: 'Household', stock: 890, reorderLevel: 150, location: 'Warehouse B-A3', lastUpdated: '2024-01-21', cost: 44500, supplier: 'Home Solutions' },
    { id: 4, product: 'Industrial Parts', category: 'Industrial', stock: 145, reorderLevel: 100, location: 'Warehouse C-D1', lastUpdated: '2024-01-22', cost: 87000, supplier: 'Industrial Corp' },
    { id: 5, product: 'Medical Supplies', category: 'Healthcare', stock: 67, reorderLevel: 80, location: 'Warehouse A-A1', lastUpdated: '2024-01-21', cost: 32000, supplier: 'MedSupply Co' },
    { id: 6, product: 'Automotive Parts', category: 'Automotive', stock: 456, reorderLevel: 100, location: 'Warehouse B-C2', lastUpdated: '2024-01-20', cost: 91200, supplier: 'AutoParts Inc' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);

  const stats = {
    inventoryTurnover: 8.2,
    totalValue: inventory.reduce((sum, item) => sum + item.cost, 0),
    lowStockItems: inventory.filter(item => item.stock <= item.reorderLevel).length,
    totalItems: inventory.reduce((sum, item) => sum + item.stock, 0)
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'low-stock' && item.stock <= item.reorderLevel) ||
                         (filterStatus === 'in-stock' && item.stock > item.reorderLevel);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(inventory.map(item => item.category))];

  // Export inventory to CSV
  const exportInventoryToCSV = () => {
    try {
      const headers = ['Product', 'Category', 'Stock', 'Reorder Level', 'Location', 'Cost (Rs.)', 'Supplier', 'Last Updated'];
      const csvContent = [
        headers.join(','),
        ...filteredInventory.map(item => [
          `"${item.product}"`,
          `"${item.category}"`,
          item.stock,
          item.reorderLevel,
          `"${item.location}"`,
          item.cost.toLocaleString(),
          `"${item.supplier}"`,
          item.lastUpdated
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `kandypack_inventory_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success feedback
      alert('Inventory exported successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const renderInventoryStats = () => (
    <div className="inventory-stats">
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">📦</div>
          <div className="stat-trend up">↗️ +5%</div>
        </div>
        <div className="stat-body">
          <h3>{stats.totalItems.toLocaleString()}</h3>
          <p>Total Items</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">⚠️</div>
          <div className="stat-trend down">↘️ -2</div>
        </div>
        <div className="stat-body">
          <h3>{stats.lowStockItems}</h3>
          <p>Low Stock Alerts</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">💰</div>
          <div className="stat-trend up">↗️ +8%</div>
        </div>
        <div className="stat-body">
          <h3>${stats.totalValue.toLocaleString()}</h3>
          <p>Total Value</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🔄</div>
          <div className="stat-trend up">↗️ +0.3</div>
        </div>
        <div className="stat-body">
          <h3>{stats.inventoryTurnover}x</h3>
          <p>Inventory Turnover</p>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="filter-section">
      <div className="search-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products, categories, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-controls">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
          </select>
          <button className="btn-secondary">📊 Analytics</button>
        </div>
      </div>
    </div>
  );

  const renderInventoryTable = () => (
    <div className="inventory-table">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Current Stock</th>
            <th>Reorder Level</th>
            <th>Location</th>
            <th>Value</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(item => (
            <tr key={item.id}>
              <td>
                <div className="product-info">
                  <strong>{item.product}</strong>
                  <small>ID: {item.id.toString().padStart(4, '0')}</small>
                </div>
              </td>
              <td>
                <span className="category-badge">{item.category}</span>
              </td>
              <td>
                <span className={`stock-level ${item.stock <= item.reorderLevel ? 'low' : 'normal'}`}>
                  {item.stock.toLocaleString()}
                </span>
              </td>
              <td>{item.reorderLevel.toLocaleString()}</td>
              <td>{item.location}</td>
              <td>${item.cost.toLocaleString()}</td>
              <td>{item.supplier}</td>
              <td>
                <span className={`status-badge ${item.stock <= item.reorderLevel ? 'warning' : 'success'}`}>
                  {item.stock <= item.reorderLevel ? 'Low Stock' : 'In Stock'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn-action btn-view" 
                    title="View Details"
                    onClick={() => setSelectedItem(item)}
                  >
                    👁️
                  </button>
                  <button className="btn-action btn-edit" title="Edit">✏️</button>
                  <button className="btn-action btn-reorder" title="Reorder">🔄</button>
                  <button className="btn-action btn-move" title="Move">📦</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAddItemForm = () => (
    <div className="modal-overlay" onClick={() => setShowAddItem(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Inventory Item</h3>
          <button className="modal-close" onClick={() => setShowAddItem(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" placeholder="Enter product name" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select>
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="new">Add New Category</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Initial Stock</label>
              <input type="number" placeholder="Enter quantity" />
            </div>
            <div className="form-group">
              <label>Reorder Level</label>
              <input type="number" placeholder="Enter reorder level" />
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" placeholder="Warehouse-Section" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Unit Cost ($)</label>
              <input type="number" placeholder="Enter cost" />
            </div>
            <div className="form-group">
              <label>Supplier</label>
              <input type="text" placeholder="Enter supplier name" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setShowAddItem(false)}>Cancel</button>
          <button className="btn-primary">Add Item</button>
        </div>
      </div>
    </div>
  );

  const renderItemDetail = () => (
    <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{selectedItem.product} - Detailed View</h3>
          <button className="modal-close" onClick={() => setSelectedItem(null)}>×</button>
        </div>
        <div className="modal-body">
          <div className="item-detail-grid">
            <div className="detail-section">
              <h4>Product Information</h4>
              <div className="detail-item">
                <span>Product ID:</span>
                <span>{selectedItem.id.toString().padStart(4, '0')}</span>
              </div>
              <div className="detail-item">
                <span>Product Name:</span>
                <span>{selectedItem.product}</span>
              </div>
              <div className="detail-item">
                <span>Category:</span>
                <span>{selectedItem.category}</span>
              </div>
              <div className="detail-item">
                <span>Supplier:</span>
                <span>{selectedItem.supplier}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Stock Information</h4>
              <div className="detail-item">
                <span>Current Stock:</span>
                <span>{selectedItem.stock.toLocaleString()} units</span>
              </div>
              <div className="detail-item">
                <span>Reorder Level:</span>
                <span>{selectedItem.reorderLevel.toLocaleString()} units</span>
              </div>
              <div className="detail-item">
                <span>Status:</span>
                <span className={`status-badge ${selectedItem.stock <= selectedItem.reorderLevel ? 'warning' : 'success'}`}>
                  {selectedItem.stock <= selectedItem.reorderLevel ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
              <div className="detail-item">
                <span>Last Updated:</span>
                <span>{selectedItem.lastUpdated}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Location & Value</h4>
              <div className="detail-item">
                <span>Storage Location:</span>
                <span>{selectedItem.location}</span>
              </div>
              <div className="detail-item">
                <span>Total Value:</span>
                <span>${selectedItem.cost.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span>Unit Value:</span>
                <span>${(selectedItem.cost / selectedItem.stock).toFixed(2)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Quick Actions</h4>
              <div className="action-grid">
                <button className="btn-secondary">📦 Update Stock</button>
                <button className="btn-secondary">🔄 Reorder</button>
                <button className="btn-secondary">📍 Move Location</button>
                <button className="btn-secondary">📊 Stock History</button>
                <button className="btn-secondary">🏷️ Update Price</button>
                <button className="btn-secondary">📞 Contact Supplier</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setSelectedItem(null)}>Close</button>
          <button className="btn-primary">Edit Item</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-content">
      <div className="section-header">
        <h2 className="section-title">Inventory Management</h2>
        <div className="table-actions">
          <button className="btn-primary" onClick={() => setShowAddItem(true)}>
            ➕ Add Product
          </button>
          <button className="btn-secondary">🔄 Bulk Update</button>
          <button className="btn-secondary">📊 Reports</button>
        </div>
      </div>
      
      {renderInventoryStats()}
      {renderFilters()}
      
      <div className="data-table">
        <div className="table-header">
          <h3 className="section-title">Inventory Overview ({filteredInventory.length} items)</h3>
          <div className="table-actions">
            <button className="btn-secondary" onClick={exportInventoryToCSV}>📋 Export</button>
            <button className="btn-secondary">🔄 Refresh</button>
          </div>
        </div>
        
        {renderInventoryTable()}
      </div>

      {showAddItem && renderAddItemForm()}
      {selectedItem && renderItemDetail()}
    </div>
  );
};

export default AdminInventory;