import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Users, Star, DollarSign } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';
import apiService from '../services/api';
import { useToast } from '../components/ToastProvider';

const AdminCoursesPage: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiService.getCourses();
        if (response.success && response.data) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = ['all', 'Programming', 'Design', 'Marketing', 'Data Science', 'Business'];
  const statuses = ['all', 'published', 'draft', 'under_review', 'suspended'];

  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      showToast('success', 'Course deleted successfully!');
    }
  };

  const handleStatusChange = (courseId: number, newStatus: string) => {
    showToast('success', `Course status updated to ${newStatus}!`);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    underReview: courses.filter(c => c.status === 'under_review').length,
    totalRevenue: courses.reduce((sum, course) => sum + course.revenue, 0),
    totalStudents: courses.reduce((sum, course) => sum + course.students, 0)
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'admin'} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
            <p className="text-gray-600">Monitor and manage all courses on the platform</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <Card padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
            </Card>
            <Card padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                <p className="text-sm text-gray-600">Published</p>
              </div>
            </Card>
            <Card padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                <p className="text-sm text-gray-600">Drafts</p>
              </div>
            </Card>
            <Card padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.underReview}</p>
                <p className="text-sm text-gray-600">Under Review</p>
              </div>
            </Card>
            <Card padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </Card>
            <Card padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6" padding="md">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} hover>
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                      {course.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{course.rating} ({course.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>${course.price}</span>
                    </div>
                    <div>
                      <span className="text-emerald-600 font-medium">${course.revenue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>Created: {course.createdDate}</p>
                    <p>Updated: {course.lastUpdated}</p>
                    <p>{course.lessons} lessons • {course.duration}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsDetailsModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {(course.status === 'draft' || course.status === 'under_review') && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(course.id, 'published')}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Publish
                      </button>
                    </div>
                  )}

                  {course.status === 'published' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(course.id, 'suspended')}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Suspend
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500">No courses found matching your criteria.</p>
              </div>
            </Card>
          )}
        </main>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedCourse(null);
          }}
          title="Course Details"
          size="xl"
        >
          <div className="space-y-6">
            <div className="flex space-x-6">
              <img
                src={selectedCourse.thumbnail}
                alt={selectedCourse.title}
                className="w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h3>
                <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Instructor:</span> {selectedCourse.instructor}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {selectedCourse.category}
                  </div>
                  <div>
                    <span className="font-medium">Price:</span> ${selectedCourse.price}
                  </div>
                  <div>
                    <span className="font-medium">Students:</span> {selectedCourse.students}
                  </div>
                  <div>
                    <span className="font-medium">Rating:</span> {selectedCourse.rating} ⭐ ({selectedCourse.reviews} reviews)
                  </div>
                  <div>
                    <span className="font-medium">Revenue:</span> ${selectedCourse.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Course Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Lessons:</span> {selectedCourse.lessons}</p>
                  <p><span className="font-medium">Duration:</span> {selectedCourse.duration}</p>
                  <p><span className="font-medium">Created:</span> {selectedCourse.createdDate}</p>
                  <p><span className="font-medium">Last Updated:</span> {selectedCourse.lastUpdated}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Status & Actions</h4>
                <div className="space-y-3">
                  <div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedCourse.status)}`}>
                      {selectedCourse.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {selectedCourse.status !== 'published' && (
                      <button
                        onClick={() => handleStatusChange(selectedCourse.id, 'published')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Publish
                      </button>
                    )}
                    {selectedCourse.status === 'published' && (
                      <button
                        onClick={() => handleStatusChange(selectedCourse.id, 'suspended')}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Edit Course
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminCoursesPage;