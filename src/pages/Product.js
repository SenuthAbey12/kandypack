import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Badge } from "react-bootstrap";
import Cards from "../Components/Card.js"; 
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

// --- Profile Menu Component for Products Page ---
const ProductsProfileMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.products-profile-menu')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', action: () => navigate('/dashboard') },
    { icon: '👤', label: 'Profile', action: () => alert('Profile coming soon!') },
    { icon: '📋', label: 'My Orders', action: () => alert('Order history coming soon!') },
    { icon: '❤️', label: 'Wishlist', action: () => alert('Wishlist coming soon!') },
    { icon: '⚙️', label: 'Settings', action: () => alert('Settings coming soon!') },
    { icon: '📞', label: 'Support', action: () => alert('Support coming soon!') },
    { icon: '🚪', label: 'Logout', action: onLogout, isLogout: true }
  ];

  const handleItemClick = (item) => {
    setIsOpen(false);
    item.action();
  };

  if (!user) return null;

  return (
    <div className="products-profile-menu" style={productsStyles.profileMenu}>
      <button 
        style={productsStyles.profileTrigger}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        <div style={productsStyles.avatarContainer}>
          <div style={productsStyles.avatar}>
            {user?.username?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div style={productsStyles.userInfo}>
            <span style={productsStyles.userName}>{user?.username || 'Customer'}</span>
            <span style={productsStyles.userRole}>Customer</span>
          </div>
          <span style={productsStyles.dropdownArrow}>{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {isOpen && (
        <div style={productsStyles.profileDropdown}>
          <div style={productsStyles.dropdownHeader}>
            <div style={productsStyles.avatarLarge}>
              {user?.username?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <div style={productsStyles.dropdownUserName}>{user?.username || 'Customer'}</div>
              <div style={productsStyles.dropdownUserEmail}>customer@kandypack.com</div>
            </div>
          </div>
          
          <div style={productsStyles.dropdownDivider}></div>
          
          {menuItems.map((item, index) => (
            <button
              key={index}
              style={{
                ...productsStyles.dropdownItem,
                ...(item.isLogout ? productsStyles.logoutItem : {})
              }}
              onClick={() => handleItemClick(item)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = item.isLogout ? '#fef2f2' : '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span style={productsStyles.itemIcon}>{item.icon}</span>
              <span style={productsStyles.itemLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Product() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [addedItems, setAddedItems] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { products, addToCart, cart } = useStore();
  const { user, logout } = useAuth();

  // Add responsive styles for Products page
  useEffect(() => {
    if (!document.querySelector('#products-responsive-styles')) {
      const style = document.createElement('style');
      style.id = 'products-responsive-styles';
      style.textContent = `
        @media (max-width: 768px) {
          .products-hero-content {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center !important;
          }
          
          .products-hero-title {
            font-size: 2.5rem !important;
          }
          
          .products-filters-container {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          
          .products-search-controls {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
          }
        }
        
        @media (max-width: 480px) {
          .products-hero-title {
            font-size: 2rem !important;
          }
          
          .products-grid {
            grid-template-columns: 1fr !important;
          }
          
          .products-filter-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            z-index: 1000 !important;
            background: white !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
          }
          
          .products-filter-sidebar.open {
            transform: translateX(0) !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Handle URL parameters for initial category selection
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && categoryParam !== category) {
      setCategory(categoryParam);
      // Clean up URL to avoid persistence of category parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location.search, category]);

  // Simulate loading for better UX
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [category, sortBy]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );

  const priceRanges = [
    { label: "Under $20", min: 0, max: 20 },
    { label: "$20 - $50", min: 20, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $200", min: 100, max: 200 },
    { label: "Over $200", min: 200, max: 1000 }
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = products.filter(p => {
      const matchesCat = category === "All" || p.category === category;
      const matchesQ = !q || p.title.toLowerCase().includes(q);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesCat && matchesQ && matchesPrice;
    });

    // Sort products
    result.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 4) - (a.rating || 4);
      if (sortBy === "newest") return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [query, category, sortBy, priceRange, products]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function handleAdd(product, qty) {
    addToCart(product.id, qty);
    setAddedItems(prev => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  }

  function handleToggleFavorite(productId) {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }

  function handleGoToCheckout() {
    navigate('/checkout');
  }

  function clearAllFilters() {
    setQuery("");
    setCategory("All");
    setSortBy("name");
    setPriceRange([0, 1000]);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div style={styles.container}>
      {/* Modern Hero Section */}
      <div style={styles.heroSection}>
        {/* Profile Menu in upper right corner */}
        <div style={styles.heroProfileMenu}>
          {user ? (
            <ProductsProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <div style={styles.loginPrompt}>
              <button 
                className="login-button"
                style={styles.loginButton}
                onClick={() => navigate('/login')}
              >
                🔑 Sign In
              </button>
            </div>
          )}
        </div>
        
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>Rail & Road Distribution Solutions</h1>
            <p style={styles.heroSubtitle}>
              Specialized packaging for multi-modal supply chain transportation networks
            </p>
            <div style={styles.heroStats}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{products.length}+</span>
                <span style={styles.statLabel}>Products</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{categories.length}</span>
                <span style={styles.statLabel}>Categories</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>4.8⭐</span>
                <span style={styles.statLabel}>Rating</span>
              </div>
            </div>
          </div>
          <div style={styles.heroImage}>
              <div style={styles.heroCard}>
              <div style={styles.heroCardIcon}>�</div>
              <h3>Professional Quality</h3>
              <p>Premium packaging materials for your business needs</p>
            </div>
          </div>
        </div>
      </div>

      <Container className="py-4">
        {/* Enhanced Toolbar */}
        <div style={styles.modernToolbar}>
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <Form.Control
                className="search-input"
                type="search"
                placeholder="Search rail & road distribution supplies, logistics solutions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={styles.modernSearchInput}
              />
              {query && (
                <button 
                  style={styles.clearSearchBtn}
                  onClick={() => setQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle & View Options */}
          <div style={styles.toolbarActions}>
            <button 
              style={{
                ...styles.actionBtn,
                ...(showFilters ? styles.actionBtnActive : {})
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              🔧 Filters
            </button>
            
            <div style={styles.viewToggle}>
              <button 
                style={{
                  ...styles.viewBtn,
                  ...(viewMode === "grid" ? styles.viewBtnActive : {})
                }}
                onClick={() => setViewMode("grid")}
              >
                ⚏
              </button>
              <button 
                style={{
                  ...styles.viewBtn,
                  ...(viewMode === "list" ? styles.viewBtnActive : {})
                }}
                onClick={() => setViewMode("list")}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div style={styles.filtersPanel}>
            <div style={styles.filterRow}>
              {/* Category Filter */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Category</label>
                <div style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className="category-chip"
                      style={{
                        ...styles.categoryChip,
                        ...(category === cat ? styles.categoryChipActive : {})
                      }}
                      onClick={() => setCategory(cat)}
                    >
                      {cat === "All" ? "🏷️ All" : `📦 ${cat}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Price Range</label>
                <div style={styles.priceRangeGrid}>
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      className="price-chip"
                      style={{
                        ...styles.priceChip,
                        ...(priceRange[0] === range.min && priceRange[1] === range.max ? styles.priceChipActive : {})
                      }}
                      onClick={() => setPriceRange([range.min, range.max])}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Sort By</label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.modernSelect}
                >
                  <option value="name">📝 Name (A-Z)</option>
                  <option value="price">💰 Price (Low to High)</option>
                  <option value="priceDesc">💸 Price (High to Low)</option>
                  <option value="rating">⭐ Rating (High to Low)</option>
                  <option value="newest">🆕 Newest First</option>
                </Form.Select>
              </div>
            </div>

            <div style={styles.filterActions}>
              <button 
                className="clear-filters-btn"
                style={styles.clearFiltersBtn} 
                onClick={clearAllFilters}
              >
                🗑️ Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div style={styles.resultsHeader}>
          <div style={styles.resultsInfo}>
            <span style={styles.resultsCount}>
              {isLoading ? "Loading..." : `${filtered.length} products found`}
            </span>
            {(query || category !== "All") && (
              <div style={styles.activeFilters}>
                {query && (
                  <Badge bg="primary" style={styles.filterBadge}>
                    Search: "{query}" ✕
                  </Badge>
                )}
                {category !== "All" && (
                  <Badge bg="secondary" style={styles.filterBadge}>
                    Category: {category} ✕
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div style={styles.cartSummary}>
            <span style={styles.cartInfo}>
              🛒 <strong>{cartCount}</strong> items in cart
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner}></div>
            <p>Finding the perfect products for you...</p>
          </div>
        )}

        {/* Product Grid/List */}
        {!isLoading && (
          <Row style={viewMode === "grid" ? styles.productGrid : styles.productList}>
            {filtered.map((p) => (
              <Col 
                key={p.id} 
                xs={12} 
                sm={viewMode === "grid" ? 6 : 12} 
                md={viewMode === "grid" ? 4 : 12} 
                lg={viewMode === "grid" ? 3 : 12}
                style={styles.productCol}
              >
                <div 
                  className="modern-product-card"
                  style={{
                    ...styles.modernProductCard,
                    ...(viewMode === "list" ? styles.listViewCard : {}),
                    ...(addedItems.has(p.id) ? styles.productCardAdded : {})
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    ...styles.productImageContainer,
                    ...(viewMode === "list" ? styles.listImageContainer : {})
                  }}>
                    <img 
                      className="product-image"
                      src={p.image || `https://via.placeholder.com/300x200/4facfe/ffffff?text=${encodeURIComponent(p.title.split(' ')[0])}`}
                      alt={p.title}
                      style={styles.productImage}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x200/4facfe/ffffff?text=${encodeURIComponent(p.title.split(' ')[0])}`;
                      }}
                    />
                    <div style={styles.imageOverlay}>
                      <button 
                        style={{
                          ...styles.favoriteBtn,
                          ...(favorites.has(p.id) ? styles.favoriteBtnActive : {})
                        }}
                        onClick={() => handleToggleFavorite(p.id)}
                      >
                        {favorites.has(p.id) ? "❤️" : "🤍"}
                      </button>
                      <Badge bg="success" style={styles.stockBadge}>
                        {p.stock > 10 ? "In Stock" : `Only ${p.stock} left`}
                      </Badge>
                    </div>
                    <div style={styles.categoryTag}>{p.category}</div>
                  </div>
                  
                  {/* Product Info */}
                  <div style={{
                    ...styles.productInfo,
                    ...(viewMode === "list" ? styles.listProductInfo : {})
                  }}>
                    <div style={styles.productHeader}>
                      <h3 style={styles.productTitle}>{p.title}</h3>
                      <div style={styles.ratingDisplay}>
                        <span style={styles.stars}>⭐⭐⭐⭐⭐</span>
                        <span style={styles.ratingText}>(4.{Math.floor(Math.random() * 9)})</span>
                      </div>
                    </div>
                    
                    <div style={styles.priceSection}>
                      <span style={styles.currentPrice}>${p.price.toFixed(2)}</span>
                      <span style={styles.originalPrice}>${(p.price * 1.2).toFixed(2)}</span>
                      <span style={styles.discountBadge}>17% OFF</span>
                    </div>
                    
                    <div style={styles.productFeatures}>
                      <span style={styles.feature}>🚚 Free Shipping</span>
                      <span style={styles.feature}>✨ Premium Quality</span>
                    </div>
                    
                    <Cards
                      title={p.title}
                      description={p.description}
                      image={p.image}
                      price={p.price}
                      stock={p.stock}
                      max={Math.min(99, p.stock)}
                      initialQty={1}
                      onAdd={(qty) => handleAdd(p, qty)}
                      buttonText={addedItems.has(p.id) ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                    />
                  </div>
                </div>
              </Col>
            ))}

            {/* Empty State */}
            {filtered.length === 0 && !isLoading && (
              <Col>
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>�</div>
                  <h3 style={styles.emptyTitle}>No products found</h3>
                  <p style={styles.emptyText}>
                    We couldn't find any products matching your criteria.
                  </p>
                  <button 
                    className="empty-action-btn"
                    style={styles.emptyActionBtn} 
                    onClick={clearAllFilters}
                  >
                    🔄 Clear All Filters
                  </button>
                </div>
              </Col>
            )}
          </Row>
        )}

        {/* Enhanced Checkout CTA */}
        {cartCount > 0 && (
          <div style={styles.modernCheckoutCTA}>
            <div style={styles.ctaContainer}>
              <div style={styles.ctaInfo}>
                <div style={styles.ctaTitle}>Ready to checkout?</div>
                <div style={styles.ctaSubtitle}>
                  🛒 {cartCount} items • ${cart.reduce((total, item) => {
                    const product = products.find(p => p.id === item.id);
                    return total + (product ? product.price * item.qty : 0);
                  }, 0).toFixed(2)} total
                </div>
              </div>
              <button 
                className="modern-checkout-button"
                style={styles.modernCheckoutButton} 
                onClick={handleGoToCheckout}
              >
                <span>Proceed to Checkout</span>
                <span className="checkout-arrow" style={styles.checkoutArrow}>→</span>
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    paddingBottom: '100px',
  },
  
  // Hero Section
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '80px 20px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
  heroProfileMenu: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 10,
  },
  loginPrompt: {
    display: 'flex',
    alignItems: 'center',
  },
  loginButton: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    color: 'white',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },
  heroText: {
    zIndex: 2,
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    margin: '0 0 20px 0',
    lineHeight: '1.1',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
    margin: '0 0 40px 0',
    lineHeight: '1.6',
  },
  heroStats: {
    display: 'flex',
    gap: '40px',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  heroImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  heroCardIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },

  // Modern Toolbar
  modernToolbar: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchContainer: {
    flex: 1,
    minWidth: '300px',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '18px',
    zIndex: 1,
    color: '#64748b',
  },
  modernSearchInput: {
    paddingLeft: '50px',
    paddingRight: '40px',
    height: '52px',
    borderRadius: '26px',
    border: '2px solid #e2e8f0',
    fontSize: '16px',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#64748b',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
  },
  toolbarActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  actionBtn: {
    padding: '12px 20px',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  actionBtnActive: {
    backgroundColor: '#667eea',
    color: 'white',
    borderColor: '#667eea',
  },
  viewToggle: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    overflow: 'hidden',
  },
  viewBtn: {
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  viewBtnActive: {
    backgroundColor: '#667eea',
    color: 'white',
  },

  // Filters Panel
  filtersPanel: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  filterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '20px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  categoryGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  categoryChip: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  categoryChipActive: {
    backgroundColor: '#667eea',
    color: 'white',
    borderColor: '#667eea',
  },
  priceRangeGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  priceChip: {
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    fontSize: '13px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  priceChipActive: {
    backgroundColor: '#10b981',
    color: 'white',
    borderColor: '#10b981',
  },
  modernSelect: {
    height: '44px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  filterActions: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  clearFiltersBtn: {
    padding: '12px 24px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Results Header
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
    gap: '15px',
  },
  resultsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  resultsCount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  activeFilters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterBadge: {
    fontSize: '12px',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  cartSummary: {
    display: 'flex',
    alignItems: 'center',
  },
  cartInfo: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: '16px',
  },

  // Loading State
  loadingState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#64748b',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },

  // Product Grid/List
  productGrid: {
    marginBottom: '40px',
  },
  productList: {
    marginBottom: '40px',
  },
  productCol: {
    marginBottom: '30px',
  },
  
  // Modern Product Cards
  modernProductCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    height: '100%',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    cursor: 'pointer',
    position: 'relative',
  },
  listViewCard: {
    display: 'flex',
    height: 'auto',
    background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
  },
  productCardAdded: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 16px 40px rgba(59, 130, 246, 0.25)',
    border: '2px solid #3b82f6',
    background: 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)',
  },
  
  // Product Image
  productImageContainer: {
    position: 'relative',
    height: '280px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listImageContainer: {
    width: '220px',
    minWidth: '220px',
    height: '220px',
    borderRadius: '16px',
  },
  productImage: {
    width: '90%',
    height: '90%',
    objectFit: 'contain',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))',
  },
  imageOverlay: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  favoriteBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
    border: '2px solid rgba(148, 163, 184, 0.2)',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  favoriteBtnActive: {
    background: 'linear-gradient(135deg, #fecaca 0%, #fee2e2 100%)',
    border: '2px solid #f87171',
    transform: 'scale(1.15)',
    boxShadow: '0 8px 24px rgba(248, 113, 113, 0.3)',
  },
  stockBadge: {
    fontSize: '11px',
    padding: '6px 12px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    fontWeight: '600',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  categoryTag: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },

  // Product Info
  productInfo: {
    padding: '24px',
  },
  listProductInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  productHeader: {
    marginBottom: '16px',
  },
  productTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#1e293b',
    lineHeight: '1.3',
  },
  ratingDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  stars: {
    fontSize: '16px',
    color: '#fbbf24',
  },
  ratingText: {
    fontSize: '14px',
    color: '#64748b',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#1e293b',
  },
  originalPrice: {
    fontSize: '1rem',
    color: '#94a3b8',
    textDecoration: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  productFeatures: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  feature: {
    fontSize: '13px',
    color: '#059669',
    backgroundColor: '#ecfdf5',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '500',
  },
  modernAddButton: {
    width: '100%',
    marginTop: 'auto',
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#64748b',
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '24px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 12px 0',
    color: '#374151',
  },
  emptyText: {
    fontSize: '16px',
    margin: '0 0 32px 0',
    lineHeight: '1.6',
  },
  emptyActionBtn: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Modern Checkout CTA
  modernCheckoutCTA: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    width: '90%',
    maxWidth: '500px',
  },
  ctaContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: '20px 24px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    border: '1px solid #e2e8f0',
  },
  ctaInfo: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },
  ctaSubtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  modernCheckoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  checkoutArrow: {
    fontSize: '18px',
    transition: 'transform 0.2s ease',
  },
};

// Profile Menu Styles for Products Page
const productsStyles = {
  profileMenu: {
    position: 'relative',
  },
  profileTrigger: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '4px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.3)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.2',
  },
  userRole: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '12px',
    lineHeight: '1.2',
  },
  dropdownArrow: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '12px',
    marginLeft: '4px',
  },
  profileDropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    border: '1px solid #e2e8f0',
    minWidth: '220px',
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f8fafc',
  },
  avatarLarge: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
  },
  dropdownUserName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: '1.2',
  },
  dropdownUserEmail: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.2',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
  },
  dropdownItem: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'background-color 0.2s',
    textAlign: 'left',
  },
  logoutItem: {
    color: '#dc2626',
    borderTop: '1px solid #e2e8f0',
  },
  itemIcon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  itemLabel: {
    flex: 1,
    textAlign: 'left',
  },
};

// Add CSS animations
const productPageStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modern-product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.1);
  }
  
  .modern-product-card:hover .product-image {
    transform: scale(1.05);
  }
  
  .modern-checkout-button:hover {
    background-color: #5a67d8;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  .modern-checkout-button:hover .checkout-arrow {
    transform: translateX(4px);
  }
  
  .search-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .category-chip:hover:not(.active) {
    background-color: #e2e8f0;
    transform: translateY(-1px);
  }
  
  .price-chip:hover:not(.active) {
    background-color: #e2e8f0;
    transform: translateY(-1px);
  }
  
  .empty-action-btn:hover {
    background-color: #5a67d8;
    transform: translateY(-2px);
  }
  
  .clear-filters-btn:hover {
    background-color: #fecaca;
  }
  
  .products-profile-menu .profile-dropdown {
    animation: fadeInDown 0.2s ease-out;
  }
  
  .products-profile-menu .profile-trigger:hover {
    background-color: rgba(255,255,255,0.15) !important;
    transform: translateY(-1px);
  }
  
  .login-button:hover {
    background-color: rgba(255,255,255,0.2) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255,255,255,0.1);
  }
`;

// Add styles to document if not already added
if (!document.querySelector('#product-page-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'product-page-styles';
  styleSheet.type = 'text/css';
  styleSheet.innerText = productPageStyles;
  document.head.appendChild(styleSheet);
}