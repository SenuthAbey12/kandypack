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
            db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'"),
            db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Delivered' AND DATE(updated_at) = CURDATE()"),
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
        const { timeframe = 'month' } = req.query; // Default to 'month'

        // In a real application, these values would be calculated with complex SQL queries
        // based on the provided timeframe. For this example, we'll return mock data
        // that simulates the kind of data structure the frontend expects.
        
        const analyticsData = {
            week: {
                deliveryRate: 94.2,
                fleetUtilization: 82.5,
                costPerMile: 2.35,
                inventoryTurnover: 6.8,
                trends: { delivery: '+3.2%', fleet: '+5.8%', cost: '-2.1%', inventory: '+8.5%' }
            },
            month: {
                deliveryRate: 96.5,
                fleetUtilization: 78.5,
                costPerMile: 2.45,
                inventoryTurnover: 8.2,
                trends: { delivery: '+5.8%', fleet: '+2.3%', cost: '+1.2%', inventory: '+12.4%' }
            },
            quarter: {
                deliveryRate: 95.8,
                fleetUtilization: 85.2,
                costPerMile: 2.28,
                inventoryTurnover: 9.1,
                trends: { delivery: '+8.5%', fleet: '+7.2%', cost: '-5.3%', inventory: '+18.7%' }
            }
        };

        const routeEfficiencyData = [
            { route: 'Colombo-Kandy', efficiency: 94, trend: '+2.5%', status: 'excellent' },
            { route: 'Kandy-Galle', efficiency: 78, trend: '-1.2%', status: 'good' },
            { route: 'Main Railway', efficiency: 96, trend: '+4.1%', status: 'excellent' },
            { route: 'Coast Railway', efficiency: 92, trend: '+1.8%', status: 'excellent' },
            { route: 'Colombo-Jaffna', efficiency: 85, trend: '+0.5%', status: 'good' }
        ];

        res.json({
            analyticsData: analyticsData[timeframe] || analyticsData.month,
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
        // Using placeholder data as the database schema is not fully aligned with frontend expectations.
        // In a real-world scenario, you would build complex SQL queries here.
        const drivers = [
            { id: 1, name: 'Nimal Silva', license: 'DL12345', vehicle: 'Lorry - CAB-1234', type: 'road', status: 'on-duty', location: 'Colombo 03', rating: 4.9, orders: 45, fuelLevel: 85, lastMaintenance: '2024-01-15' },
            { id: 2, name: 'Sunil Perera', license: 'DL67890', vehicle: 'Van - CAC-5678', type: 'road', status: 'en-route', location: 'Kandy', rating: 4.7, orders: 38, fuelLevel: 60, lastMaintenance: '2024-01-10' },
            { id: 3, name: 'Kamal Fernando', license: 'DL11223', vehicle: 'Truck - CAE-9101', type: 'road', status: 'available', location: 'Depot', rating: 4.8, orders: 52, fuelLevel: 95, lastMaintenance: '2024-01-20' },
            { id: 4, name: 'Ravi Mendis', license: 'DL44556', vehicle: 'Van - CAF-1122', type: 'road', status: 'break', location: 'Rest Area', rating: 4.6, orders: 33, fuelLevel: 40, lastMaintenance: '2024-01-08' },
            { id: 5, name: 'Chaminda Perera', license: 'DL77889', vehicle: 'Lorry - CAH-3344', type: 'road', status: 'on-duty', location: 'Galle', rating: 4.5, orders: 41, fuelLevel: 70, lastMaintenance: '2024-01-18' },
            { id: 6, name: 'Pradeep Jayawardene', license: 'RL55443', vehicle: 'Train Engine - TE-001', type: 'rail', status: 'scheduled', location: 'Colombo Fort Station', rating: 4.9, orders: 25, fuelLevel: 90, lastMaintenance: '2024-01-22' },
            { id: 7, name: 'Anil Gunasekara', license: 'RL66778', vehicle: 'Train Engine - TE-002', type: 'rail', status: 'en-route', location: 'Kandy Station', rating: 4.8, orders: 18, fuelLevel: 75, lastMaintenance: '2024-01-19' }
        ];

        const [totalVehicles] = await db.query("SELECT COUNT(*) as count FROM truck");
        const [totalDrivers] = await db.query("SELECT COUNT(*) as count FROM driver");

        const stats = {
            totalVehicles: totalVehicles[0].count,
            totalDrivers: totalDrivers[0].count,
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
        // Using placeholder data for operators, similar to the fleet endpoint.
        const allDrivers = [
            { id: 1, name: 'Nimal Silva', license: 'DL12345', vehicle: 'Lorry - CAB-1234', type: 'road', status: 'on-duty', location: 'Colombo 03', rating: 4.9, orders: 45, fuelLevel: 85, lastMaintenance: '2024-01-15' },
            { id: 2, name: 'Sunil Perera', license: 'DL67890', vehicle: 'Van - CAC-5678', type: 'road', status: 'en-route', location: 'Kandy', rating: 4.7, orders: 38, fuelLevel: 60, lastMaintenance: '2024-01-10' },
            { id: 3, name: 'Kamal Fernando', license: 'DL11223', vehicle: 'Truck - CAE-9101', type: 'road', status: 'available', location: 'Depot', rating: 4.8, orders: 52, fuelLevel: 95, lastMaintenance: '2024-01-20' },
            { id: 4, name: 'Ravi Mendis', license: 'DL44556', vehicle: 'Van - CAF-1122', type: 'road', status: 'break', location: 'Rest Area', rating: 4.6, orders: 33, fuelLevel: 40, lastMaintenance: '2024-01-08' },
            { id: 5, name: 'Chaminda Perera', license: 'DL77889', vehicle: 'Lorry - CAH-3344', type: 'road', status: 'on-duty', location: 'Galle', rating: 4.5, orders: 41, fuelLevel: 70, lastMaintenance: '2024-01-18' },
            { id: 6, name: 'Pradeep Jayawardene', license: 'RL55443', vehicle: 'Train Engine - TE-001', type: 'rail', status: 'scheduled', location: 'Colombo Fort Station', rating: 4.9, orders: 25, fuelLevel: 90, lastMaintenance: '2024-01-22' },
            { id: 7, name: 'Anil Gunasekara', license: 'RL66778', vehicle: 'Train Engine - TE-002', type: 'rail', status: 'en-route', location: 'Kandy Station', rating: 4.8, orders: 18, fuelLevel: 75, lastMaintenance: '2024-01-19' }
        ];

        const railwayOperators = allDrivers.filter(d => d.type === 'rail');

        // In a real scenario, these would be complex SQL queries targeting railway-specific tables.
        const [totalEngines] = await db.query("SELECT COUNT(*) as count FROM truck WHERE type = 'rail'"); // Assuming a 'type' column exists
        const [totalOperators] = await db.query("SELECT COUNT(*) as count FROM driver WHERE role = 'rail_operator'"); // Assuming a 'role' column
        const [totalRailShipments] = await db.query("SELECT COUNT(*) as count FROM orders WHERE transport_mode = 'rail'");


        const stats = {
            totalEngines: totalEngines[0] ? totalEngines[0].count : railwayOperators.length, // Fallback to mock data
            totalOperators: totalOperators[0] ? totalOperators[0].count : railwayOperators.length, // Fallback
            railShipments: totalRailShipments[0] ? totalRailShipments[0].count : 156, // Fallback
        };

        res.json({ operators: railwayOperators, stats });

    } catch (err) {
        console.error('Error fetching railway data:', err.message);
        // Provide fallback mock data on error to keep the frontend functional
        const fallbackOperators = [
            { id: 6, name: 'Pradeep Jayawardene', license: 'RL55443', vehicle: 'Train Engine - TE-001', type: 'rail', status: 'scheduled', location: 'Colombo Fort Station', rating: 4.9, orders: 25, fuelLevel: 90, lastMaintenance: '2024-01-22' },
            { id: 7, name: 'Anil Gunasekara', license: 'RL66778', vehicle: 'Train Engine - TE-002', type: 'rail', status: 'en-route', location: 'Kandy Station', rating: 4.8, orders: 18, fuelLevel: 75, lastMaintenance: '2024-01-19' }
        ];
        const fallbackStats = { totalEngines: 2, totalOperators: 2, railShipments: 156 };
        res.status(500).json({ operators: fallbackOperators, stats: fallbackStats, error: 'Server Error, fallback data provided.' });
    }
});

