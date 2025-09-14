// Security test script
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

console.log('🔒 Running security tests...');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Test 1: Check JWT secret
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret === 'supersecretjwtkey') {
  console.log('⚠️  WARNING: JWT secret is using default value');
} else {
  console.log('✅ JWT secret is properly configured');
}

// Test 2: Check password hashing
const testPassword = 'test123';
const hashedPassword = bcrypt.hashSync(testPassword, 10);
const isValid = bcrypt.compareSync(testPassword, hashedPassword);
console.log('✅ Password hashing working:', isValid);

// Test 3: Check file upload limits
const maxFileSize = parseInt(process.env.MAX_FILE_UPLOAD) || 0;
if (maxFileSize > 0) {
  console.log('✅ File upload size limit configured:', maxFileSize / 1000000, 'MB');
} else {
  console.log('⚠️  WARNING: File upload size limit not configured');
}

// Test 4: Check environment variables
const requiredEnvVars = ['NODE_ENV', 'PORT', 'DB_NAME', 'DB_USERNAME', 'DB_PASSWORD'];
let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length === 0) {
  console.log('✅ All required environment variables are set');
} else {
  console.log('⚠️  WARNING: Missing environment variables:', missingVars.join(', '));
}

console.log('🔒 Security tests completed');