import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Add CSS animations
const slideUpAnimation = `
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`;

// Inject CSS
if (!document.querySelector('#slide-up-animation')) {
  const style = document.createElement('style');
  style.id = 'slide-up-animation';
  style.textContent = slideUpAnimation;
  document.head.appendChild(style);
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Carousel images and content
  const carouselSlides = [
    {
      image: '/images/premium-packaging.svg',
      title: 'Rail & Road Distribution Solutions',
      subtitle: 'Specialized packaging for multi-modal supply chain transportation networks',
      accent: '#4facfe'
    },
    {
      image: '/images/fast-delivery.svg',
      title: 'Integrated Logistics Network',
      subtitle: 'Seamless rail and road connectivity for efficient supply chain distribution',
      accent: '#667eea'
    },
    {
      image: '/images/wholesale-prices.svg',
      title: 'Supply Chain Optimization',
      subtitle: 'Cost-effective packaging solutions for rail and road transportation',
      accent: '#f093fb'
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // Fade in animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <img src="/images/kandypack-logo.svg" alt="KandyPack" style={styles.logoIcon} />
            <span style={styles.logoText}>KandyPack</span>
          </div>
          <nav style={styles.nav}>
            <Link to="/products" style={styles.navLink}>Browse Products</Link>
            <Link to="/login" style={styles.navLink}>Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          {/* Left Side - Carousel */}
          <div style={styles.leftSide}>
            <div style={styles.carousel}>
              <div 
                style={{
                  ...styles.carouselContent,
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {carouselSlides.map((slide, index) => (
                  <div key={index} style={styles.slide}>
                    <div style={styles.slideImage}>
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        style={styles.slideImg}
                      />
                    </div>
                    <div style={styles.slideContent}>
                      <h2 style={{
                        ...styles.slideTitle,
                        color: slide.accent
                      }}>
                        {slide.title}
                      </h2>
                      <p style={styles.slideSubtitle}>
                        {slide.subtitle}
                      </p>
                      <div style={styles.slideActions}>
                        <Link 
                          to="/products" 
                          style={{
                            ...styles.primaryButton,
                            backgroundColor: slide.accent
                          }}
                        >
                          Browse Products
                        </Link>
                        <Link to="/login" style={styles.secondaryButton}>
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotional Banners */}
            <div style={styles.promoBanners}>
              <div style={styles.promoBanner}>
                <span style={styles.promoIcon}>🚂</span>
                <div style={styles.promoText}>
                  <span style={styles.promoTitle}>Rail Network Integration</span>
                  <span style={styles.promoDesc}>Efficient long-distance logistics</span>
                </div>
              </div>
              <div style={styles.promoBanner}>
                <span style={styles.promoIcon}>🚛</span>
                <div style={styles.promoText}>
                  <span style={styles.promoTitle}>Road Distribution</span>
                  <span style={styles.promoDesc}>Last-mile delivery solutions</span>
                </div>
              </div>
              <div style={styles.promoBanner}>
                <span style={styles.promoIcon}>📦</span>
                <div style={styles.promoText}>
                  <span style={styles.promoTitle}>Supply Chain Packaging</span>
                  <span style={styles.promoDesc}>Multi-modal transport ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Panel */}
          <div style={{
            ...styles.rightSide,
            ...(isVisible ? styles.rightSideVisible : {})
          }}>
            <div style={styles.authPanel}>
              <div style={styles.authHeader}>
                <h1 style={styles.authTitle}>KandyPack Distribution Hub</h1>
                <p style={styles.authSubtitle}>Rail & Road Supply Chain Solutions</p>
              </div>

              {/* Quick Actions */}
              <div style={styles.quickActions}>
                <Link to="/login" style={styles.actionLink}>
                  <div style={styles.primaryAction}>
                    <span style={styles.actionIcon}>🔐</span>
                    <div style={styles.actionContent}>
                      <span style={styles.actionTitle}>Sign In</span>
                      <span style={styles.actionDesc}>Access your account</span>
                    </div>
                    <span style={styles.actionArrow}>→</span>
                  </div>
                </Link>

                <Link to="/signup" style={styles.actionLink}>
                  <div style={styles.secondaryAction}>
                    <span style={styles.actionIcon}>👤</span>
                    <div style={styles.actionContent}>
                      <span style={styles.actionTitle}>Sign Up</span>
                      <span style={styles.actionDesc}>Create new account</span>
                    </div>
                    <span style={styles.actionArrow}>→</span>
                  </div>
                </Link>
              </div>

              {/* Feature Highlights */}
              <div style={styles.features}>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>📦</span>
                  <span style={styles.featureText}>Professional Packaging</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>🌍</span>
                  <span style={styles.featureText}>Worldwide Delivery</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>⭐</span>
                  <span style={styles.featureText}>Trusted Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>KandyPack Distribution</h4>
            <p style={styles.footerText}>
              Leading provider of specialized packaging solutions for rail and road supply chain networks.
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Services</h4>
            <Link to="/products" style={styles.footerLink}>Rail Logistics</Link>
            <Link to="/products" style={styles.footerLink}>Road Distribution</Link>
            <Link to="/products" style={styles.footerLink}>Supply Chain Solutions</Link>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Account</h4>
            <Link to="/login" style={styles.footerLink}>Sign In</Link>
            <Link to="/signup" style={styles.footerLink}>Sign Up</Link>
            <Link to="/dashboard" style={styles.footerLink}>Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#4f46e5',
    },
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '2rem 0',
  },
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '4rem',
    padding: '0 2rem',
    alignItems: 'center',
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  carousel: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    height: '400px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
  carouselContent: {
    display: 'flex',
    height: '100%',
    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slide: {
    minWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '3rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
  },
  slideImage: {
    flex: '0 0 40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImg: {
    width: '200px',
    height: '200px',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
  },
  slideContent: {
    flex: 1,
    color: 'white',
    paddingLeft: '2rem',
  },
  slideTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: '1.2',
  },
  slideSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.9,
    lineHeight: '1.5',
  },
  slideActions: {
    display: 'flex',
    gap: '1rem',
  },
  primaryButton: {
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  secondaryButton: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    border: '2px solid white',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'white',
      color: '#1e293b',
    },
  },
  promoBanners: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },
  promoBanner: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    },
  },
  promoIcon: {
    fontSize: '2rem',
  },
  promoText: {
    display: 'flex',
    flexDirection: 'column',
  },
  promoTitle: {
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem',
  },
  promoDesc: {
    fontSize: '0.875rem',
    color: '#64748b',
  },
  rightSide: {
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.8s ease-out',
  },
  rightSideVisible: {
    opacity: 1,
    transform: 'translateY(0)',
    animation: 'slideUp 0.8s ease-out',
  },
  authPanel: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  authTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  authSubtitle: {
    color: '#64748b',
    fontSize: '1.1rem',
  },
  quickActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  actionLink: {
    textDecoration: 'none',
  },
  primaryAction: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: '#4f46e5',
    borderRadius: '15px',
    color: 'white',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  secondaryAction: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '15px',
    color: '#1e293b',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  actionIcon: {
    fontSize: '1.5rem',
    marginRight: '1rem',
  },
  actionContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  actionTitle: {
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  actionDesc: {
    fontSize: '0.875rem',
    opacity: 0.8,
  },
  actionArrow: {
    fontSize: '1.2rem',
    marginLeft: '1rem',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
  },
  featureIcon: {
    fontSize: '1.5rem',
  },
  featureText: {
    color: '#1e293b',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: '3rem 0 2rem',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    padding: '0 2rem',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  footerTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: 'white',
  },
  footerText: {
    color: '#94a3b8',
    lineHeight: '1.6',
  },
  footerLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.2s',
    '&:hover': {
      color: 'white',
    },
  },
};