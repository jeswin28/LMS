import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseDetail from './pages/CourseDetail';
import CertificatePage from './pages/CertificatePage';
import DiscussionForum from './pages/DiscussionForum';
import AssignmentsPage from './pages/AssignmentsPage';
import QuizzesPage from './pages/QuizzesPage';
import ProfilePage from './pages/ProfilePage';
import CreateCoursePage from './pages/CreateCoursePage';
import SubmissionsPage from './pages/SubmissionsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminApprovalsPage from './pages/AdminApprovalsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import CoursesPage from './pages/CoursesPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './components/ToastProvider';

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/certificate/:courseId" element={<CertificatePage />} />
              <Route path="/forum/:courseId?" element={<DiscussionForum />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create-course" element={<CreateCoursePage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/approvals" element={<AdminApprovalsPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </UserProvider>
  );
}

export default App;