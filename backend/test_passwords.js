const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function testPasswords() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'hm$$mnmPP2003ML',
            database: 'kandypack'
        });

        // Get John's hashed password from database
        const [rows] = await connection.execute('SELECT password FROM customer WHERE user_name = ?', ['john']);
        
        if (rows.length > 0) {
            const hashedPassword = rows[0].password;
            console.log('John\'s hashed password from DB:', hashedPassword);
            
            // Test different passwords
            const testPasswords = ['john123', 'password123', 'john', 'Password123'];
            
            console.log('\nTesting passwords:');
            for (const testPwd of testPasswords) {
                const isMatch = await bcrypt.compare(testPwd, hashedPassword);
                console.log(`${testPwd}: ${isMatch ? '✓ CORRECT' : '✗ Wrong'}`);
            }
        } else {
            console.log('User john not found');
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testPasswords();