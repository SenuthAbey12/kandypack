const mysql = require('mysql2/promise');

async function getAllCredentials() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'hm$$mnmPP2003ML',
            database: 'kandypack'
        });

        console.log('=== ALL USER CREDENTIALS ===\n');

        // Get Admin credentials
        console.log('👨‍💼 ADMIN ACCOUNTS:');
        const [admins] = await connection.execute('SELECT admin_id, name FROM admin');
        admins.forEach(a => {
            console.log(`Username: ${a.admin_id} | Name: ${a.name}`);
        });

        // Get Customer credentials  
        console.log('\n👤 CUSTOMER ACCOUNTS:');
        const [customers] = await connection.execute('SELECT user_name, name, customer_id FROM customer');
        customers.forEach(c => {
            console.log(`Username: ${c.user_name} | Name: ${c.name} | ID: ${c.customer_id}`);
        });

        // Get Driver credentials
        console.log('\n🚛 DRIVER ACCOUNTS:');
        const [drivers] = await connection.execute('SELECT driver_id, name FROM driver');
        drivers.forEach(d => {
            console.log(`Username: ${d.driver_id} | Name: ${d.name}`);
        });

        // Get Assistant credentials  
        console.log('\n👨‍🔧 ASSISTANT ACCOUNTS:');
        const [assistants] = await connection.execute('SELECT assistant_id, name FROM assistant');
        assistants.forEach(a => {
            console.log(`Username: ${a.assistant_id} | Name: ${a.name}`);
        });

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

getAllCredentials();