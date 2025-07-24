import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, BookOpen, Award } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const enrolledCourses = [
    {
      id: 1,
      title: 'React Development Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      nextLesson: 'State Management with Redux',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'UI/UX Design Principles',
      instructor: 'Michael Chen',
      progress: 45,
      nextLesson: 'Color Theory and Typography',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      instructor: 'Prof. David Miller',
      progress: 30,
      nextLesson: 'Binary Search Trees',
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?w=300&h=200&fit=crop'
    }
  ];

  const upcomingTasks = [
    { id: 1, title: 'React Quiz Chapter 5', due: '2 days', type: 'quiz' },
    { id: 2, title: 'Design Project Submission', due: '5 days', type: 'assignment' },
    { id: 3, title: 'Algorithm Practice Test', due: '1 week', type: 'test' }
  ];

  const stats = [
    { label: 'Enrolled Courses', value: '3', icon: BookOpen },
    { label: 'Completed Courses', value: '12', icon: Award },
    { label: 'Hours Learned', value: '147', icon: Clock },
    { label: 'Current Streak', value: '15 days', icon: Calendar }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="student" />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Student! 👋
            </h1>
            <p className="text-gray-600">
              Continue your learning journey. You're doing great!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} padding="md" hover>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <stat.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrolled Courses */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} hover className="cursor-pointer">
                    <div className="flex space-x-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          by {course.instructor}
                        </p>
                        <ProgressBar progress={course.progress} className="mb-2" />
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-emerald-600">
                            Next: {course.nextLesson}
                          </p>
                          <button
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 transition-colors"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
              <Card>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600">Due in {task.due}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.type === 'quiz' ? 'bg-blue-100 text-blue-800' :
                        task.type === 'assignment' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {task.type}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <Card>
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/forum')}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-900">Join Study Group</div>
                      <div className="text-sm text-gray-600">Connect with classmates</div>
                    </button>
                    <button 
                      onClick={() => navigate('/profile')}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-900">View Certificates</div>
                      <div className="text-sm text-gray-600">Download completed certificates</div>
                    </button>
                    <button 
                      onClick={() => navigate('/courses')}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-900">Browse Courses</div>
                      <div className="text-sm text-gray-600">Discover new learning paths</div>
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;