const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const path = require('path');
const errorHandler = require('./middlewares/errorMiddleware');

// Load env
dotenv.config({ path: './config/config.env' });

const app = express();

// Security
app.use(helmet());

// Logging (skip in test for clarity)
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// CORS -- CORRECTED POSITION
app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'production'
                ? process.env.FRONTEND_URL
                : [
                    'http://localhost:3000',
                    'http://localhost:5173',
                    'http://localhost:5174',
                    'http://localhost:5175',
                    'http://localhost:5176',
                    'http://localhost:5177',
                    'http://localhost:5178',
                ],
        credentials: true,
    })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookies
app.use(cookieParser());

// CSRF protection except in test
if (process.env.NODE_ENV !== 'test') {
    const csrfProtection = csrf({ cookie: true });
    app.use(csrfProtection);
    app.get('/api/csrf-token', (req, res) => {
        return res.json({ csrfToken: req.csrfToken() });
    });
}

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
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
app.use('/api/admin', adminRoutes);

// Errors
app.use(errorHandler);

module.exports = app;