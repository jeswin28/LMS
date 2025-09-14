// lms-backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const path = require('path');
const errorHandler = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('combined'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178'],
  credentials: true
}));

// Serve static files for uploads (e.g., course thumbnails, video files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/forum', discussionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes); // Admin routes are typically protected by roleMiddleware

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});