// Generate bcrypt hashes for simple passwords
const bcrypt = require('bcryptjs');

const passwords = [
  'admin123',
  'john123', 
  'jane123',
  'bob123',
  'alice123',
  'saman123',
  'kamal123', 
  'nimal123',
  'sunil123',
  'priya123',
  'chamara123',
  'sanduni123',
  'thilaka123'
];

async function generateHashes() {
  console.log('-- Bcrypt hashes for simple passwords (for database setup):');
  console.log('');
  
  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`-- Password: ${password}`);
    console.log(`'${hash}',`);
    console.log('');
  }
}

generateHashes().catch(console.error);