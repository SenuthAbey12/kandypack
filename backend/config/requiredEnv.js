// Central environment validation for critical configuration.
// Fails fast if mandatory variables are missing to prevent insecure fallbacks.

const REQUIRED_VARS = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET'
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter(v => !process.env[v] || String(process.env[v]).trim() === '');
  if (missing.length) {
    // Provide developer friendly guidance
    console.error('\n[CONFIG ERROR] Missing required environment variables:');
    missing.forEach(v => console.error(' - ' + v));
    console.error('\nCreate or update your .env file, e.g.:');
    console.error('  DB_HOST=localhost');
    console.error('  DB_USER=root');
    console.error('  DB_PASSWORD=yourStrongPassword');
    console.error('  DB_NAME=kandypack');
    console.error('  JWT_SECRET=generate_a_long_random_secret');
    console.error('\nRefusing to start with insecure defaults.');
    process.exit(1);
  }
  if (!process.env.FRONTEND_URL) {
    // Not fatal, but warn for clarity
    console.warn('[CONFIG WARN] FRONTEND_URL not set, defaulting to http://localhost:3000');
    process.env.FRONTEND_URL = 'http://localhost:3000';
  }
}

validateEnv();

module.exports = { validateEnv };
