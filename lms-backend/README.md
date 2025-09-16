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

## API Endpoints (Detailed)

Authentication (`/api/auth`):
- `POST /register` (Public) — Only allows `role: instructor` self-register
  - Body: `{ name, email, password, role: 'instructor' }`
  - 201: `{ success, token, user }`
- `POST /login` (Public)
  - Body: `{ email, password, role: 'student'|'instructor'|'admin' }`
  - 200: `{ success, token, user }`
- `GET /me` (Protected) — Current user
  - 200: `{ success, data: user }`
- `GET /logout` (Protected)
  - 200: `{ success: true }`
- `PUT /updatedetails` (Protected)
  - Body: partial profile fields
- `PUT /updatepassword` (Protected)
  - Body: `{ currentPassword, newPassword }`
- `POST /forgotpassword` (Public)
  - Body: `{ email }`
- `PUT /resetpassword/:resettoken` (Public)
  - Body: `{ password }`

Users (`/api/users`):
- `POST /login` — Alternate login used by some clients
- `POST /admin/create` (Admin)
  - Body: `{ name, email, password, role }`
- `GET /profile` (Protected)
- `PUT /me` (Protected) — Update own profile

Courses (`/api/courses`):
- `GET /` (Public) — List approved courses
- `POST /` (Instructor/Admin) — Create course
  - Body: `{ title, description, category, level, price, ... }`
- `GET /my-courses` (Instructor)
- `GET /admin/pending` (Admin)
- `PUT /:id/approve` (Admin)
- `GET /:id` (Public)
- `PUT /:id` (Instructor owner/Admin)
- `DELETE /:id` (Instructor owner/Admin)

Lessons:
- `POST /api/courses/:id/lessons` (Instructor/Admin) — Add lesson to course
- Additional lesson routes exist for updating resources/videos

Enrollments (`/api/enrollments`):
- `POST /` (Student) — Enroll in course
- `GET /my-courses` (Student) — List enrolled courses

Assignments (`/api/assignments`):
- `POST /api/courses/:courseId/assignments` (Instructor)
- `PUT /:assignmentId` (Instructor)
- `DELETE /:assignmentId` (Instructor)
- `POST /:assignmentId/submit` (Student)
- `GET /:assignmentId/submissions` (Instructor)

Quizzes (`/api/quizzes`):
- `POST /api/courses/:courseId/quizzes` (Instructor)
- `POST /:quizId/questions` (Instructor)
- `POST /:quizId/submit` (Student)
- `GET /:quizId/attempts` (Instructor)

Discussion (`/api/forum`):
- `GET /` and `POST /` — Course forum posts
- `POST /:postId/comments` — Comments

Certificates (`/api/certificates`):
- `GET /:enrollmentId` (Student) — Download certificate

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
