import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Users, Eye, Edit, BarChart3, Video } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import DailyUploadManager from '../components/DailyUploadManager';
import { useToast } from '../components/ToastProvider';
import apiService from '../services/api';

const InstructorDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'uploads'>('overview');
  const [stats, setStats] = useState([
    { label: 'Total Students', value: '0', change: '0%', color: 'text-emerald-600' },
    { label: 'Active Courses', value: '0', change: '0', color: 'text-blue-600' },
    { label: 'Monthly Revenue', value: '$0', change: '0%', color: 'text-purple-600' },
    { label: 'Avg. Rating', value: '0.0', change: '0.0', color: 'text-orange-600' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        // Fetch instructor's courses
        const coursesResponse = await apiService.getMyCourses();
        if (coursesResponse.success && coursesResponse.data) {
          const courses = coursesResponse.data;
          setMyCourses(courses);

          // Calculate stats based on fetched courses
          const totalStudents = courses.reduce((total, course) => total + (course.students || 0), 0);
          const activeCourses = courses.filter(course => course.status === 'published').length;
          const totalRevenue = courses.reduce((total, course) => total + (parseFloat(course.revenue?.replace('$', '').replace(',', '') || 0)), 0);
          const avgRating = courses.length > 0 ? (courses.reduce((total, course) => total + (course.rating || 0), 0) / courses.length).toFixed(1) : '0.0';

          setStats([
            { label: 'Total Students', value: totalStudents.toString(), change: '0%', color: 'text-emerald-600' },
            { label: 'Active Courses', value: activeCourses.toString(), change: '0', color: 'text-blue-600' },
            { label: 'Monthly Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '0%', color: 'text-purple-600' },
            { label: 'Avg. Rating', value: avgRating, change: '0.0', color: 'text-orange-600' }
          ]);
        }

        // Fetch recent submissions
        const submissionsResponse = await apiService.getRecentSubmissions();
        if (submissionsResponse.success && submissionsResponse.data) {
          setRecentSubmissions(submissionsResponse.data.slice(0, 3)); // Show first 3
        }
      } catch (error) {
        console.error('Failed to load instructor data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructorData();
  }, []);

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
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('uploads')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Video className="h-5 w-5" />
                <span>Daily Uploads</span>
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Create Course</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('uploads')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'uploads'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Daily Uploads
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'overview' ? (
            <>
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
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${course.status === 'published'
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
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${submission.status === 'pending'
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
            </>
          ) : (
            <DailyUploadManager />
          )}
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