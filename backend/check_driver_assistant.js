const mysql = require('mysql2/promise');

async function checkDriverAssistantUsernames() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'hm$$mnmPP2003ML',
            database: 'kandypack'
        });

        console.log('=== DRIVER TABLE STRUCTURE ===');
        const [driverColumns] = await connection.execute('DESCRIBE driver');
        driverColumns.forEach(col => console.log(`${col.Field} - ${col.Type}`));

        console.log('\n=== ASSISTANT TABLE STRUCTURE ===');
        const [assistantColumns] = await connection.execute('DESCRIBE assistant');
        assistantColumns.forEach(col => console.log(`${col.Field} - ${col.Type}`));

        console.log('\n=== DRIVER DATA ===');
        const [drivers] = await connection.execute('SELECT * FROM driver');
        drivers.forEach(d => {
            console.log('Driver Record:');
            Object.keys(d).forEach(key => {
                console.log(`  ${key}: ${d[key]}`);
            });
            console.log('---');
        });

        console.log('\n=== ASSISTANT DATA ===');
        const [assistants] = await connection.execute('SELECT * FROM assistant');
        assistants.forEach(a => {
            console.log('Assistant Record:');
            Object.keys(a).forEach(key => {
                console.log(`  ${key}: ${a[key]}`);
            });
            console.log('---');
        });

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkDriverAssistantUsernames();