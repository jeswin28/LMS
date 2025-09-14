# 🎓 Learning Management System (LMS)

A comprehensive, production-ready Learning Management System built with modern web technologies. This system supports multiple user roles with full CRUD operations for courses, assignments, quizzes, discussions, and more.

## ✨ Features

### 🎓 Student Features
- Browse and enroll in courses
- Access course materials and lessons
- Submit assignments with file uploads
- Take quizzes and view results
- Participate in discussion forums
- Track learning progress
- View certificates upon completion

### 👨‍🏫 Instructor Features
- Create and manage courses
- Upload course materials and videos
- Create assignments and quizzes
- Grade student submissions
- Monitor student progress
- Manage course discussions
- View analytics and reports

### 👨‍💼 Admin Features
- Manage all users (students, instructors)
- Approve/reject course submissions
- Monitor system analytics
- Manage user roles and permissions
- System-wide notifications
- Content moderation

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Chart.js** for analytics

### Backend
- **Node.js** with Express.js
- **Sequelize** ORM with PostgreSQL
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Helmet** for security

### Database
- **PostgreSQL** for data persistence

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone and setup:**
```bash
git clone <repository-url>
cd project-17
chmod +x setup.sh
./setup.sh
```

2. **Configure database:**
Edit `lms-backend/config/config.env` with your database credentials.

3. **Initialize database:**
```bash
cd lms-backend
npm run data:import
```

4. **Start the application:**
```bash
# Terminal 1 - Backend
cd lms-backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

5. **Access the application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- Admin Login: admin@example.com / admin123

## 📋 Default Login Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** Admin

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/courses` - Get all approved courses
- `POST /api/courses` - Create new course (instructor)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/:id` - Get assignment details
- `PUT /api/assignments/:id` - Update assignment

### Submissions
- `POST /api/submissions` - Submit assignment
- `GET /api/submissions` - Get submissions (instructor)
- `PUT /api/submissions/:id/grade` - Grade submission

### Quizzes
- `GET /api/quizzes` - Get quizzes
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Discussion Forum
- `GET /api/forum` - Get discussion posts
- `POST /api/forum` - Create new post
- `GET /api/forum/:id` - Get post details

## 📁 File Upload System

The system supports file uploads for:
- Course thumbnails
- Assignment attachments
- Student submissions
- Course materials

Files are stored in the `lms-backend/uploads/` directory:
```
uploads/
├── thumbnails/     # Course thumbnails
├── videos/         # Course videos
├── resources/      # Course materials
├── submissions/    # Student submissions
└── others/         # Other files
```

## 🗄 Database Schema

### Key Models
- **User** - Students, instructors, admins
- **Course** - Course information and metadata
- **Lesson** - Individual course lessons
- **Enrollment** - Student course enrollments
- **Assignment** - Course assignments
- **Submission** - Student assignment submissions
- **Quiz** - Course quizzes
- **Question** - Quiz questions
- **Discussion** - Forum posts and replies
- **Notification** - System notifications

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- File upload validation
- CORS configuration
- Helmet security headers
- Input validation and sanitization

## 🚀 Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions including:

- Docker deployment
- Nginx configuration
- SSL setup
- PM2 process management
- Database backup strategies
- Security checklist

## 📊 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run data:import  # Import initial data
npm run data:destroy # Destroy initial data
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🧪 Testing

The application includes comprehensive error handling and validation. For production use, consider adding:

- Unit tests with Jest
- Integration tests
- End-to-end tests with Cypress
- API testing with Supertest

## 📈 Performance Features

- Database indexing for optimal queries
- File upload optimization
- Image compression
- Lazy loading for large datasets
- Caching strategies

## 🔧 Configuration

### Environment Variables

Key environment variables in `lms-backend/config/config.env`:

```env
NODE_ENV=development
PORT=5001
DATABASE_URL=postgresql://localhost:5432/lms_db
JWT_SECRET=supersecretjwtkey
JWT_EXPIRE=30d
MAX_FILE_UPLOAD=10000000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Review the API documentation above
- Check application logs for debugging
- Create an issue in the repository

## 🗺 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Video streaming integration
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] API rate limiting
- [ ] Automated testing suite

---

**Built with ❤️ for modern education**