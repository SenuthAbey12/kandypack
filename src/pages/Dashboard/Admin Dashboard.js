import React from 'react';
import './Admin Dashboard.css';

export default function AdminOverview() {
	return (
		<div className="admin-page">
			<header className="admin-header">
				<h1>Admin Overview</h1>
				<p className="subtitle">Manage users, settings, and system health at a glance.</p>
			</header>

			<section className="kpi-grid">
				<div className="kpi-card">
					<div className="kpi-value">42</div>
					<div className="kpi-label">Active Users</div>
				</div>
				<div className="kpi-card">
					<div className="kpi-value">7</div>
					<div className="kpi-label">Pending Invites</div>
				</div>
				<div className="kpi-card">
					<div className="kpi-value">3</div>
					<div className="kpi-label">Open Alerts</div>
				</div>
				<div className="kpi-card">
					<div className="kpi-value">99.9%</div>
					<div className="kpi-label">Uptime (7d)</div>
				</div>
			</section>

			<section className="admin-panels">
				<div className="panel">
					<h3>Quick Actions</h3>
					<div className="actions">
						<button className="action-btn">Invite User</button>
						<button className="action-btn">Create Role</button>
						<button className="action-btn">Backup Now</button>
					</div>
				</div>
				<div className="panel">
					<h3>Admin Modules</h3>
					<ul className="links">
						<li><a href="/admin/users">Users & Roles</a></li>
						<li><a href="/admin/settings">Organization Settings</a></li>
						<li><a href="/admin/integrations">Integrations</a></li>
						<li><a href="/admin/master-data">Master Data</a></li>
					</ul>
				</div>
			</section>
		</div>
	);
}

