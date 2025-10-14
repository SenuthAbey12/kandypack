const database = require('../config/database');

async function testDriverAuth() {
  try {
    console.log('🧪 Testing driver authentication query...');
    
    // Test the exact query that was failing
    const [userRecord] = await database.query(
      'SELECT driver_id as id, name, user_name as username, password FROM driver WHERE user_name = ?',
      ['driver001']
    );
    
    console.log('✅ Query successful!');
    console.log('Driver record:', {
      id: userRecord.id,
      name: userRecord.name,
      username: userRecord.username,
      hasPassword: !!userRecord.password
    });
    
    // Test assistant too
    console.log('\n🧪 Testing assistant authentication query...');
    const [assistantRecord] = await database.query(
      'SELECT assistant_id as id, name, user_name as username, password FROM assistant WHERE user_name = ?',
      ['assistant001']
    );
    
    console.log('✅ Assistant query successful!');
    console.log('Assistant record:', {
      id: assistantRecord.id,
      name: assistantRecord.name,
      username: assistantRecord.username,
      hasPassword: !!assistantRecord.password
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testDriverAuth();