const database = require('../config/database');
const bcrypt = require('bcryptjs');

async function checkDriverPassword() {
  try {
    console.log('\n=== Checking All Drivers ===\n');
    
    // Get all drivers
    const drivers = await database.query(
      'SELECT driver_id, name, user_name, email, password FROM driver'
    );

    if (drivers.length === 0) {
      console.log('❌ No drivers found in database');
      process.exit(1);
    }

    console.log(`Found ${drivers.length} driver(s)\n`);

    // Test passwords for each driver
    const testPasswords = [
      'driver123',
      'password',
      '123456',
      'admin123',
      'DRV001',
      'DRV002'
    ];

    for (const driver of drivers) {
      console.log(`\n--- Driver: ${driver.driver_id} (${driver.name}) ---`);
      console.log(`User Name: ${driver.user_name}`);
      console.log(`Email: ${driver.email || 'N/A'}`);
      console.log(`Password Hash: ${driver.password ? driver.password.substring(0, 30) + '...' : 'NULL'}`);
      
      if (!driver.password) {
        console.log('❌ No password set!');
        continue;
      }

      console.log('\nTesting passwords:');
      let foundMatch = false;
      
      for (const testPwd of testPasswords) {
        try {
          const isMatch = await bcrypt.compare(testPwd, driver.password);
          if (isMatch) {
            console.log(`✅ "${testPwd}" - MATCH!`);
            console.log(`\n🔑 Login with:`);
            console.log(`   Username: ${driver.driver_id}`);
            console.log(`   Password: ${testPwd}`);
            foundMatch = true;
          } else {
            console.log(`❌ "${testPwd}"`);
          }
        } catch (err) {
          console.log(`❌ "${testPwd}" - Error: ${err.message}`);
        }
      }
      
      if (!foundMatch) {
        console.log('\n⚠️  No matching password found from test list');
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('If no passwords matched, the hash might be invalid or');
    console.log('created with a different method. Check your database');
    console.log('setup scripts to see how passwords were created.');
    console.log('='.repeat(50) + '\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDriverPassword();