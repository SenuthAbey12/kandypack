const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function applyAdvancedSchema() {
    console.log('🔄 Applying Advanced Rail & Road Distribution Schema...');
    
    try {
        // Read the SQL file
        const sqlFilePath = path.join(__dirname, '..', 'setup_database.sql');
        const sqlContent = await fs.readFile(sqlFilePath, 'utf8');
        
        console.log('✅ SQL file loaded successfully');
        
        // Connect to MySQL
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Split SQL content into individual statements
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`🔄 Executing ${statements.length} SQL statements...`);
        
        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            if (statement.trim()) {
                try {
                    await connection.execute(statement);
                    
                    // Log progress for key operations
                    if (statement.includes('CREATE DATABASE')) {
                        console.log('✅ Database created/verified');
                    } else if (statement.includes('CREATE TABLE')) {
                        const tableName = statement.match(/CREATE TABLE\s+(\w+)/i)?.[1];
                        console.log(`✅ Table '${tableName}' created`);
                    } else if (statement.includes('CREATE PROCEDURE')) {
                        const procName = statement.match(/CREATE PROCEDURE\s+(\w+)/i)?.[1];
                        console.log(`✅ Procedure '${procName}' created`);
                    } else if (statement.includes('CREATE OR REPLACE VIEW')) {
                        const viewName = statement.match(/CREATE OR REPLACE VIEW\s+(\w+)/i)?.[1];
                        console.log(`✅ View '${viewName}' created`);
                    }
                } catch (error) {
                    if (!error.message.includes('already exists') && !error.message.includes('Duplicate')) {
                        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
                        console.error('Statement:', statement.substring(0, 100) + '...');
                    }
                }
            }
        }
        
        // Verify the new schema
        await connection.execute('USE kandypack');
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('\n📋 New database tables:');
        tables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
        });
        
        // Check for views
        const [views] = await connection.execute("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
        if (views.length > 0) {
            console.log('\n📊 Views created:');
            views.forEach(view => {
                console.log(`  - ${Object.values(view)[0]}`);
            });
        }
        
        // Check for procedures
        const [procedures] = await connection.execute('SHOW PROCEDURE STATUS WHERE Db = "kandypack"');
        if (procedures.length > 0) {
            console.log('\n⚙️ Stored procedures:');
            procedures.forEach(proc => {
                console.log(`  - ${proc.Name}`);
            });
        }
        
        await connection.end();
        
        console.log('\n🎉 Advanced Rail & Road Distribution Schema applied successfully!');
        console.log('✅ Database now includes:');
        console.log('  - Comprehensive train route management');
        console.log('  - Capacity-aware scheduling');
        console.log('  - Worker constraint management');
        console.log('  - Business rule enforcement');
        console.log('  - Advanced reporting views');
        
    } catch (error) {
        console.error('❌ Schema application failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    applyAdvancedSchema();
}

module.exports = { applyAdvancedSchema };