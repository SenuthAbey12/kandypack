import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    darkMode: theme === 'dark',
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    smsNotifications: false,
    language: 'en',
    currency: 'USD',
    autoLogout: '30'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Special handling for dark mode
    if (setting === 'darkMode') {
      toggleTheme();
    }
  };

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would typically make an API call to save settings
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      darkMode: false,
      emailNotifications: true,
      orderUpdates: true,
      marketingEmails: false,
      smsNotifications: false,
      language: 'en',
      currency: 'USD',
      autoLogout: '30'
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={handleBack}>
            ← Back
          </button>
          <h1 style={styles.title}>Settings</h1>
          <div></div>
        </div>

        <div style={styles.settingsContainer}>
          <div style={styles.settingsGlow}></div>
          
          {success && (
            <div style={styles.successMessage}>
              ✅ Settings saved successfully!
            </div>
          )}

          {/* Appearance Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🎨</span>
              Appearance
            </h2>
            <div style={styles.settingItem}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Dark Mode</span>
                <span style={styles.settingDescription}>Enable dark theme for better viewing in low light</span>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                  style={styles.toggleInput}
                />
                <span style={styles.toggleSlider}></span>
              </label>
            </div>
          </div>

          {/* Notifications Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🔔</span>
              Notifications
            </h2>
            <div style={styles.settingItem}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Email Notifications</span>
                <span style={styles.settingDescription}>Receive notifications via email</span>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  style={styles.toggleInput}
                />
                <span style={styles.toggleSlider}></span>
              </label>
            </div>
            <div style={styles.settingItem}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Order Updates</span>
                <span style={styles.settingDescription}>Get notified about order status changes</span>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.orderUpdates}
                  onChange={() => handleToggle('orderUpdates')}
                  style={styles.toggleInput}
                />
                <span style={styles.toggleSlider}></span>
              </label>
            </div>
            <div style={styles.settingItem}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Marketing Emails</span>
                <span style={styles.settingDescription}>Receive promotional emails and offers</span>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={() => handleToggle('marketingEmails')}
                  style={styles.toggleInput}
                />
                <span style={styles.toggleSlider}></span>
              </label>
            </div>
            <div style={styles.settingItem}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>SMS Notifications</span>
                <span style={styles.settingDescription}>Receive SMS updates for urgent notifications</span>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                  style={styles.toggleInput}
                />
                <span style={styles.toggleSlider}></span>
              </label>
            </div>
          </div>

          {/* Preferences Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>⚙️</span>
              Preferences
            </h2>
            <div style={styles.settingItem}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Language</span>
                <span style={styles.settingDescription}>Choose your preferred language</span>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                style={styles.select}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div style={styles.settingItem}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Currency</span>
                <span style={styles.settingDescription}>Select your preferred currency</span>
              </div>
              <select
                value={settings.currency}
                onChange={(e) => handleSelectChange('currency', e.target.value)}
                style={styles.select}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>

          {/* Security Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🔒</span>
              Security
            </h2>
            <div style={styles.settingItem}>
              <div style={styles.settingInfo}>
                <span style={styles.settingLabel}>Auto Logout</span>
                <span style={styles.settingDescription}>Automatically log out after inactivity</span>
              </div>
              <select
                value={settings.autoLogout}
                onChange={(e) => handleSelectChange('autoLogout', e.target.value)}
                style={styles.select}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="never">Never</option>
              </select>
            </div>
            <div style={styles.dangerZone}>
              <h3 style={styles.dangerTitle}>Danger Zone</h3>
              <button style={styles.dangerBtn} onClick={logout}>
                🚪 Logout from All Devices
              </button>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              style={styles.resetBtn}
              onClick={handleResetSettings}
              disabled={loading}
            >
              Reset to Defaults
            </button>
            <button
              style={{
                ...styles.saveBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflowX: 'hidden'
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
    `,
    pointerEvents: 'none'
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px'
  },
  backBtn: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '8px 16px',
    color: 'var(--text)',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--text)',
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  settingsContainer: {
    background: 'var(--card)',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid var(--border)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)'
  },
  settingsGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100px',
    background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%)',
    pointerEvents: 'none'
  },
  successMessage: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500'
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid var(--border)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  sectionIcon: {
    fontSize: '20px'
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid var(--border-light)'
  },
  settingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1
  },
  settingLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text)'
  },
  settingDescription: {
    fontSize: '12px',
    color: 'var(--muted)'
  },
  toggle: {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '24px'
  },
  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0
  },
  toggleSlider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--border)',
    transition: '0.3s',
    borderRadius: '24px',
    '::before': {
      position: 'absolute',
      content: '""',
      height: '18px',
      width: '18px',
      left: '3px',
      bottom: '3px',
      backgroundColor: 'white',
      transition: '0.3s',
      borderRadius: '50%'
    }
  },
  select: {
    padding: '8px 12px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: '14px',
    minWidth: '120px'
  },
  dangerZone: {
    marginTop: '24px',
    padding: '20px',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    background: 'rgba(239, 68, 68, 0.05)'
  },
  dangerTitle: {
    color: '#ef4444',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    margin: 0
  },
  dangerBtn: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid var(--border)'
  },
  resetBtn: {
    padding: '12px 24px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    background: 'var(--card)',
    color: 'var(--text)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  saveBtn: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  }
};

export default Settings;