const mysql = require('mysql2/promise');

async function checkCredentials() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root', 
            password: 'hm$$mnmPP2003ML',
            database: 'kandypack'
        });

        console.log('=== CUSTOMER TABLE STRUCTURE ===');
        const [columns] = await connection.execute('DESCRIBE customer');
        columns.forEach(col => console.log(`${col.Field} - ${col.Type}`));

        console.log('\n=== CUSTOMER CREDENTIALS ===');
        const [customers] = await connection.execute('SELECT * FROM customer');
        customers.forEach(c => {
            console.log(`Customer ID: ${c.customer_id}`);
            console.log(`Name: ${c.name}`);
            console.log(`Username: ${c.user_name}`);
            console.log(`Password: ${c.password}`);
            console.log('---');
        });

        console.log('\n=== ADMIN CREDENTIALS ===');
        const [admins] = await connection.execute('SELECT admin_id, name, password FROM admin');
        admins.forEach(a => {
            console.log(`Admin ID: ${a.admin_id}`);
            console.log(`Name: ${a.name}`);
            console.log(`Password: ${a.password}`);
            console.log('---');
        });

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkCredentials();