const http = require('http');

async function testDashboardAPI() {
    console.log('🧪 Testing Dashboard API...');
    
    // Start the main server first
    console.log('📡 Starting main server...');
    const serverProcess = require('child_process').spawn('node', ['server.js'], {
        cwd: __dirname,
        stdio: 'pipe'
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test the API
    const testEndpoints = [
        '/api/health',
        '/api/dashboard/stats',
        '/api/dashboard/fleet',
        '/api/dashboard/routes'
    ];
    
    for (const endpoint of testEndpoints) {
        try {
            const data = await makeRequest(endpoint);
            console.log(`✅ ${endpoint}:`, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`❌ ${endpoint}:`, error.message);
        }
    }
    
    // Close server
    serverProcess.kill();
}

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (err) {
                    resolve(data);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

testDashboardAPI().catch(console.error);