import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Users, Eye, Edit, BarChart3 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastProvider';

const InstructorDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const myCourses = [
    {
      id: 1,
      title: 'React Development Fundamentals',
      students: 156,
      lessons: 24,
      status: 'published',
      revenue: '$2,340',
      rating: 4.8,
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      students: 89,
      lessons: 18,
      status: 'draft',
      revenue: '$1,780',
      rating: 4.9,
      thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      students: 203,
      lessons: 32,
      status: 'published',
      revenue: '$4,560',
      rating: 4.7,
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?w=300&h=200&fit=crop'
    }
  ];

  const recentSubmissions = [
    { id: 1, student: 'Alice Johnson', assignment: 'React Component Design', submitted: '2 hours ago', status: 'pending' },
    { id: 2, student: 'Bob Smith', assignment: 'API Integration Project', submitted: '1 day ago', status: 'graded' },
    { id: 3, student: 'Carol Davis', assignment: 'Database Schema Design', submitted: '2 days ago', status: 'pending' }
  ];

  const stats = [
    { label: 'Total Students', value: '448', change: '+12%', color: 'text-emerald-600' },
    { label: 'Active Courses', value: '3', change: '+1', color: 'text-blue-600' },
    { label: 'Monthly Revenue', value: '$8,680', change: '+23%', color: 'text-purple-600' },
    { label: 'Avg. Rating', value: '4.8', change: '+0.2', color: 'text-orange-600' }
  ];

  const handleCreateCourse = () => {
    setIsCreateModalOpen(false);
    showToast('success', 'Course created successfully!');
    navigate('/create-course');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="instructor" />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your courses and track student progress
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Course</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <span className={`text-sm font-medium ${stat.color}`}>
                    {stat.change}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Courses */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
              <div className="space-y-4">
                {myCourses.map((course) => (
                  <Card key={course.id} hover>
                    <div className="flex space-x-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            course.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{course.students} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{course.lessons} lessons</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="h-4 w-4" />
                            <span>{course.rating} ⭐</span>
                          </div>
                          <div className="font-medium text-emerald-600">
                            {course.revenue}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button 
                            onClick={() => navigate('/create-course')}
                            className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Submissions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Submissions</h2>
              <Card>
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{submission.student}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          submission.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{submission.assignment}</p>
                      <p className="text-xs text-gray-500">{submission.submitted}</p>
                      {submission.status === 'pending' && (
                        <button 
                          onClick={() => navigate('/submissions')}
                          className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          Grade Submission
                        </button>
                      )}
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
                      onClick={() => navigate('/create-course')}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Upload className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Upload Resources</span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">Add new course materials</div>
                    </button>
                    <button 
                      onClick={() => navigate('/admin/analytics')}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">View Analytics</span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">Check course performance</div>
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Course"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateCourse(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter course title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter course description"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option>Programming</option>
                <option>Design</option>
                <option>Business</option>
                <option>Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Create Course
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InstructorDashboard;