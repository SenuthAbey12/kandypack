import React, { useState } from 'react';

const AdminSupport = () => {
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([
    { id: 'SUP-1001', subject: 'Driver onboarding help', status: 'open' },
    { id: 'SUP-1002', subject: 'Order import issue', status: 'resolved' },
  ]);

  const submitTicket = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setTickets(prev => [{ id: `SUP-${Date.now()}`, subject: message.trim(), status: 'open' }, ...prev]);
    setMessage('');
    alert('Support ticket submitted (demo)');
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Help & Support</h1>

      <section style={styles.card}>
        <h2 style={styles.h2}>Create Support Ticket</h2>
        <form onSubmit={submitTicket}>
          <textarea style={styles.textarea} rows={4} placeholder="Describe your issue or question…" value={message} onChange={(e) => setMessage(e.target.value)} />
          <div style={styles.actions}>
            <button type="submit" style={styles.primary}>Submit Ticket</button>
          </div>
        </form>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>Recent Tickets</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {tickets.map(t => (
            <div key={t.id} style={styles.ticketRow}>
              <span className="mono">{t.id}</span>
              <span>{t.subject}</span>
              <span style={t.status === 'open' ? styles.badgeOpen : styles.badgeResolved}>{t.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>Contact</h2>
        <p>Email: support@kandypack.lk • Phone: +94 11 234 5678</p>
      </section>
    </div>
  );
};

const styles = {
  page: { padding: 24 },
  h1: { margin: '0 0 16px 0' },
  h2: { margin: '0 0 12px 0' },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16, marginBottom: 16 },
  textarea: { width: '100%', resize: 'vertical', padding: 10, borderRadius: 8, border: '1px solid #ddd' },
  actions: { marginTop: 8 },
  primary: { background: '#2563eb', color: '#fff', border: 0, padding: '10px 16px', borderRadius: 8, cursor: 'pointer' },
  ticketRow: { display: 'grid', gridTemplateColumns: '140px 1fr 120px', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9' },
  badgeOpen: { background: '#fde68a', color: '#92400e', padding: '4px 8px', borderRadius: 999, textTransform: 'capitalize', justifySelf: 'start' },
  badgeResolved: { background: '#bbf7d0', color: '#065f46', padding: '4px 8px', borderRadius: 999, textTransform: 'capitalize', justifySelf: 'start' },
};

export default AdminSupport;
