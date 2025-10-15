const express = require('express');
const router = express.Router();
const db = require('../config/database');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics for the overview page
// @access  Private (should be protected by auth middleware)
router.get('/stats', async (req, res) => {
    try {
        // Execute all count queries in parallel for efficiency
        const [
            [totalOrders],
            [totalDrivers],
            [totalAssistants],
            [totalCustomers],
            [pendingOrders],
            [completedToday],
            [totalVehicles],
            [railShipments],
            [roadShipments]
        ] = await Promise.all([
            db.query("SELECT COUNT(*) as count FROM orders"),
            db.query("SELECT COUNT(*) as count FROM driver"),
            db.query("SELECT COUNT(*) as count FROM assistant"),
            db.query("SELECT COUNT(*) as count FROM customer"),
            db.query("SELECT COUNT(*) as count FROM orders WHERE order_status = 'Pending'"),
            db.query("SELECT COUNT(*) as count FROM orders WHERE order_status = 'Delivered' AND DATE(order_date) = CURDATE()"),
            db.query("SELECT COUNT(*) as count FROM truck"),
            db.query("SELECT COUNT(*) as count FROM train_shipments"),
            db.query("SELECT COUNT(*) as count FROM truck_deliveries")
        ]);

        // Note: Some stats like revenue, deliveryRate, etc., require more complex logic or data 
        // that may not be available yet. They are set to 0 for now.
        const stats = {
            totalOrders: totalOrders.count,
            totalDrivers: totalDrivers.count,
            totalAssistants: totalAssistants.count,
            totalCustomers: totalCustomers.count,
            pendingOrders: pendingOrders.count,
            completedToday: completedToday.count,
            totalVehicles: totalVehicles.count,
            railShipments: railShipments.count,
            roadShipments: roadShipments.count,
            revenue: 0, // Placeholder
            deliveryRate: 0, // Placeholder
            warehouseUtilization: 0, // Placeholder
            fuelEfficiency: 0, // Placeholder
            averageDeliveryTime: 0, // Placeholder
            customerSatisfaction: 0, // Placeholder
            inventoryTurnover: 0, // Placeholder
            costPerMile: 0, // Placeholder
            activeRoutes: 0 // Placeholder
        };

        res.json(stats);

    } catch (err) {
        console.error('Error fetching dashboard stats:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/analytics
// @desc    Get data for the analytics page
// @access  Private
router.get('/analytics', async (req, res) => {
    try {
        const { timeframe = 'month' } = req.query; 

        const [[{ deliveryRate }]] = await db.query("SELECT (SUM(CASE WHEN order_status = 'Delivered' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as deliveryRate FROM orders");
        const [[{ fleetUtilization }]] = await db.query("SELECT (SUM(CASE WHEN status = 'on-duty' OR status = 'en-route' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as fleetUtilization FROM driver");
        const [[{ costPerMile }]] = await db.query("SELECT AVG(cost_per_mile) as costPerMile FROM routes");
        const [[{ inventoryTurnover }]] = await db.query("SELECT AVG(turnover_rate) as inventoryTurnover FROM inventory_turnover");

        const analyticsData = {
            deliveryRate: Math.round(deliveryRate),
            fleetUtilization: Math.round(fleetUtilization),
            costPerMile: Math.round(costPerMile),
            inventoryTurnover: Math.round(inventoryTurnover),
            trends: { delivery: '+5.8%', fleet: '+2.3%', cost: '+1.2%', inventory: '+12.4%' } // These are still mock
        };

        const [routeEfficiencyData] = await db.query("SELECT name as route, on_time_performance as efficiency, '+2.5%' as trend, CASE WHEN on_time_performance > 90 THEN 'excellent' ELSE 'good' END as status FROM routes");

        res.json({
            analyticsData: analyticsData,
            routeEfficiencyData: routeEfficiencyData
        });

    } catch (err) {
        console.error('Error fetching analytics data:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/fleet
// @desc    Get all fleet and driver data
// @access  Private
router.get('/fleet', async (req, res) => {
    try {
        const [drivers] = await db.query(`
            SELECT 
                d.driver_id as id, 
                d.name, 
                d.phone_no as license, 
                t.plate_no as vehicle, 
                t.type, 
                d.status, 
                d.current_location as location, 
                d.rating,
                0 as orders,
                t.fuel_level as fuelLevel,
                t.last_maintenance as lastMaintenance
            FROM driver d 
            LEFT JOIN truck t ON d.assigned_vehicle_id = t.truck_id
        `);

        const [totalVehicles] = await db.query("SELECT COUNT(*) as count FROM truck");
        const [totalDrivers] = await db.query("SELECT COUNT(*) as count FROM driver");

        const stats = {
            totalVehicles: totalVehicles.count,
            totalDrivers: totalDrivers.count,
        };

        res.json({ drivers, stats });

    } catch (err) {
        console.error('Error fetching fleet data:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/railway
// @desc    Get all railway data
// @access  Private
router.get('/railway', async (req, res) => {
    try {
        const [operators] = await db.query(`
            SELECT 
                d.driver_id as id, 
                d.name, 
                d.license_no as license, 
                t.plate_no as vehicle, 
                'rail' as type, 
                d.status, 
                d.current_location as location, 
                d.rating,
                (SELECT COUNT(*) FROM train_shipments WHERE operator_id = d.driver_id) as orders,
                t.fuel_level as fuelLevel,
                t.last_maintenance as lastMaintenance
            FROM driver d 
            JOIN truck t ON d.assigned_vehicle_id = t.truck_id
            WHERE t.type = 'rail'
        `);

        const [[totalEngines]] = await db.query("SELECT COUNT(*) as count FROM truck WHERE type = 'rail'");
        const [[totalOperators]] = await db.query("SELECT COUNT(*) as count FROM driver WHERE role = 'rail_operator'");
        const [[totalRailShipments]] = await db.query("SELECT COUNT(*) as count FROM train_shipments");

        const stats = {
            totalEngines: totalEngines.count,
            totalOperators: totalOperators.count,
            railShipments: totalRailShipments.count,
        };

        res.json({ operators, stats });

    } catch (err) {
        console.error('Error fetching railway data:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/routes
// @desc    Get all routes data
// @access  Private
router.get('/routes', async (req, res) => {
    try {
        const [routes] = await db.query("SELECT route_id as id, name, start_location as start, end_location as end, distance, status, type, on_time_performance as performance, (SELECT COUNT(*) FROM truck_deliveries WHERE route_id = routes.route_id) as vehicles FROM routes");
        
        const [[{ totalRoutes }]] = await db.query("SELECT COUNT(*) as totalRoutes FROM routes");
        const [[{ activeRoutes }]] = await db.query("SELECT COUNT(*) as activeRoutes FROM routes WHERE status = 'active'");
        const [[{ routesWithIssues }]] = await db.query("SELECT COUNT(*) as routesWithIssues FROM routes WHERE status = 'issue'");
        const [[{ vehiclesAssigned }]] = await db.query("SELECT COUNT(DISTINCT vehicle_id) as vehiclesAssigned FROM truck_deliveries");
        const [[{ onTimePerformance }]] = await db.query("SELECT AVG(on_time_performance) as onTimePerformance FROM routes");

        const stats = {
            totalRoutes,
            activeRoutes,
            routesWithIssues,
            vehiclesAssigned,
            onTimePerformance: Math.round(onTimePerformance),
        };

        res.json({ routes, stats });

    } catch (err) {
        console.error('Error fetching routes data:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/tracking
// @desc    Get live tracking data
// @access  Private
router.get('/tracking', async (req, res) => {
    try {
        const [liveTracking] = await db.query(`
            SELECT 
                td.delivery_id as id,
                d.name as driver,
                t.plate_no as vehicleId,
                td.order_id as orderId,
                t.speed,
                td.status,
                td.last_updated as lastUpdate,
                td.current_location as location
            FROM truck_deliveries td
            JOIN driver d ON td.driver_id = d.driver_id
            JOIN truck t ON td.vehicle_id = t.truck_id
            WHERE td.status = 'in_transit'
        `);

        // The location is stored as a string 'lat,lng', so we need to parse it.
        const formattedTracking = liveTracking.map(item => ({
            ...item,
            location: {
                lat: parseFloat(item.location.split(',')[0]),
                lng: parseFloat(item.location.split(',')[1])
            }
        }));

        res.json({ liveTracking: formattedTracking });

    } catch (err) {
        console.error('Error fetching tracking data:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/shipments
// @desc    Get all shipment/order data
// @access  Private
router.get('/shipments', async (req, res) => {
    try {
        const [shipments] = await db.query(`
            SELECT 
                o.order_id as orderId, 
                c.name as customer, 
                o.order_date as date, 
                o.total_amount as amount, 
                o.status 
            FROM orders o
            JOIN customer c ON o.customer_id = c.customer_id
            ORDER BY o.order_date DESC
        `);

        res.json({ shipments });

    } catch (err) {
        console.error('Error fetching shipments data:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/warehouses
// @desc    Get all warehouse data
// @access  Private
router.get('/warehouses', async (req, res) => {
    try {
        const [warehouses] = await db.query("SELECT warehouse_id as id, name, location, capacity, utilization, status FROM warehouses");

        const [[{ totalWarehouses }]] = await db.query("SELECT COUNT(*) as totalWarehouses FROM warehouses");
        const [[{ totalCapacity }]] = await db.query("SELECT SUM(capacity) as totalCapacity FROM warehouses");
        const [[{ avgUtilization }]] = await db.query("SELECT AVG(utilization) as avgUtilization FROM warehouses");

        const stats = {
            totalWarehouses,
            totalCapacity,
            avgUtilization: Math.round(avgUtilization),
        };

        res.json({ warehouses, stats });

    } catch (err) {
        console.error('Error fetching warehouses data:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/inventory
// @desc    Get all inventory data
// @access  Private
router.get('/inventory', async (req, res) => {
    try {
        const [inventory] = await db.query("SELECT item_id as id, sku, name, category, stock_level as stock, status FROM inventory");

        const [[{ totalItems }]] = await db.query("SELECT COUNT(*) as totalItems FROM inventory");
        const [[{ lowStockItems }]] = await db.query("SELECT COUNT(*) as lowStockItems FROM inventory WHERE status = 'low-stock'");
        const [[{ outOfStockItems }]] = await db.query("SELECT COUNT(*) as outOfStockItems FROM inventory WHERE status = 'out-of-stock'");

        const stats = {
            totalItems,
            lowStockItems,
            outOfStockItems,
        };

        res.json({ inventory, stats });

    } catch (err) {
        console.error('Error fetching inventory data:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/staff
// @desc    Get all staff/assistant data
// @access  Private
router.get('/staff', async (req, res) => {
    try {
        const [staff] = await db.query("SELECT assistant_id as id, name, role, contact_no as contact, status FROM assistant");

        const [[{ totalStaff }]] = await db.query("SELECT COUNT(*) as totalStaff FROM assistant");
        const [[{ activeStaff }]] = await db.query("SELECT COUNT(*) as activeStaff FROM assistant WHERE status = 'active'");
        const [[{ onLeaveStaff }]] = await db.query("SELECT COUNT(*) as onLeaveStaff FROM assistant WHERE status = 'on-leave'");

        const stats = {
            totalStaff,
            activeStaff,
            onLeaveStaff,
        };

        res.json({ staff, stats });

    } catch (err) {
        console.error('Error fetching staff data:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
