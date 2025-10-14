const database = require('../config/database');
const bcrypt = require('bcryptjs');

async function createSamanDriver() {
  try {
    console.log('🔧 Creating driver "saman" for testing...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await database.query(`
      INSERT INTO driver (driver_id, name, user_name, password, phone_no) 
      VALUES (?, ?, ?, ?, ?)
    `, ['DRV003', 'Saman Silva', 'saman', hashedPassword, '+94770000003']);
    
    console.log('✅ Driver "saman" created successfully!');
    console.log('Username: saman');
    console.log('Password: password123');
    
    // Verify creation
    const [driver] = await database.query(
      'SELECT driver_id, name, user_name FROM driver WHERE user_name = ?', 
      ['saman']
    );
    
    console.log('✅ Verification:', driver);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating driver:', error.message);
    process.exit(1);
  }
}

createSamanDriver();