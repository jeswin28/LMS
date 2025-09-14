#!/bin/bash

# LMS Production Setup Script
echo "🚀 Setting up Learning Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd lms-backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../
npm install

# Create upload directories
echo "📁 Creating upload directories..."
mkdir -p lms-backend/uploads/thumbnails
mkdir -p lms-backend/uploads/videos
mkdir -p lms-backend/uploads/resources
mkdir -p lms-backend/uploads/submissions
mkdir -p lms-backend/uploads/others

# Set permissions
chmod -R 755 lms-backend/uploads

echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your database in lms-backend/config/config.env"
echo "2. Run: cd lms-backend && npm run data:import"
echo "3. Start backend: cd lms-backend && npm run dev"
echo "4. Start frontend: npm run dev"
echo ""
echo "🌐 Access the application:"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5001"
echo "Admin Login: admin@example.com / admin123"