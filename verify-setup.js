#!/usr/bin/env node

// LMS Setup Verification Script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying LMS Setup...\n');

const checks = [
  {
    name: 'Backend package.json',
    path: 'lms-backend/package.json',
    required: true
  },
  {
    name: 'Frontend package.json',
    path: 'package.json',
    required: true
  },
  {
    name: 'Database models',
    path: 'lms-backend/models',
    required: true,
    isDirectory: true
  },
  {
    name: 'API controllers',
    path: 'lms-backend/controllers',
    required: true,
    isDirectory: true
  },
  {
    name: 'API routes',
    path: 'lms-backend/routes',
    required: true,
    isDirectory: true
  },
  {
    name: 'Frontend components',
    path: 'src/components',
    required: true,
    isDirectory: true
  },
  {
    name: 'Frontend pages',
    path: 'src/pages',
    required: true,
    isDirectory: true
  },
  {
    name: 'API service',
    path: 'src/services/api.ts',
    required: true
  },
  {
    name: 'User context',
    path: 'src/context/UserContext.tsx',
    required: true
  },
  {
    name: 'Upload directories',
    path: 'lms-backend/uploads',
    required: false,
    isDirectory: true
  }
];

let allPassed = true;

checks.forEach(check => {
  const fullPath = path.join(__dirname, check.path);
  const exists = check.isDirectory ? 
    fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory() :
    fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${check.name}`);
  } else if (check.required) {
    console.log(`❌ ${check.name} - REQUIRED`);
    allPassed = false;
  } else {
    console.log(`⚠️  ${check.name} - Optional (will be created on first run)`);
  }
});

console.log('\n📋 Setup Summary:');
if (allPassed) {
  console.log('✅ All required components are present!');
  console.log('\n🚀 Next steps:');
  console.log('1. Configure database in lms-backend/config/config.env');
  console.log('2. Run: cd lms-backend && npm run data:import');
  console.log('3. Start backend: cd lms-backend && npm run dev');
  console.log('4. Start frontend: npm run dev');
  console.log('\n🌐 Access the application:');
  console.log('Frontend: http://localhost:5173');
  console.log('Backend: http://localhost:5001');
  console.log('Admin Login: admin@example.com / admin123');
} else {
  console.log('❌ Some required components are missing!');
  console.log('Please ensure all files are properly created.');
}

console.log('\n📚 Documentation:');
console.log('- README.md - Complete setup guide');
console.log('- DEPLOYMENT.md - Production deployment guide');
console.log('- setup.sh - Automated setup script');