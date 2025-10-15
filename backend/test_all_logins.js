const axios = require('axios');

async function testAllCredentials() {
  const credentials = [
    // Admin
    { username: 'admin', password: 'admin123', role: 'admin' },
    
    // Customers
    { username: 'john', password: 'john123', role: 'customer' },
    { username: 'jane', password: 'jane123', role: 'customer' },
    { username: 'bob', password: 'bob123', role: 'customer' },
    { username: 'alice', password: 'alice123', role: 'customer' },
    
    // Drivers  
    { username: 'saman', password: 'saman123', role: 'driver' },
    { username: 'kamal', password: 'kamal123', role: 'driver' },
    
    // Assistants
    { username: 'priya', password: 'priya123', role: 'assistant' },
    { username: 'chamara', password: 'chamara123', role: 'assistant' }
  ];

  for (const cred of credentials) {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', cred);
      console.log(`✅ ${cred.role.toUpperCase()} - ${cred.username}: Login successful`);
    } catch (error) {
      console.error(`❌ ${cred.role.toUpperCase()} - ${cred.username}: Login failed -`, 
        error.response ? error.response.data.error : error.message);
    }
  }
}

testAllCredentials();