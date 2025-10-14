import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Badge, Modal } from "react-bootstrap";
import Cards from "../Components/Card.js"; 
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import {
  Search as SearchIcon,
  X as XIcon,
  Filter as FilterIcon,
  Grid as GridIcon,
  List as ListIcon,
  Heart as HeartIcon,
  ShoppingCart,
  Star as StarIcon,
  LogIn as LogInIcon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Package as PackageIcon,
  Tag as TagIcon,
  DollarSign,
  Truck,
  Sparkles,
  Eye,
  Share2,
  GitCompare,
  Home as HomeIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  PhoneCall as PhoneIcon,
  LogOut as LogOutIcon,
  ClipboardList as OrdersIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
} from 'lucide-react';

// --- Profile Menu Component for Products Page ---
const ProductsProfileMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (action) => {
    setIsOpen(false);
    action();
  };

  if (!user) return null;

  return (
    <div ref={profileRef} style={productsStyles.profileWrapper}>
      <button style={productsStyles.profileBtn} onClick={() => setIsOpen(!isOpen)}>
        <div style={productsStyles.avatar}>
          {(user?.name || user?.username || 'C').substring(0,1).toUpperCase()}
        </div>
        <span style={productsStyles.caret}>▾</span>
      </button>
      {isOpen && (
        <div style={productsStyles.profileMenu}>
          <div style={productsStyles.menuHeader}>
            <div style={productsStyles.avatarSmall}>
              {(user?.name || user?.username || 'C').substring(0,1).toUpperCase()}
            </div>
            <div>
              <div style={productsStyles.menuName}>
                {user?.name || user?.username || 'Customer'}
              </div>
              <div style={productsStyles.menuSub}>
                {user?.email || user?.company_name || 'customer@kandypack.com'}
              </div>
            </div>
          </div>
          <div style={productsStyles.menuDivider}></div>
          <button 
            className="menu-item"
            style={productsStyles.menuItem} 
            onClick={() => handleMenuItemClick(() => {
              if (user?.role === 'customer') {
                navigate('/customer');
              } else if (user?.role === 'admin' || user?.role === 'driver' || user?.role === 'assistant') {
                navigate('/employee');
              } else {
                navigate('/');
              }
            })}
          >
            <span className="menu-item-icon" style={productsStyles.menuItemIcon}>🏠</span>
            <span>Dashboard</span>
          </button>
          <button 
            className="menu-item"
            style={productsStyles.menuItem} 
            onClick={() => handleMenuItemClick(() => {
              // Navigate to edit profile page
              navigate('/edit-profile');
            })}
          >
            <span className="menu-item-icon" style={productsStyles.menuItemIcon}>👤</span>
            <span>Profile</span>
          </button>
          <button 
            className="menu-item"
            style={productsStyles.menuItem} 
            onClick={() => handleMenuItemClick(() => {
              // Navigate to customer page current orders section
              navigate('/customer');
              setTimeout(() => {
                // Switch to current orders tab
                const ordersBtn = document.querySelector('[data-tab="current"]');
                if (ordersBtn) ordersBtn.click();
              }, 100);
            })}
          >
            <span className="menu-item-icon" style={productsStyles.menuItemIcon}>📋</span>
            <span>My Orders</span>
          </button>
          <button 
            className="menu-item"
            style={productsStyles.menuItem} 
            onClick={() => handleMenuItemClick(() => navigate('/wishlist'))}
          >
            <span className="menu-item-icon" style={productsStyles.menuItemIcon}>❤️</span>
            <span>Wishlist</span>
          </button>
          <button 
            className="menu-item"
            style={productsStyles.menuItem} 
            onClick={() => handleMenuItemClick(() => {
              // Navigate to settings page
              navigate('/settings');
            })}
          >
            <span className="menu-item-icon" style={productsStyles.menuItemIcon}>⚙️</span>
            <span>Settings</span>
          </button>
          <button 
            className="menu-item"
            style={productsStyles.menuItem} 
            onClick={() => handleMenuItemClick(() => {
              // Navigate to customer page support section
              navigate('/customer');
              setTimeout(() => {
                // Switch to support tab
                const supportBtn = document.querySelector('[data-tab="support"]');
                if (supportBtn) supportBtn.click();
              }, 100);
            })}
          >
            <span className="menu-item-icon" style={productsStyles.menuItemIcon}>💬</span>
            <span>Support</span>
          </button>
          <div style={productsStyles.menuDivider}></div>
          <button 
            className="menu-item menu-danger"
            style={{...productsStyles.menuItem, ...productsStyles.menuDanger}} 
            onClick={() => handleMenuItemClick(onLogout)}
          >
            <span className="menu-item-icon" style={productsStyles.menuItemIcon}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

// --- Custom Sort Dropdown Component ---
const CustomSortDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={sortDropdownStyles.container}>
      <button
        className="sort-dropdown-trigger"
        style={{
          ...sortDropdownStyles.trigger,
          ...(isOpen ? sortDropdownStyles.triggerActive : {})
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={sortDropdownStyles.selectedContent}>
          <span style={sortDropdownStyles.selectedIcon}>{selectedOption?.icon}</span>
          <span style={sortDropdownStyles.selectedLabel}>{selectedOption?.label}</span>
        </span>
        <ChevronDownIcon 
          size={18} 
          style={{
            ...sortDropdownStyles.chevron,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }} 
        />
      </button>

      {isOpen && (
        <div style={sortDropdownStyles.dropdown}>
          {options.map((option) => (
            <button
              key={option.value}
              className="sort-option"
              style={{
                ...sortDropdownStyles.option,
                ...(value === option.value ? sortDropdownStyles.optionActive : {})
              }}
              onClick={() => handleSelect(option.value)}
            >
              <span style={sortDropdownStyles.optionIcon}>{option.icon}</span>
              <div style={sortDropdownStyles.optionContent}>
                <span style={sortDropdownStyles.optionLabel}>{option.label}</span>
                <span className="sort-option-description" style={sortDropdownStyles.optionDescription}>{option.description}</span>
              </div>
              {value === option.value && (
                <span style={sortDropdownStyles.checkIcon}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const sortDropdownStyles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  trigger: {
    width: '100%',
    height: '48px',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '2px solid #e2e8f0',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  triggerActive: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
  },
  selectedContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  selectedIcon: {
    fontSize: '16px',
  },
  selectedLabel: {
    fontWeight: '600',
  },
  chevron: {
    color: '#64748b',
    transition: 'transform 0.3s ease',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    marginTop: '8px',
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    zIndex: 1000,
    overflow: 'hidden',
    animation: 'fadeInDown 0.2s ease-out',
  },
  option: {
    width: '100%',
    padding: '14px 16px',
    border: 'none',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  optionActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  optionIcon: {
    fontSize: '18px',
    minWidth: '20px',
  },
  optionContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  optionLabel: {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.2',
  },
  optionDescription: {
    fontSize: '12px',
    opacity: 0.7,
    lineHeight: '1.2',
  },
  checkIcon: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'currentColor',
  },
};

export default function Product() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [addedItems, setAddedItems] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [compareItems, setCompareItems] = useState(new Set());
  const [quickView, setQuickView] = useState(null); // product or null
  const [ratingFilter, setRatingFilter] = useState(0);
  const [wishlist, setWishlist] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isProductsViewActive, setIsProductsViewActive] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pageSize = 12;
  
  const navigate = useNavigate();
  const location = useLocation();
  const { products, addToCart, removeFromCart, cart } = useStore();
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

  // Handle scroll-based transitions
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Calculate transition progress based on scroll
      const heroHeight = window.innerHeight * 0.8;
      const scrollProgress = Math.min(currentScrollY / heroHeight, 1);
      
      // Activate products view when user scrolls past 50% of hero section
      setIsProductsViewActive(scrollProgress > 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth transition to products section
  const transitionToProducts = () => {
    setIsProductsViewActive(true);
    const productsSection = document.querySelector('#product-results');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

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

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(`wishlist_${user?.username || 'guest'}`);
      if (savedWishlist) {
        const wishlistIds = JSON.parse(savedWishlist);
        setWishlist(new Set(wishlistIds));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  }, [user]);

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
      const pr = p.rating ?? 4;
      const matchesRating = pr >= ratingFilter;
      return matchesCat && matchesQ && matchesPrice && matchesRating;
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
  }, [query, category, sortBy, priceRange, ratingFilter, products]);

  // Wishlist helper functions
  const toggleWishlist = (productId) => {
    try {
      const newWishlist = new Set(wishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      setWishlist(newWishlist);
      
      // Save to localStorage
      const wishlistArray = Array.from(newWishlist);
      localStorage.setItem(`wishlist_${user?.username || 'guest'}`, JSON.stringify(wishlistArray));
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      query !== "" ||
      category !== "All" ||
      sortBy !== "name" ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 1000 ||
      ratingFilter !== 0
    );
  }, [query, category, sortBy, priceRange, ratingFilter]);

  // Reset to first page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, category, sortBy, priceRange, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isInCart = (id) => cart.some((i) => i.id === id);

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

  function handleGoToCheckout() {
    navigate('/checkout');
  }

  function clearAllFilters() {
    setQuery("");
    setCategory("All");
    setSortBy("name");
    setPriceRange([0, 1000]);
    setRatingFilter(0);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  function handleToggleCompare(productId) {
    setCompareItems(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId); else next.add(productId);
      return next;
    });
  }

  function handleShareProduct(p) {
    const shareText = `${p.title} - $${p.price.toFixed(2)} | ${window.location.origin}/products`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Product link copied to clipboard');
      }).catch(() => alert('Copied details to clipboard'));
    } else {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Product link copied to clipboard');
      } catch {
        alert('Copy not supported in this browser');
      }
    }
  }

  function openQuickView(p) { setQuickView(p); }
  function closeQuickView() { setQuickView(null); }

  // Colorful accents by category
  const accentPalette = useMemo(() => [
    { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', ring: 'rgba(79, 172, 254, 0.3)' },
    { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', ring: 'rgba(240, 147, 251, 0.3)' },
    { gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', ring: 'rgba(132, 250, 176, 0.3)' },
    { gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', ring: 'rgba(161, 140, 209, 0.3)' },
    { gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', ring: 'rgba(253, 160, 133, 0.3)' },
  ], []);

  const getAccentForCategory = (cat) => {
    if (!cat) return accentPalette[0];
    let hash = 0;
    for (let i = 0; i < cat.length; i++) hash = (hash * 31 + cat.charCodeAt(i)) >>> 0;
    return accentPalette[hash % accentPalette.length];
  };

  const renderStars = (rating = 4.8) => {
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon key={i} size={16} color="#fbbf24" fill={i < full ? '#fbbf24' : 'none'} />
      );
    }
    return <span style={{ display: 'inline-flex', gap: 2 }}>{stars}</span>;
  };

  return (
    <div style={styles.container}>
      {/* Modern Scroll Progress Indicator */}
      <div 
        className="scroll-indicator"
        style={{
          transform: `scaleX(${Math.min(scrollY / (window.innerHeight * 0.8), 1)})`,
        }}
      />
      
      {/* Modern Hero Section */}
      <div style={{
        ...styles.heroSection,
        transform: isProductsViewActive ? 'scale(0.95)' : 'scale(1)',
        opacity: isProductsViewActive ? 0.7 : 1,
        marginBottom: isProductsViewActive ? '-5vh' : '0',
      }}>
        {/* Decorative floating blobs */}
        <div style={styles.blobOne} aria-hidden="true"></div>
        <div style={styles.blobTwo} aria-hidden="true"></div>
        <div style={styles.blobThree} aria-hidden="true"></div>
        
        {/* Back to Home button in upper left corner */}
        <div style={styles.backToHomeContainer}>
          <button 
            className="back-to-home-button"
            style={styles.backToHomeButton}
            onClick={() => navigate('/')}
          >
            <HomeIcon size={18} style={{ marginRight: 8 }} /> Back to Home
          </button>
        </div>
        
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
                <LogInIcon size={18} style={{ marginRight: 8 }} /> Sign In
              </button>
            </div>
          )}
        </div>
        
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              <span style={styles.heroTitleGradient}>Rail & Road</span> Distribution Solutions
            </h1>
            <p style={styles.heroSubtitle}>
              Specialized packaging for multi-modal supply chain transportation networks
            </p>
            <div style={styles.heroStats}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}><PackageIcon size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />{products.length}+</span>
                <span style={styles.statLabel}>Products</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}><TagIcon size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />{categories.length}</span>
                <span style={styles.statLabel}>Categories</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}><StarIcon size={18} color="#fbbf24" fill="#fbbf24" style={{ verticalAlign: 'middle', marginRight: 6 }} />4.8</span>
                <span style={styles.statLabel}>Rating</span>
              </div>
            </div>
            <div style={styles.heroCtas}>
              <button style={styles.primaryCta} onClick={transitionToProducts}>
                Browse Products <ArrowRight size={16} style={{marginLeft: 8}}/>
              </button>
              <button style={styles.secondaryCta} onClick={() => navigate('/products/learn-more')}>
                Learn More
              </button>
            </div>
          </div>
          <div style={styles.heroImage}>
              <div style={styles.heroCard}>
              <div style={styles.heroCardIcon}><PackageIcon size={56} /></div>
              <h3>Professional Quality</h3>
              <p>Premium packaging materials for your business needs</p>
            </div>
          </div>
        </div>
        {/* Decorative wave divider */}
        <div style={styles.waveDivider} aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{display:'block', width:'100%', height:'100%'}}>
            <path fill="#f8fafc" d="M0,64L60,85.3C120,107,240,149,360,144C480,139,600,85,720,90.7C840,96,960,160,1080,170.7C1200,181,1320,139,1380,117.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>
      </div>

      {/* Modern Products Container with transition */}
      <div style={{
        ...styles.productsContainer,
        transition: 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
        transform: isProductsViewActive ? 'scale(1.02)' : 'scale(1)',
        padding: isProductsViewActive ? '2rem' : '1rem',
        borderRadius: isProductsViewActive ? '20px 20px 0 0' : '0',
        boxShadow: isProductsViewActive ? '0 -10px 30px rgba(0,0,0,0.1)' : 'none',
        background: isProductsViewActive ? '#ffffff' : 'transparent',
        zIndex: isProductsViewActive ? 10 : 'auto',
      }}>
        <Container className="py-4" style={{ 
          maxWidth: isProductsViewActive ? '100%' : '1200px',
          transition: 'all 0.6s ease',
          animation: isProductsViewActive ? 'slideUpFade 0.8s ease-out' : 'none',
        }}>
        {/* Enhanced Toolbar */}
        <div style={styles.modernToolbar}>
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}><SearchIcon size={18} color="#64748b" /></span>
              <Form.Control
                className="search-input"
                type="text"
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
                  <XIcon size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle & View Options */}
          <div style={styles.toolbarActions}>
            {/* View Toggle - Move to prominent position */}
            <div style={styles.viewToggle}>
              <span style={styles.viewToggleLabel}>View:</span>
              <button 
                style={{
                  ...styles.viewBtn,
                  ...(viewMode === "grid" ? styles.viewBtnActive : {})
                }}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <GridIcon size={18} />
                <span style={styles.viewBtnText}>Grid</span>
              </button>
              <button 
                style={{
                  ...styles.viewBtn,
                  ...(viewMode === "list" ? styles.viewBtnActive : {})
                }}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <ListIcon size={18} />
                <span style={styles.viewBtnText}>List</span>
              </button>
            </div>

            <button 
              style={{
                ...styles.actionBtn,
                ...(showFilters ? styles.actionBtnActive : {})
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon size={16} style={{ marginRight: 8 }} /> Filters
            </button>
            
            <button 
              style={styles.actionBtn}
              onClick={() => navigate('/wishlist')}
            >
              <HeartIcon size={16} style={{ marginRight: 8 }} /> Wishlist ({wishlist.size})
            </button>

            <button 
              style={styles.actionBtn}
              onClick={() => {
                if (compareItems.size === 0) {
                  alert('Add products to compare by clicking the compare icon on product cards.');
                } else {
                  alert(`Comparing ${compareItems.size} products. Full comparison view coming soon!`);
                }
              }}
            >
              <GitCompare size={16} style={{ marginRight: 8 }} /> Compare ({compareItems.size})
            </button>
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
                      <TagIcon size={14} style={{ marginRight: 6 }} /> {cat === "All" ? "All" : cat}
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
                      <DollarSign size={14} style={{ marginRight: 6 }} /> {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Minimum Rating</label>
                <div style={styles.priceRangeGrid}>
                  {[5,4,3,2,1,0].map((r) => (
                    <button
                      key={r}
                      className="price-chip"
                      style={{
                        ...styles.priceChip,
                        ...(ratingFilter === r ? styles.priceChipActive : {})
                      }}
                      onClick={() => setRatingFilter(r)}
                    >
                      {r === 0 ? 'All' : (
                        <span style={{display:'inline-flex',alignItems:'center',gap:4}}>
                          {Array.from({length:5}).map((_,i) => (
                            <StarIcon key={i} size={12} color="#fbbf24" fill={i < r ? '#fbbf24' : 'none'} />
                          ))}
                          &nbsp;{r}+
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Sort By</label>
                <CustomSortDropdown 
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { value: "name", label: "Name (A-Z)", icon: "📝", description: "Alphabetical order" },
                    { value: "price", label: "Price (Low to High)", icon: "💰", description: "Cheapest first" },
                    { value: "priceDesc", label: "Price (High to Low)", icon: "💸", description: "Most expensive first" },
                    { value: "rating", label: "Rating (High to Low)", icon: "⭐", description: "Best rated first" },
                    { value: "newest", label: "Newest First", icon: "🆕", description: "Latest products first" }
                  ]}
                />
              </div>
            </div>

            <div style={styles.filterActions}>
              {hasActiveFilters && (
                <button 
                  className="clear-filters-btn"
                  style={styles.clearFiltersBtn} 
                  onClick={clearAllFilters}
                >
                  🗑️ Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

  {/* Results Summary */}
  <div id="product-results" style={styles.resultsHeader}>
          <div style={styles.resultsInfo}>
            <span style={styles.resultsCount}>
              {isLoading ? "Loading..." : `${filtered.length} products found`}
            </span>
            <div style={styles.viewModeIndicator}>
              <span style={styles.viewModeText}>
                {viewMode === "grid" ? "📱 Grid View" : "📋 List View"}
              </span>
            </div>
            {hasActiveFilters && (
              <div style={styles.filterSummary}>
                <span style={styles.filterSummaryText}>
                  Filters active: 
                  {query && ` Search: "${query}"`}
                  {category !== "All" && ` Category: ${category}`}
                  {(priceRange[0] !== 0 || priceRange[1] !== 1000) && 
                    ` Price: $${priceRange[0]} - $${priceRange[1] === 1000 ? '1000+' : priceRange[1]}`}
                  {ratingFilter > 0 && ` Rating: ${ratingFilter}+ stars`}
                  {sortBy !== "name" && ` Sort: ${sortBy}`}
                </span>
                <button 
                  className="quick-clear-btn"
                  style={styles.quickClearBtn}
                  onClick={clearAllFilters}
                  title="Clear all filters"
                >
                  ✕
                </button>
              </div>
            )}
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
          <>
          <Row style={viewMode === "grid" ? styles.productGrid : styles.productList}>
            {pageItems.map((p) => (
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
                    ...(addedItems.has(p.id) ? styles.productCardAdded : {}),
                    boxShadow: styles.modernProductCard.boxShadow,
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
                    {/* Overlays hidden for simplified professional style */}
                  </div>
                  
                  {/* Product Info */}
                  <div style={{
                    ...styles.productInfo,
                    ...(viewMode === "list" ? styles.listProductInfo : {})
                  }}>
                    <div style={styles.productHeader}>
                      <h3 style={styles.productTitle} className="daraz-title">{p.title}</h3>
                      <div style={styles.ratingDisplay}>
                        {renderStars(4.8)}
                        <span style={styles.ratingText}>(4.{Math.floor(Math.random() * 9)})</span>
                      </div>
                    </div>
                    
                    <div style={styles.priceSection}>
                      {(() => {
                        const price = Number(p.price || 0);
                        const original = price * 1.2;
                        const discount = original > 0 ? Math.round(((original - price) / original) * 100) : 0;
                        const fmt = (v) => `Rs.${v.toLocaleString('en-LK')}`;
                        return (
                          <>
                            <span style={styles.currentPrice}>{fmt(price)}</span>
                            <span style={styles.originalPrice}>{fmt(original)}</span>
                            <span style={styles.discountText}>-{discount}%</span>
                          </>
                        );
                      })()}
                    </div>
                    
                    <div style={styles.productFeatures}>
                      <span style={styles.feature}><Truck size={14} style={{ marginRight: 6 }} /> Free Shipping</span>
                      <span style={styles.feature}><Sparkles size={14} style={{ marginRight: 6 }} /> Premium Quality</span>
                    </div>
                    <div style={styles.modernAddButton}>
                      <Cards
                        embedded
                        price={p.price}
                        stock={p.stock}
                        max={Math.min(99, p.stock)}
                        initialQty={1}
                        onAdd={(qty) => handleAdd(p, qty)}
                        buttonText={addedItems.has(p.id) ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                      />
                      {isInCart(p.id) && (
                        <button
                          className="cc-btn cc-btn-ghost"
                          style={styles.removeFromCartBtn}
                          onClick={() => removeFromCart(p.id)}
                          aria-label={`Remove ${p.title} from cart`}
                        >
                          Remove from Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))}

            {/* Empty State */}
            {filtered.length === 0 && !isLoading && (
              <Col>
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}><PackageIcon size={64} /></div>
                  <h3 style={styles.emptyTitle}>
                    {hasActiveFilters ? "No products match your filters" : "No products found"}
                  </h3>
                  <p style={styles.emptyText}>
                    {hasActiveFilters 
                      ? "Try adjusting your search criteria or clearing some filters to see more results."
                      : "We couldn't find any products at the moment. Please try again later."
                    }
                  </p>
                  {hasActiveFilters && (
                    <button 
                      className="empty-action-btn"
                      style={styles.emptyActionBtn} 
                      onClick={clearAllFilters}
                    >
                      🔄 Clear All Filters
                    </button>
                  )}
                </div>
              </Col>
            )}
          </Row>
          {/* Pagination */}
          {filtered.length > pageSize && (
            <div style={styles.pagination}>
              <button
                style={{...styles.pageBtn, ...(currentPage === 1 ? styles.pageBtnDisabled : {})}}
                onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
              <button
                style={{...styles.pageBtn, ...(currentPage === totalPages ? styles.pageBtnDisabled : {})}}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
          </>
        )}

        {/* Enhanced Checkout CTA */}
        {cartCount > 0 && (
          <div style={styles.modernCheckoutCTA}>
            <div style={styles.ctaContainer}>
              <div style={styles.ctaInfo}>
                <div style={styles.ctaTitle}>Ready to checkout?</div>
                <div style={styles.ctaSubtitle}>
                    <ShoppingCart size={16} style={{ marginRight: 6 }} /> {cartCount} items • ${cart.reduce((total, item) => {
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
                  <span className="checkout-arrow" style={styles.checkoutArrow}><ArrowRight size={18} /></span>
              </button>
            </div>
          </div>
        )}
      </Container>
      </div>
      {/* Quick View Modal */}
      <Modal show={!!quickView} onHide={closeQuickView} centered>
        {quickView && (
          <div style={{padding: '8px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px'}}>
              <h5 style={{margin:0}}>{quickView.title}</h5>
              <button onClick={closeQuickView} style={{background:'none',border:'none',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,padding:'0 16px 16px'}}>
              <div style={{display:'grid',placeItems:'center',background:'#f8fafc',borderRadius:12,padding:12}}>
                <img alt={quickView.title} src={quickView.image || `https://via.placeholder.com/400x300/4facfe/ffffff?text=${encodeURIComponent(quickView.title.split(' ')[0])}`} style={{maxWidth:'100%',maxHeight:240,objectFit:'contain'}} />
              </div>
              <div>
                <div style={{fontSize:'1.4rem',fontWeight:800,marginBottom:8}}>${quickView.price.toFixed(2)}</div>
                <div style={{color:'#64748b',marginBottom:12}}>{quickView.description || 'High-performance packaging solution optimized for rail & road logistics.'}</div>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
                  {Array.from({length:5}).map((_,i)=>(<StarIcon key={i} size={16} color="#fbbf24" fill={i < (quickView.rating ?? 4) ? '#fbbf24' : 'none'} />))}
                  <span style={{color:'#64748b'}}>(Rated {quickView.rating ?? 4}.0)</span>
                </div>
                <div>
                  <button
                    style={{padding:'10px 14px',borderRadius:12,background:'#667eea',color:'#fff',border:'none',fontWeight:700,cursor:'pointer'}}
                    onClick={() => { handleAdd(quickView, 1); closeQuickView(); }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Compare Tray */}
      {compareItems.size > 0 && (
        <div style={styles.compareTray}>
          <div style={styles.compareList}>
            {[...compareItems].slice(0,3).map(id => {
              const p = products.find(x => x.id === id);
              if (!p) return null;
              return (
                <div key={id} style={styles.compareItem}>
                  <div style={styles.compareThumb}>
                    <img alt={p.title} src={p.image || `https://via.placeholder.com/64x64/4facfe/ffffff?text=${encodeURIComponent(p.title.split(' ')[0])}`} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:8}} />
                  </div>
                  <div style={styles.compareMeta}>
                    <div style={styles.compareTitle}>{p.title}</div>
                    <div style={styles.comparePrice}>${p.price.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex',gap:8}}>
            <button style={styles.compareClearBtn} onClick={() => setCompareItems(new Set())}>Clear</button>
            <button style={styles.compareActionBtn} onClick={() => alert('Comparison view coming soon!')}>Compare</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    paddingBottom: 'clamp(60px, 10vh, 120px)',
    width: '100vw',
    maxWidth: '100%',
    overflow: 'visible',
    boxSizing: 'border-box',
    position: 'relative',
  },
  
  // Hero Section with transition support
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 'clamp(40px, 8vh, 80px) clamp(1rem, 3vw, 2rem)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    minHeight: '80vh',
    boxSizing: 'border-box',
    transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  
  // Products Container with transition support
  productsContainer: {
    transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
    backgroundColor: '#f8fafc',
    borderRadius: '0',
  },
  
  blobOne: {
    position: 'absolute',
    top: '-80px',
    left: '-80px',
    width: '220px',
    height: '220px',
    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0))',
    borderRadius: '50%',
    filter: 'blur(4px)',
    animation: 'floatUp 10s ease-in-out infinite',
  },
  blobTwo: {
    position: 'absolute',
    bottom: '-60px',
    right: '10%',
    width: '260px',
    height: '260px',
    background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.22), rgba(255,255,255,0))',
    borderRadius: '50%',
    filter: 'blur(6px)',
    animation: 'floatUp 12s ease-in-out infinite',
    animationDelay: '0.5s',
  },
  blobThree: {
    position: 'absolute',
    top: '20%',
    right: '-80px',
    width: '180px',
    height: '180px',
    background: 'radial-gradient(circle at 40% 70%, rgba(255,255,255,0.18), rgba(255,255,255,0))',
    borderRadius: '50%',
    filter: 'blur(4px)',
    animation: 'floatUp 14s ease-in-out infinite',
    animationDelay: '1s',
  },
  heroProfileMenu: {
    position: 'absolute',
    top: 'clamp(15px, 3vh, 25px)',
    right: 'clamp(15px, 3vw, 25px)',
    zIndex: 10,
  },
  backToHomeContainer: {
    position: 'absolute',
    top: 'clamp(15px, 3vh, 25px)',
    left: 'clamp(15px, 3vw, 25px)',
    zIndex: 10,
  },
  backToHomeButton: {
    background: 'rgba(255,255,255,0.15)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: 'clamp(8px, 2vw, 15px)',
    color: 'white',
    padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
    cursor: 'pointer',
    fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
    backdropFilter: 'blur(10px)',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  loginPrompt: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
  },
  loginButton: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 'clamp(8px, 2vw, 15px)',
    color: 'white',
    padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
    cursor: 'pointer',
    fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    whiteSpace: 'nowrap',
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 'clamp(30px, 6vh, 60px)',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },
  heroText: {
    zIndex: 2,
    textAlign: 'center',
    width: '100%',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 6vw, 4rem)',
    fontWeight: '800',
    margin: '0 0 clamp(15px, 3vh, 25px) 0',
    lineHeight: '1.1',
    wordWrap: 'break-word',
    hyphens: 'auto',
  },
  heroTitleGradient: {
    background: 'linear-gradient(90deg, #f9fafb, #e0e7ff, #dbeafe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 3vw, 1.4rem)',
    opacity: 0.9,
    margin: '0 0 clamp(25px, 5vh, 45px) 0',
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
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    animation: 'floatUp 8s ease-in-out infinite',
  },
  heroCardIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  heroCtas: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryCta: {
    padding: '12px 18px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
    color: 'white',
    border: 'none',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(96,165,250,0.35)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  secondaryCta: {
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  waveDivider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '80px',
    pointerEvents: 'none',
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
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '2px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginRight: '20px',
  },
  viewToggleLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    padding: '0 16px 0 20px',
    borderRight: '1px solid #e2e8f0',
    marginRight: '0',
  },
  viewBtn: {
    padding: '14px 18px',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
  },
  viewBtnText: {
    fontSize: '13px',
    fontWeight: '600',
  },
  viewBtnActive: {
    backgroundColor: '#667eea',
    color: 'white',
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
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
  viewModeIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  viewModeText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
  },
  filterSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#475569',
  },
  filterSummaryText: {
    fontSize: '13px',
    color: '#64748b',
  },
  quickClearBtn: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: '#64748b',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
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
    display: 'flex',
  },
  
  // Modern Product Cards
  modernProductCard: {
    background: 'var(--card)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    height: '100%',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  listViewCard: {
    flexDirection: 'row',
    height: 'auto',
    minHeight: '200px',
    background: 'var(--card)',
    display: 'flex',
    alignItems: 'stretch',
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
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listImageContainer: {
    width: '240px',
    minWidth: '240px',
    height: '200px',
    borderRadius: '0',
    margin: '0',
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  productImage: {
    width: '90%',
    height: '90%',
    objectFit: 'contain',
    transition: 'transform 0.25s ease',
    filter: 'none',
  },
  imageOverlay: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  imageActionsLeft: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  actionIconBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'transparent',
    border: '1px solid var(--border)',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text)'
  },
  actionIconActive: {
    borderColor: '#667eea'
  },
  favoriteBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'transparent',
    border: '1px solid var(--border)',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  favoriteBtnActive: {
    background: 'rgba(248, 113, 113, 0.12)',
    border: '1px solid rgba(248, 113, 113, 0.5)'
  },
  stockBadge: {
    fontSize: '11px',
    padding: '6px 12px',
    borderRadius: '16px',
    background: 'rgba(16, 185, 129, 0.10)',
    border: '1px solid rgba(5, 150, 105, 0.25)',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  categoryTag: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    background: 'rgba(15, 23, 42, 0.85)',
    color: 'var(--header-text)',
    padding: '8px 12px',
    borderRadius: '14px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },

  // Product Info
  productInfo: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  listProductInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px 32px',
  },
  productHeader: {
    marginBottom: '16px',
  },
  productTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: 'var(--text)',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
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
    color: 'var(--muted)',
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
    color: 'var(--text)',
  },
  originalPrice: {
    fontSize: '1rem',
    color: 'var(--muted)',
    textDecoration: 'line-through',
  },
  discountBadge: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    color: '#dc2626',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  discountText: {
    color: '#64748b',
    fontSize: '0.95rem'
  },
  productFeatures: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  feature: {
    fontSize: '13px',
    color: '#065f46',
    backgroundColor: 'rgba(16,185,129,0.12)',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '500',
  },
  modernAddButton: {
    width: '100%',
    marginTop: 'auto',
  },
  removeFromCartBtn: {
    marginTop: 10,
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    background: '#fff',
    border: '2px solid #fecaca',
    color: '#b91c1c',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Pagination
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '10px',
    marginBottom: '30px',
  },
  pageBtn: {
    padding: '8px 12px',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    background: '#fff',
    color: '#334155',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
  },
  pageBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  pageInfo: { color: '#64748b', fontWeight: 600 },

  // Compare Tray
  compareTray: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: '100px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 1001,
  },
  compareList: { display: 'flex', gap: '10px' },
  compareItem: { display: 'flex', gap: '8px', alignItems: 'center' },
  compareThumb: { width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: '#f1f5f9' },
  compareMeta: { display: 'flex', flexDirection: 'column' },
  compareTitle: { fontSize: 12, color: '#334155', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  comparePrice: { fontSize: 12, fontWeight: 700, color: '#111827' },
  compareClearBtn: { padding: '8px 10px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#334155', cursor: 'pointer', fontWeight: 600 },
  compareActionBtn: { padding: '8px 10px', borderRadius: 10, border: 'none', background: '#667eea', color: '#fff', cursor: 'pointer', fontWeight: 700 },

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
  profileWrapper: {
    position: 'relative',
  },
  profileBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    color: 'white',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  caret: {
    fontSize: '12px',
    opacity: 0.8,
  },
  profileMenu: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '8px',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    minWidth: '280px',
    overflow: 'hidden',
    zIndex: 1000,
    animation: 'fadeInDown 0.2s ease-out',
  },
  menuHeader: {
    padding: '16px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarSmall: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  },
  menuName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a202c',
    margin: 0,
  },
  menuSub: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  menuDivider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '8px 0',
  },
  menuItem: {
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    color: '#374151',
    textAlign: 'left',
  },
  menuItemIcon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  menuDanger: {
    color: '#dc2626',
  },
};

// Add CSS animations and comprehensive responsive design
const productPageStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes floatUp {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { 
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); 
    }
    50% { 
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5); 
    }
  }

  /* Modern Page Transition Animations */
  @keyframes slideUpFade {
    0% {
      transform: translateY(50px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes heroShrink {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.3;
    }
  }

  @keyframes productsExpand {
    0% {
      transform: scale(0.95);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Smooth page transitions */
  .hero-section-transitioning {
    animation: heroShrink 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
  }

  .products-section-expanding {
    animation: productsExpand 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
  }

  /* Modern scroll indicator */
  .scroll-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transform-origin: left;
    z-index: 9999;
    transition: transform 0.3s ease;
  }

  /* Profile Menu Hover Effects */
  .menu-item:hover {
    background-color: #f8fafc !important;
    transform: translateX(4px) !important;
  }

  .menu-item:hover .menu-item-icon {
    transform: scale(1.1) !important;
  }

  .menu-danger:hover {
    background-color: #fef2f2 !important;
    color: #dc2626 !important;
  }

  /* Comprehensive Responsive Design for Product Page */
  
  /* Large Desktop (1200px+) */
  @media (min-width: 1200px) {
    .hero-content {
      grid-template-columns: 1fr 1fr !important;
      text-align: left !important;
    }
    
    .modern-toolbar {
      flex-direction: row !important;
      flex-wrap: nowrap !important;
    }
    
    .search-container {
      min-width: 350px !important;
    }
  }

  /* Tablet (768px - 1199px) */
  @media (min-width: 768px) and (max-width: 1199px) {
    .hero-content {
      grid-template-columns: 1fr !important;
      text-align: center !important;
      gap: clamp(25px, 4vh, 40px) !important;
    }
    
    .modern-toolbar {
      flex-direction: column !important;
      gap: clamp(15px, 3vh, 25px) !important;
    }
    
    .search-container {
      width: 100% !important;
      min-width: unset !important;
    }
    
    .toolbar-actions {
      width: 100% !important;
      justify-content: center !important;
      flex-wrap: wrap !important;
    }
  }

  /* Mobile (max-width: 767px) */
  @media (max-width: 767px) {
    .hero-section {
      padding: clamp(20px, 5vh, 40px) clamp(1rem, 3vw, 1.5rem) !important;
    }
    
    .hero-title {
      font-size: clamp(1.5rem, 5vw, 2.5rem) !important;
    }
    
    .hero-subtitle {
      font-size: clamp(1rem, 3vw, 1.3rem) !important;
    }
    
    .modern-toolbar {
      flex-direction: column !important;
      gap: clamp(10px, 2.5vh, 20px) !important;
      padding: 0 clamp(0.5rem, 2vw, 1rem) !important;
    }
    
    .modern-search-input {
      height: clamp(40px, 8vw, 52px) !important;
      font-size: clamp(0.9rem, 2.5vw, 1rem) !important;
    }
    
    .action-btn {
      padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 18px) !important;
      font-size: clamp(0.8rem, 2vw, 0.9rem) !important;
    }
    
    .view-toggle {
      width: 100% !important;
    }
    
    .view-btn {
      flex: 1 !important;
      padding: clamp(10px, 2vw, 14px) !important;
    }
    
    .filters-panel {
      padding: clamp(15px, 3vw, 25px) !important;
    }
  }

  /* Small Mobile (max-width: 480px) */
  @media (max-width: 480px) {
    .hero-title {
      font-size: clamp(1.2rem, 4.5vw, 2rem) !important;
      margin-bottom: clamp(10px, 2vh, 16px) !important;
    }
    
    .hero-subtitle {
      font-size: clamp(0.9rem, 2.8vw, 1.1rem) !important;
      margin-bottom: clamp(18px, 3.5vh, 30px) !important;
    }
    
    .login-button {
      padding: clamp(6px, 1.5vw, 10px) clamp(10px, 2.5vw, 16px) !important;
      font-size: clamp(0.75rem, 2vw, 0.9rem) !important;
    }
    
    .modern-search-input {
      padding-left: clamp(35px, 8vw, 45px) !important;
    }
    
    .search-icon {
      left: clamp(10px, 2.5vw, 14px) !important;
      font-size: clamp(14px, 3vw, 18px) !important;
    }
  }

  /* Landscape Orientation */
  @media (max-height: 600px) and (orientation: landscape) {
    .hero-section {
      padding: clamp(15px, 3vh, 30px) clamp(1rem, 3vw, 2rem) !important;
    }
    
    .hero-content {
      gap: clamp(20px, 3vh, 35px) !important;
    }
  }
  
  .modern-product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  }
  
  .modern-product-card:hover .product-image {
    transform: scale(1.02);
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
  
  .quick-clear-btn:hover {
    background: #fee2e2 !important;
    color: #dc2626 !important;
  }
  
  .products-profile-menu .profile-dropdown {
    animation: fadeInDown 0.3s ease-out;
  }
  
  .products-profile-menu .profile-trigger:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15)) !important;
    border-color: rgba(255,255,255,0.5) !important;
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
  
  .products-profile-menu .dropdown-item:hover {
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0) !important;
    transform: translateX(4px) !important;
  }
  
  .products-profile-menu .dropdown-item:hover .item-icon {
    transform: scale(1.1);
    color: #667eea;
  }
  
  .products-profile-menu .logout-item:hover {
    background: linear-gradient(135deg, #fef2f2, #fee2e2) !important;
  }
  
  .products-profile-menu .profile-trigger:hover .dropdown-arrow {
    transform: scale(1.1);
    color: rgba(255,255,255,1) !important;
  }
  
  .products-profile-menu .dropdown-item:hover .arrow-right {
    opacity: 1 !important;
    transform: translateX(4px);
  }
  
  .login-button:hover {
    background-color: rgba(255,255,255,0.2) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255,255,255,0.1);
  }
  
  .back-to-home-button:hover {
    background: rgba(255,255,255,0.25) !important;
    border-color: rgba(255,255,255,0.5) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  .primary-cta:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(96,165,250,0.45); }
  .secondary-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 20px rgba(255,255,255,0.25); }
  
  /* Touch Device Optimizations */
  @media (hover: none) and (pointer: coarse) {
    .action-btn:hover {
      background-color: initial !important;
      transform: none !important;
    }
    
    .action-btn:active {
      background-color: #f1f5f9 !important;
      transform: scale(0.98) !important;
    }
    
    .modern-product-card:hover {
      transform: none !important;
    }
    
    .modern-product-card:active {
      transform: scale(0.98) !important;
    }
  }
  
  /* Dropdown animations */
  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Sort option hover effects */
  .sort-option:hover:not(.sort-option:has(.checkIcon)) {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
    color: #374151 !important;
  }

  .sort-option:hover .sort-option-description {
    opacity: 1 !important;
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