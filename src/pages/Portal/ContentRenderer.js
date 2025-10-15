import React from 'react';
import { useLocation } from 'react-router-dom';

import Overview from './AdminDashboardPages/Overview';
import Analytics from './AdminDashboardPages/Analytics';
import Fleet from './AdminDashboardPages/Fleet';
import Railway from './AdminDashboardPages/Railway';
import Routes from './AdminDashboardPages/Routes';
import Tracking from './AdminDashboardPages/Tracking';
import Shipments from './AdminDashboardPages/Shipments';
import Warehouses from './AdminDashboardPages/Warehouses';
import Inventory from './AdminDashboardPages/Inventory';
import Staff from './AdminDashboardPages/Staff';

const ContentRenderer = ({ handleNavigation, getPerformanceData, performancePeriod, setPerformancePeriod, getAnalyticsData, getRouteEfficiencyData, analyticsTimeframe, setAnalyticsTimeframe, analyticsView, setAnalyticsView }) => {
    const location = useLocation();

    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('analytics')) return 'analytics';
        if (path.includes('drivers')) return 'drivers';
        if (path.includes('railway')) return 'railway';
        if (path.includes('routes')) return 'routes';
        if (path.includes('tracking')) return 'tracking';
        if (path.includes('orders')) return 'orders';
        if (path.includes('warehouses')) return 'warehouses';
        if (path.includes('inventory')) return 'inventory';
        if (path.includes('assistants')) return 'assistants';
        return 'overview';
    };

    const activeTab = getActiveTab();

    switch (activeTab) {
        case 'overview':
            return <Overview handleNavigation={handleNavigation} getPerformanceData={getPerformanceData} performancePeriod={performancePeriod} setPerformancePeriod={setPerformancePeriod} />;
        case 'analytics':
            return <Analytics getAnalyticsData={getAnalyticsData} getRouteEfficiencyData={getRouteEfficiencyData} analyticsTimeframe={analyticsTimeframe} setAnalyticsTimeframe={setAnalyticsTimeframe} analyticsView={analyticsView} setAnalyticsView={setAnalyticsView} />;
        case 'drivers':
            return <Fleet />;
        case 'railway':
            return <Railway />;
        case 'routes':
            return <Routes />;
        case 'tracking':
            return <Tracking />;
        case 'orders':
            return <Shipments />;
        case 'warehouses':
            return <Warehouses />;
        case 'inventory':
            return <Inventory />;
        case 'assistants':
            return <Staff />;
        default:
            return <Overview handleNavigation={handleNavigation} getPerformanceData={getPerformanceData} performancePeriod={performancePeriod} setPerformancePeriod={setPerformancePeriod} />;
    }
};

export default ContentRenderer;
