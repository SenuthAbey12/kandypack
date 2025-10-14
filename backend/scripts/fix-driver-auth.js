const database = require('../config/database');

async function addDriverAuthColumns() {
  try {
    console.log('🔧 Adding missing authentication columns to driver table...');
    
    // Add user_name column
    await database.query(`
      ALTER TABLE driver 
      ADD COLUMN user_name VARCHAR(50) UNIQUE
    `);
    console.log('✅ Added user_name column');
    
    // Add password column
    await database.query(`
      ALTER TABLE driver 
      ADD COLUMN password VARCHAR(255)
    `);
    console.log('✅ Added password column');
    
    // Update existing drivers with default credentials
    // In a real scenario, you'd want to set proper usernames and hashed passwords
    const bcrypt = require('bcryptjs');
    const defaultPassword = await bcrypt.hash('password123', 10);
    
    await database.query(`
      UPDATE driver 
      SET user_name = CONCAT('driver', SUBSTRING(driver_id, 4)), 
          password = ?
      WHERE user_name IS NULL
    `, [defaultPassword]);
    console.log('✅ Set default credentials for existing drivers');
    
    // Make columns NOT NULL after setting values
    await database.query(`
      ALTER TABLE driver 
      MODIFY COLUMN user_name VARCHAR(50) UNIQUE NOT NULL
    `);
    
    await database.query(`
      ALTER TABLE driver 
      MODIFY COLUMN password VARCHAR(255) NOT NULL
    `);
    console.log('✅ Made columns NOT NULL');
    
    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const columns = await database.query('DESCRIBE driver');
    console.log('Updated driver table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    const drivers = await database.query('SELECT driver_id, name, user_name FROM driver LIMIT 3');
    console.log('\nSample drivers with credentials:');
    drivers.forEach(driver => {
      console.log(`- ${driver.driver_id}: ${driver.name} (username: ${driver.user_name})`);
    });
    
    console.log('\n🎉 Driver table migration completed successfully!');
    console.log('Default password for all drivers: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

addDriverAuthColumns();