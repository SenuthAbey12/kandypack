const axios = require('axios');

async function testLogin() {
  // First test if server is running
try {
  console.log('🔍 Checking if the server is online...');
  await axios.get('http://localhost:5000/api/health');
  console.log('✅ Success! The server is online and responding.');
} catch (error) {
  console.error('❌ Failed to connect to the server:', error.code || error.message);
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
  console.error('❌ Login attempt unsuccessful!');
  if (error.response) {
    console.error('💥 Response Status:', error.response.status);
    console.error('📡 Error Details:', error.response.data);
  } else {
    console.error('⚠️ Error Code:', error.code);
    console.error('🔴 Error Message:', error.message);
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
  console.error('❌ Login attempt for customer was unsuccessful!');
  
  if (error.response) {
    console.error('💥 Response Status Code:', error.response.status);
    console.error('📡 Detailed Error Information:', error.response.data);
  } else {
    console.error('⚠️ Error Code:', error.code);
    console.error('🔴 Error Message:', error.message);
  }
  }
}

testLogin();