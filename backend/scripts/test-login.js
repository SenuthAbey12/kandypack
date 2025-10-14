const axios = require('axios');

async function testDriverLogin() {
  try {
    console.log('🧪 Testing driver login via API...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'driver001',
      password: 'password123',
      role: 'driver'
    });
    
    console.log('✅ Driver login successful!');
    console.log('Response:', {
      success: response.data.success,
      user: response.data.user,
      hasToken: !!response.data.token
    });
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed:', error.response.data);
    } else if (error.request) {
      console.log('❌ No response from server. Is it running on port 5000?');
    } else {
      console.log('❌ Request error:', error.message);
    }
  }
}

testDriverLogin();