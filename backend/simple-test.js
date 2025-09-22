const http = require('http');

// Create a simple test server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'Simple test server working!', 
    url: req.url,
    method: req.method 
  }));
});

const PORT = 5000;

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🧪 Simple HTTP server running on http://127.0.0.1:${PORT}`);
  
  // Test the server immediately
  setTimeout(() => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/test',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('✅ Self-test successful:', data);
      });
    });

    req.on('error', (err) => {
      console.error('❌ Self-test failed:', err.message);
    });

    req.end();
  }, 1000);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});