// @route   GET /api/dashboard/routes
// @desc    Get all routes data
// @access  Private
router.get('/routes', async (req, res) => {
    try {
        // Using placeholder data as the database schema for routes is not fully defined.
        const routes = [
            { id: 'R001', name: 'Colombo-Kandy', start: 'Colombo', end: 'Kandy', distance: '115 km', vehicles: 5, status: 'active', performance: 94 },
            { id: 'R002', name: 'Kandy-Galle', start: 'Kandy', end: 'Galle', distance: '220 km', vehicles: 3, status: 'active', performance: 85 },
            { id: 'R003', name: 'Colombo-Jaffna', start: 'Colombo', end: 'Jaffna', distance: '400 km', vehicles: 2, status: 'issue', performance: 72 },
            { id: 'R004', name: 'Main Railway Line', start: 'Colombo', end: 'Badulla', distance: '290 km', vehicles: 8, status: 'active', performance: 96, type: 'rail' },
            { id: 'R005', name: 'Coastal Line', start: 'Colombo', end: 'Matara', distance: '160 km', vehicles: 6, status: 'active', performance: 92, type: 'rail' },
            { id: 'R006', name: 'Local Delivery Zone 1', start: 'Depot A', end: 'Zone 1', distance: '45 km', vehicles: 12, status: 'active', performance: 98, type: 'road' },
        ];

        // In a real application, you would query the database.
        // const [routesFromDb] = await db.query("SELECT * FROM routes");
        
        const stats = {
            totalRoutes: routes.length,
            activeRoutes: routes.filter(r => r.status === 'active').length,
            routesWithIssues: routes.filter(r => r.status === 'issue').length,
            vehiclesAssigned: routes.reduce((sum, r) => sum + r.vehicles, 0),
            onTimePerformance: 87, // This would be a calculated metric
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
        // This is mock data. In a real system, this would come from a live GPS tracking service or a database that is frequently updated.
        const liveTracking = [
            { id: 1, driver: 'Sunil Perera', vehicleId: 'CAC-5678', orderId: 'KP1247TR', speed: '60 km/h', status: 'moving', lastUpdate: '1 min ago', location: { lat: 6.9271, lng: 79.8612 } },
            { id: 2, driver: 'Kamal Fernando', vehicleId: 'CAE-9101', orderId: 'KP1245TR', speed: '0 km/h', status: 'stopped', lastUpdate: '5 min ago', location: { lat: 7.2906, lng: 80.6337 } },
            { id: 3, driver: 'Chaminda Perera', vehicleId: 'CAH-3344', orderId: 'KP1249TR', speed: '45 km/h', status: 'moving', lastUpdate: '2 min ago', location: { lat: 6.0535, lng: 80.2210 } },
            { id: 4, driver: 'Anil Gunasekara', vehicleId: 'TE-002', orderId: 'KPR456', speed: '80 km/h', status: 'moving', lastUpdate: '3 min ago', location: { lat: 7.0, lng: 80.5 } , type: 'rail'},
        ];

        res.json({ liveTracking });

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
        // In a real application, you would fetch this from the 'orders' table with joins to 'customers' etc.
        // For now, we'll use mock data.
        const shipments = [
            { orderId: 'KP1248TR', customer: 'KandyMart Pvt Ltd', date: '2024-07-22', amount: 'Rs. 12,500', status: 'Delivered' },
            { orderId: 'KP1247TR', customer: 'Tech Solutions', date: '2024-07-22', amount: 'Rs. 8,900', status: 'In Transit' },
            { orderId: 'KP1246TR', customer: 'Green Store', date: '2024-07-21', amount: 'Rs. 6,750', status: 'Pending' },
            { orderId: 'KP1245TR', customer: 'Book Haven', date: '2024-07-21', amount: 'Rs. 3,200', status: 'Delivered' },
            { orderId: 'KP1244TR', customer: 'Global Exports', date: '2024-07-20', amount: 'Rs. 45,000', status: 'Cancelled' },
            { orderId: 'KP1243TR', customer: 'City Hardware', date: '2024-07-20', amount: 'Rs. 18,300', status: 'In Transit' },
        ];

        // const [shipmentsFromDb] = await db.query("SELECT order_id as orderId, customer_name as customer, order_date as date, total_amount as amount, status FROM orders ORDER BY order_date DESC");

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
        // Mock data. In a real system, this would come from a 'warehouses' table.
        const warehouses = [
            { id: 1, name: 'Colombo Main', location: 'Colombo', capacity: 10000, utilization: 87.5, status: 'active' },
            { id: 2, name: 'Kandy Hub', location: 'Kandy', capacity: 7500, utilization: 82.7, status: 'active' },
            { id: 3, name: 'Galle Depot', location: 'Galle', capacity: 5000, utilization: 76.0, status: 'inactive' },
            { id: 4, name: 'Jaffna Logistics', location: 'Jaffna', capacity: 6000, utilization: 95.2, status: 'active' },
        ];

        // const [warehousesFromDb] = await db.query("SELECT * FROM warehouses");

        const stats = {
            totalWarehouses: warehouses.length,
            totalCapacity: warehouses.reduce((sum, w) => sum + w.capacity, 0),
            avgUtilization: Math.round(warehouses.reduce((sum, w) => sum + w.utilization, 0) / warehouses.length),
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
        // Mock data. In a real system, this would come from an 'inventory' or 'products' table.
        const inventory = [
            { id: 1, sku: 'SKU001', name: 'Heavy Duty Boxes', category: 'Packaging', stock: 150, status: 'in-stock' },
            { id: 2, sku: 'SKU002', name: 'Bubble Wrap Roll', category: 'Packaging', stock: 45, status: 'low-stock' },
            { id: 3, sku: 'SKU003', name: 'Electronics Crate', category: 'Containers', stock: 75, status: 'in-stock' },
            { id: 4, sku: 'SKU004', name: 'Wooden Pallets', category: 'Logistics', stock: 0, status: 'out-of-stock' },
            { id: 5, sku: 'SKU005', name: 'Packing Tape', category: 'Supplies', stock: 250, status: 'in-stock' },
            { id: 6, sku: 'SKU006', name: 'Fragile Stickers', category: 'Supplies', stock: 30, status: 'low-stock' },
        ];

        // const [inventoryFromDb] = await db.query("SELECT * FROM inventory");

        const stats = {
            totalItems: inventory.length,
            lowStockItems: inventory.filter(i => i.status === 'low-stock').length,
            outOfStockItems: inventory.filter(i => i.status === 'out-of-stock').length,
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
        // Mock data. In a real system, this would come from a 'staff' or 'employees' table.
        const staff = [
            { id: 1, name: 'Saman Kumara', role: 'Loader', contact: '077-1234567', status: 'active' },
            { id: 2, name: 'Priya Jayasinghe', role: 'Admin Assistant', contact: '071-7654321', status: 'active' },
            { id: 3, name: 'Ruwan Silva', role: 'Logistics Coordinator', contact: '076-1122334', status: 'on-leave' },
            { id: 4, name: 'Anura Bandara', role: 'Warehouse Manager', contact: '077-5556677', status: 'active' },
            { id: 5, name: 'Nadeeka Perera', role: 'Customer Support', contact: '071-9988776', status: 'inactive' },
        ];

        // const [staffFromDb] = await db.query("SELECT * FROM staff");

        const stats = {
            totalStaff: staff.length,
            activeStaff: staff.filter(s => s.status === 'active').length,
            onLeaveStaff: staff.filter(s => s.status === 'on-leave').length,
        };

        res.json({ staff, stats });

    } catch (err) {
        console.error('Error fetching staff data:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
