const fs = require('fs');
const path = require('path');

// Read the dashboard.js file
const filePath = path.join(__dirname, 'routes', 'dashboard.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Fixing double destructuring patterns...');

// Fix all instances of double destructuring for single values
content = content.replace(/const \[\[(\{[^}]+\})\]\]/g, 'const [$1]');
content = content.replace(/const \[\[([^\]]+)\]\]/g, 'const [$1]');

// Write the fixed content back
fs.writeFileSync(filePath, content);

console.log('✅ Fixed all double destructuring patterns in dashboard.js');
console.log('📝 Please verify the changes are correct');