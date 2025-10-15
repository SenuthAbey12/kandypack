const express = require('express');
const app = express();
const PORT = 5000;

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`🧪 Test server running on http://127.0.0.1:${PORT}`);
});

setTimeout(() => {
    console.log('Server should be ready for testing...');
}, 1000);