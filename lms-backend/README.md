# LMS Backend

## Overview
This is a production-ready Learning Management System (LMS) backend built with Node.js, Express, Sequelize ORM, and PostgreSQL. It supports user authentication, course management, lessons, enrollments, assignments, quizzes, discussion forums, and certificate generation.

## Features
- User authentication (JWT, role-based access)
- Admin, instructor, and student roles
- Course creation, approval, and management
- Lesson management
- Student enrollments and progress tracking
- Assignment creation, submission, and grading
- Quiz creation, auto-grading, and attempts
- Discussion forums (posts and comments)
- PDF certificate generation for completed courses
- Secure, production-ready configuration

## API Endpoints
- `/api/users/login` - User login
- `/api/users/register` - Instructor registration
- `/api/users/admin/create` - Admin creates user
- `/api/users/profile` - Get user profile
- `/api/courses` - List approved courses
- `/api/courses/:id` - Get course details
- `/api/courses/admin/pending` - List pending courses (admin)
- `/api/courses/:id/approve` - Approve course (admin)
- `/api/courses/:id` (PUT/DELETE) - Update/delete course (instructor/admin)
- `/api/courses/:courseId/lessons` - Add lesson (instructor)
- `/api/lessons/:lessonId` - Get/update/delete lesson
- `/api/enrollments` - Enroll in course (student)
- `/api/enrollments/my-courses` - List enrolled courses (student)
- `/api/enrollments/progress` - Mark lesson complete (student)
- `/api/courses/:courseId/assignments` - Create assignment (instructor)
- `/api/assignments/:assignmentId` - Update/delete assignment (instructor)
- `/api/assignments/:assignmentId/submit` - Submit assignment (student)
- `/api/assignments/:assignmentId/submissions` - View submissions (instructor)
- `/api/submissions/:submissionId/grade` - Grade submission (instructor)
- `/api/courses/:courseId/quizzes` - Create quiz (instructor)
- `/api/quizzes/:quizId/questions` - Add question (instructor)
- `/api/quizzes/:quizId/submit` - Submit quiz (student)
- `/api/quizzes/:quizId/attempts` - View attempts (instructor)
- `/api/courses/:courseId/discussions` - Create/view posts (enrolled)
- `/api/discussions/:postId/comments` - Add comment (enrolled)
- `/api/enrollments/:enrollmentId/certificate` - Download certificate (student)

## Deployment Notes
- Ensure PostgreSQL is running and accessible.
- Set environment variables in `config/config.env` for DB connection and JWT secret.
- Run migrations and seeders as needed with Sequelize CLI.
- Start the server with `npm start` or `node server.js`.
- For production, use a process manager (e.g., PM2) and configure HTTPS.

## Security
- Helmet, CORS, and input validation are enabled.
- All endpoints are protected by JWT and role-based middleware.

## License
MIT
