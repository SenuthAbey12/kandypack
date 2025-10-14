const database = require('../config/database');

async function checkDriverTableStructure() {
  try {
    console.log('🔍 Checking driver table structure...');
    const columns = await database.query('DESCRIBE driver');
    
    console.log('Driver table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    console.log('\n🔍 Checking sample driver data...');
    const drivers = await database.query('SELECT * FROM driver LIMIT 3');
    console.log('Sample drivers:', drivers);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking driver table:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

checkDriverTableStructure();