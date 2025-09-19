import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, products, removeFromCart, clearCart, placeOrder } = useStore();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const items = cart.map((ci) => {
    const p = products.find((p) => p.id === ci.id);
    return { ...p, qty: ci.qty, lineTotal: ci.qty * p.price };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onPlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      const order = placeOrder();
      if (order) {
        setOrderSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
      setProcessing(false);
    }, 2000);
  };

  if (orderSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>🎉</div>
          <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
          <p style={styles.successText}>
            Thank you for choosing KandyPack! Your packaging order has been confirmed and will be processed shortly.
          </p>
          <div style={styles.successAnimation}>
            <div style={styles.checkmark}>✓</div>
          </div>
          <p style={styles.redirectText}>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Complete Your Order</h1>
        <div style={styles.breadcrumb}>
          <Link to="/products" style={styles.breadcrumbLink}>Packaging Catalog</Link>
          <span style={styles.breadcrumbSeparator}>→</span>
          <span style={styles.breadcrumbCurrent}>Checkout</span>
        </div>
      </div>

      <div style={styles.content}>
        {/* Cart Empty State */}
        {items.length === 0 ? (
          <div style={styles.emptyCart}>
            <div style={styles.emptyIcon}>🛒</div>
            <h2 style={styles.emptyTitle}>Your cart is empty</h2>
            <p style={styles.emptyText}>Add packaging supplies to your cart to continue</p>
            <Link to="/products" style={styles.continueShoppingBtn}>
              Browse Packaging Catalog
            </Link>
          </div>
        ) : (
          <div style={styles.checkoutGrid}>
            {/* Cart Items */}
            <div style={styles.cartSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Order Summary</h3>
                <span style={styles.itemCount}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
              </div>

              <div style={styles.itemsList}>
                {items.map((item) => (
                  <div key={item.id} style={styles.cartItem}>
                    <div style={styles.itemImage}>
                      <img 
                        src={`https://via.placeholder.com/80x80/4facfe/ffffff?text=${encodeURIComponent(item.title.split(' ')[0])}`}
                        alt={item.title}
                        style={styles.itemImg}
                      />
                    </div>
                    <div style={styles.itemDetails}>
                      <h4 style={styles.itemTitle}>{item.title}</h4>
                      <p style={styles.itemCategory}>{item.category}</p>
                      <div style={styles.itemQuantity}>
                        <span>Quantity: {item.qty}</span>
                        <span style={styles.itemPrice}>${item.price.toFixed(2)} each</span>
                      </div>
                    </div>
                    <div style={styles.itemActions}>
                      <div style={styles.itemTotal}>${item.lineTotal.toFixed(2)}</div>
                      <button 
                        style={styles.removeBtn} 
                        onClick={() => removeFromCart(item.id)}
                        disabled={processing}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                style={styles.clearCartBtn} 
                onClick={clearCart}
                disabled={processing}
              >
                Clear Cart
              </button>
            </div>

            {/* Order Total & Actions */}
            <div style={styles.summarySection}>
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Payment Summary</h3>
                
                <div style={styles.summaryLine}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div style={styles.summaryLine}>
                  <span>Shipping</span>
                  <span style={shipping === 0 ? styles.freeShipping : {}}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div style={styles.summaryLine}>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div style={styles.summaryDivider}></div>
                
                <div style={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {subtotal < 100 && (
                  <div style={styles.shippingNotice}>
                    💡 Add ${(100 - subtotal).toFixed(2)} more for free express shipping!
                  </div>
                )}

                {!user && (
                  <div style={styles.loginNotice}>
                    <span style={styles.loginIcon}>🔒</span>
                    <div>
                      <p style={styles.loginText}>Please sign in to continue</p>
                      <Link to="/login" style={styles.loginBtn}>Sign In</Link>
                    </div>
                  </div>
                )}

                <button 
                  style={{
                    ...styles.placeOrderBtn,
                    ...((!user || processing) ? styles.placeOrderBtnDisabled : {})
                  }}
                  onClick={onPlaceOrder}
                  disabled={!user || processing}
                >
                  {processing ? (
                    <>
                      <span style={styles.spinner}></span>
                      Processing Your Order...
                    </>
                  ) : (
                    <>
                      <span style={styles.orderIcon}>🛍️</span>
                      Place Order
                    </>
                  )}
                </button>

                <div style={styles.securityBadges}>
                  <span style={styles.securityBadge}>🔒 Secure Checkout</span>
                  <span style={styles.securityBadge}>✅ SSL Protected</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: 0.9,
  },
  breadcrumbLink: {
    color: 'white',
    textDecoration: 'none',
  },
  breadcrumbSeparator: {
    opacity: 0.7,
  },
  breadcrumbCurrent: {
    fontWeight: '600',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  emptyCart: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    margin: '0 0 12px 0',
  },
  emptyText: {
    color: '#718096',
    marginBottom: '24px',
  },
  continueShoppingBtn: {
    display: 'inline-block',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
  },
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
  },
  cartSection: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#2d3748',
    margin: 0,
  },
  itemCount: {
    color: '#718096',
    fontSize: '14px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '24px',
  },
  cartItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    border: '2px solid #f7fafc',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  itemImage: {
    flexShrink: 0,
  },
  itemImg: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '1rem',
    color: '#2d3748',
    margin: '0 0 4px 0',
  },
  itemCategory: {
    color: '#718096',
    fontSize: '14px',
    margin: '0 0 8px 0',
  },
  itemQuantity: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#4a5568',
  },
  itemPrice: {
    fontWeight: '600',
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
  itemTotal: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#e53e3e',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  },
  clearCartBtn: {
    padding: '10px 20px',
    background: '#fed7d7',
    color: '#c53030',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  summarySection: {
    alignSelf: 'flex-start',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: '20px',
  },
  summaryTitle: {
    fontSize: '1.3rem',
    color: '#2d3748',
    margin: '0 0 24px 0',
  },
  summaryLine: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    color: '#4a5568',
  },
  freeShipping: {
    color: '#38a169',
    fontWeight: '600',
  },
  summaryDivider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '16px 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '16px',
  },
  shippingNotice: {
    backgroundColor: '#bee3f8',
    color: '#2b6cb0',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '16px',
  },
  loginNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#fef5e7',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  loginIcon: {
    fontSize: '24px',
  },
  loginText: {
    color: '#744210',
    margin: '0 0 8px 0',
    fontSize: '14px',
  },
  loginBtn: {
    color: '#d69e2e',
    textDecoration: 'none',
    fontWeight: '600',
  },
  placeOrderBtn: {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
    transition: 'all 0.2s ease',
  },
  placeOrderBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  orderIcon: {
    fontSize: '18px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  securityBadges: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '8px',
  },
  securityBadge: {
    fontSize: '12px',
    color: '#718096',
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '100px auto',
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '24px',
  },
  successTitle: {
    fontSize: '1.8rem',
    color: '#2d3748',
    margin: '0 0 16px 0',
  },
  successText: {
    color: '#718096',
    marginBottom: '32px',
    lineHeight: 1.6,
  },
  successAnimation: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  checkmark: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    animation: 'checkmarkPulse 1.5s ease-in-out infinite',
  },
  redirectText: {
    color: '#718096',
    fontSize: '14px',
    margin: 0,
  },
};

export default Checkout;
