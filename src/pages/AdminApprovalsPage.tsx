import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Eye, User, BookOpen, FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';

const AdminApprovalsPage: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const pendingApprovals = [
    {
      id: 1,
      type: 'course',
      title: 'Machine Learning Fundamentals',
      submitter: 'Dr. Alex Smith',
      submitterEmail: 'alex.smith@example.com',
      submittedAt: '2024-02-10 14:30',
      description: 'Comprehensive introduction to machine learning concepts, algorithms, and practical applications.',
      category: 'Data Science',
      price: 149.99,
      lessons: 25,
      duration: '12 hours',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?w=300&h=200&fit=crop',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      type: 'instructor',
      title: 'Instructor Application - Jane Cooper',
      submitter: 'Jane Cooper',
      submitterEmail: 'jane.cooper@example.com',
      submittedAt: '2024-02-09 16:45',
      description: 'Application to become an instructor. 5+ years experience in web development.',
      qualifications: [
        'Master\'s in Computer Science',
        '5 years industry experience',
        'Previous teaching experience at university level'
      ],
      portfolio: 'https://janecooper.dev',
      linkedin: 'https://linkedin.com/in/janecooper',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'course',
      title: 'Advanced Python Programming',
      submitter: 'Prof. Lisa Wang',
      submitterEmail: 'lisa.wang@example.com',
      submittedAt: '2024-02-08 10:15',
      description: 'Deep dive into advanced Python concepts including decorators, metaclasses, and async programming.',
      category: 'Programming',
      price: 99.99,
      lessons: 20,
      duration: '8 hours',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=300&h=200&fit=crop',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'content',
      title: 'Course Content Update - React Hooks',
      submitter: 'Dr. Sarah Johnson',
      submitterEmail: 'sarah.johnson@example.com',
      submittedAt: '2024-02-07 09:20',
      description: 'Major update to React course including new lessons on React 18 features and concurrent rendering.',
      courseName: 'React Development Fundamentals',
      changes: [
        'Added 5 new lessons on React 18',
        'Updated existing content for latest best practices',
        'Added practical exercises for concurrent features'
      ],
      status: 'pending',
      priority: 'low'
    },
    {
      id: 5,
      type: 'instructor',
      title: 'Instructor Application - Mark Rodriguez',
      submitter: 'Mark Rodriguez',
      submitterEmail: 'mark.rodriguez@example.com',
      submittedAt: '2024-02-06 13:45',
      description: 'Experienced UX designer applying to teach design courses.',
      qualifications: [
        'Bachelor\'s in Design',
        '8 years UX/UI design experience',
        'Led design teams at major tech companies'
      ],
      portfolio: 'https://markrodriguez.design',
      linkedin: 'https://linkedin.com/in/markrodriguez',
      status: 'pending',
      priority: 'high'
    }
  ];

  const handleApprove = (itemId: number) => {
    showToast('success', 'Item approved successfully!');
  };

  const handleReject = (itemId: number) => {
    if (window.confirm('Are you sure you want to reject this item?')) {
      showToast('success', 'Item rejected.');
    }
  };

  const filteredApprovals = pendingApprovals.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5" />;
      case 'instructor':
        return <User className="h-5 w-5" />;
      case 'content':
        return <FileText className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-blue-100 text-blue-800';
      case 'instructor':
        return 'bg-purple-100 text-purple-800';
      case 'content':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: pendingApprovals.length,
    courses: pendingApprovals.filter(item => item.type === 'course').length,
    instructors: pendingApprovals.filter(item => item.type === 'instructor').length,
    content: pendingApprovals.filter(item => item.type === 'content').length,
    high: pendingApprovals.filter(item => item.priority === 'high').length
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'admin'} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
            <p className="text-gray-600">Review and approve courses, instructors, and content updates</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Pending</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.courses}</p>
                  <p className="text-sm text-gray-600">Courses</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.instructors}</p>
                  <p className="text-sm text-gray-600">Instructors</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.content}</p>
                  <p className="text-sm text-gray-600">Content Updates</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.high}</p>
                  <p className="text-sm text-gray-600">High Priority</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filter */}
          <Card className="mb-6" padding="md">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="course">Courses</option>
                <option value="instructor">Instructors</option>
                <option value="content">Content Updates</option>
              </select>
            </div>
          </Card>

          {/* Approvals List */}
          <div className="space-y-4">
            {filteredApprovals.map((item) => (
              <Card key={item.id} hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority} priority
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Submitted by: <strong>{item.submitter}</strong></span>
                        <span>•</span>
                        <span>{item.submittedAt}</span>
                        {item.type === 'course' && (
                          <>
                            <span>•</span>
                            <span>${item.price}</span>
                            <span>•</span>
                            <span>{item.lessons} lessons</span>
                          </>
                        )}
                      </div>

                      {item.type === 'instructor' && item.qualifications && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Qualifications:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {item.qualifications.slice(0, 2).map((qual, index) => (
                              <li key={index}>{qual}</li>
                            ))}
                            {item.qualifications.length > 2 && (
                              <li>+{item.qualifications.length - 2} more...</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {item.type === 'content' && item.changes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Changes:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {item.changes.slice(0, 2).map((change, index) => (
                              <li key={index}>{change}</li>
                            ))}
                            {item.changes.length > 2 && (
                              <li>+{item.changes.length - 2} more changes...</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDetailsModalOpen(true);
                      }}
                      className="flex items-center space-x-1 px-3 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Review</span>
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}

            {filteredApprovals.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                  <p className="text-gray-600">
                    {filterType === 'all' 
                      ? 'All items have been reviewed.' 
                      : `No pending ${filterType} approvals.`
                    }
                  </p>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedItem(null);
          }}
          title={`Review ${selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}`}
          size="xl"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedItem.title}</h3>
              <p className="text-gray-600">{selectedItem.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Submission Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Submitted by:</span> {selectedItem.submitter}</p>
                  <p><span className="font-medium">Email:</span> {selectedItem.submitterEmail}</p>
                  <p><span className="font-medium">Date:</span> {selectedItem.submittedAt}</p>
                  <p><span className="font-medium">Priority:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedItem.priority)}`}>
                      {selectedItem.priority}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                {selectedItem.type === 'course' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Course Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Category:</span> {selectedItem.category}</p>
                      <p><span className="font-medium">Price:</span> ${selectedItem.price}</p>
                      <p><span className="font-medium">Lessons:</span> {selectedItem.lessons}</p>
                      <p><span className="font-medium">Duration:</span> {selectedItem.duration}</p>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'instructor' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Links</h4>
                    <div className="space-y-2 text-sm">
                      <p><a href={selectedItem.portfolio} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">Portfolio</a></p>
                      <p><a href={selectedItem.linkedin} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">LinkedIn</a></p>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'content' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Course</h4>
                    <p className="text-sm">{selectedItem.courseName}</p>
                  </div>
                )}
              </div>
            </div>

            {selectedItem.type === 'instructor' && selectedItem.qualifications && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Qualifications</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {selectedItem.qualifications.map((qual, index) => (
                    <li key={index}>{qual}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedItem.type === 'content' && selectedItem.changes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Proposed Changes</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {selectedItem.changes.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedItem.type === 'course' && selectedItem.thumbnail && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Course Thumbnail</h4>
                <img
                  src={selectedItem.thumbnail}
                  alt="Course thumbnail"
                  className="w-64 h-40 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleReject(selectedItem.id);
                  setIsDetailsModalOpen(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedItem.id);
                  setIsDetailsModalOpen(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminApprovalsPage;