import React, { useState } from 'react';

const AdminSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    system: true,
  });
  const [preferences, setPreferences] = useState({
    theme: 'light',
    defaultTab: 'overview',
    autoRefresh: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved (demo)');
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>System Settings</h1>

      <form onSubmit={handleSave} style={styles.form}>
        <section style={styles.card}>
          <h2 style={styles.h2}>Notifications</h2>
          <label style={styles.row}>
            <input type="checkbox" checked={notifications.email} onChange={e => setNotifications(p => ({...p, email: e.target.checked}))} />
            <span>Email alerts</span>
          </label>
          <label style={styles.row}>
            <input type="checkbox" checked={notifications.sms} onChange={e => setNotifications(p => ({...p, sms: e.target.checked}))} />
            <span>SMS alerts</span>
          </label>
          <label style={styles.row}>
            <input type="checkbox" checked={notifications.system} onChange={e => setNotifications(p => ({...p, system: e.target.checked}))} />
            <span>In-app notifications</span>
          </label>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>Preferences</h2>
          <label style={styles.row}>
            <span>Theme</span>
            <select value={preferences.theme} onChange={e => setPreferences(p => ({...p, theme: e.target.value}))}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label style={styles.row}>
            <span>Default Admin Tab</span>
            <select value={preferences.defaultTab} onChange={e => setPreferences(p => ({...p, defaultTab: e.target.value}))}>
              <option value="overview">Overview</option>
              <option value="drivers">Drivers</option>
              <option value="orders">Orders</option>
              <option value="assistants">Assistants</option>
            </select>
          </label>
          <label style={styles.row}>
            <span>Auto Refresh</span>
            <input type="checkbox" checked={preferences.autoRefresh} onChange={e => setPreferences(p => ({...p, autoRefresh: e.target.checked}))} />
          </label>
        </section>

        <div style={styles.actions}>
          <button type="submit" style={styles.primary}>Save Settings</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  page: { padding: 24 },
  h1: { margin: '0 0 16px 0' },
  h2: { margin: '0 0 12px 0' },
  form: { display: 'grid', gap: 16, maxWidth: 720 },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16 },
  row: { display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', padding: '8px 0' },
  actions: { marginTop: 8 },
  primary: { background: '#2563eb', color: '#fff', border: 0, padding: '10px 16px', borderRadius: 8, cursor: 'pointer' },
};

export default AdminSettings;
