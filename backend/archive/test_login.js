const axios = require('axios');

async function testLogin() {
  // First test if server is running
  try {
    console.log('Testing server connection...');
    await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server is reachable');
  } catch (error) {
    console.error('❌ Server not reachable:', error.code || error.message);
    return;
  }

  try {
    console.log('\nTesting admin login...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    }, {
      timeout: 10000
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Login failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    }
  }

  try {
    console.log('\nTesting customer login...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'john',
      password: 'john123',
      role: 'customer'
    }, {
      timeout: 10000
    });
    
    console.log('✅ Customer login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Customer login failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    }
  }
}

testLogin();