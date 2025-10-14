const database = require('../config/database');

async function addAssistantAuthColumns() {
  try {
    console.log('🔧 Adding missing authentication columns to assistant table...');
    
    // Add user_name column
    await database.query(`
      ALTER TABLE assistant 
      ADD COLUMN user_name VARCHAR(50) UNIQUE
    `);
    console.log('✅ Added user_name column');
    
    // Add password column
    await database.query(`
      ALTER TABLE assistant 
      ADD COLUMN password VARCHAR(255)
    `);
    console.log('✅ Added password column');
    
    // Update existing assistants with default credentials
    const bcrypt = require('bcryptjs');
    const defaultPassword = await bcrypt.hash('password123', 10);
    
    await database.query(`
      UPDATE assistant 
      SET user_name = CONCAT('assistant', SUBSTRING(assistant_id, 4)), 
          password = ?
      WHERE user_name IS NULL
    `, [defaultPassword]);
    console.log('✅ Set default credentials for existing assistants');
    
    // Make columns NOT NULL after setting values
    await database.query(`
      ALTER TABLE assistant 
      MODIFY COLUMN user_name VARCHAR(50) UNIQUE NOT NULL
    `);
    
    await database.query(`
      ALTER TABLE assistant 
      MODIFY COLUMN password VARCHAR(255) NOT NULL
    `);
    console.log('✅ Made columns NOT NULL');
    
    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const columns = await database.query('DESCRIBE assistant');
    console.log('Updated assistant table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    const assistants = await database.query('SELECT assistant_id, name, user_name FROM assistant LIMIT 3');
    console.log('\nSample assistants with credentials:');
    assistants.forEach(assistant => {
      console.log(`- ${assistant.assistant_id}: ${assistant.name} (username: ${assistant.user_name})`);
    });
    
    console.log('\n🎉 Assistant table migration completed successfully!');
    console.log('Default password for all assistants: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

addAssistantAuthColumns();