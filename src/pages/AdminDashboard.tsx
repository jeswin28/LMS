import React, { useEffect, useState } from 'react';
import { Users, BookOpen, CheckCircle, TrendingUp, MoreVertical, UserPlus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastProvider';
import apiService from '../services/api';

const AdminDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState({
    name: '',
    email: '',
    role: 'student',
    password: ''
  });

  const [stats, setStats] = useState([
    { label: 'Total Users', value: '0', change: '0%', icon: Users, color: 'text-blue-600' },
    { label: 'Active Courses', value: '0', change: '0%', icon: BookOpen, color: 'text-emerald-600' },
    { label: 'Pending Approvals', value: '0', change: '0%', icon: CheckCircle, color: 'text-orange-600' },
    { label: 'Monthly Revenue', value: '$0', change: '0%', icon: TrendingUp, color: 'text-purple-600' }
  ]);

  const [users, setUsers] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users
        const usersResponse = await apiService.getUsers();
        if (usersResponse.success && usersResponse.data) {
          setUsers(usersResponse.data.slice(0, 5)); // Show first 5 users
        }

        // Fetch analytics
        const analyticsResponse = await apiService.getAdminAnalytics();
        if (analyticsResponse.success && analyticsResponse.data) {
          const analytics = analyticsResponse.data;
          setStats([
            { label: 'Total Users', value: analytics.totalUsers?.toString() || '0', change: `${analytics.userGrowth || 0}%`, icon: Users, color: 'text-blue-600' },
            { label: 'Active Courses', value: analytics.activeCourses?.toString() || '0', change: `${analytics.courseGrowth || 0}%`, icon: BookOpen, color: 'text-emerald-600' },
            { label: 'Pending Approvals', value: analytics.pendingApprovals?.toString() || '0', change: '0%', icon: CheckCircle, color: 'text-orange-600' },
            { label: 'Monthly Revenue', value: `$${analytics.totalRevenue || 0}`, change: `${analytics.revenueGrowth || 0}%`, icon: TrendingUp, color: 'text-purple-600' }
          ]);
        }

        // Fetch pending approvals
        const approvalsResponse = await apiService.getPendingApprovals();
        if (approvalsResponse.success && approvalsResponse.data) {
          setPendingApprovals(approvalsResponse.data.slice(0, 3)); // Show first 3 approvals
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateUser = async () => {
    if (newUser.name && newUser.email && newUser.password) {
      try {
        const response = await apiService.createUser({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role
        });

        if (response.success) {
          showToast('success', 'User created successfully!');
          setIsCreateUserModalOpen(false);
          setNewUser({ name: '', email: '', role: 'student', password: '' });
        } else {
          showToast('error', response.error || 'Failed to create user');
        }
      } catch (error: any) {
        showToast('error', error.message || 'Failed to create user');
      }
    } else {
      showToast('error', 'Please fill in all required fields');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="admin" />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage users, courses, and platform analytics
              </p>
            </div>
            <button
              onClick={() => setIsCreateUserModalOpen(true)}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              <span>Create User</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} padding="md" hover>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Users Table */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View All
                </button>
              </div>
              <Card padding="sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'Instructor'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                              }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {user.joined}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Pending Approvals */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Approvals</h2>
              <Card>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${approval.type === 'Course'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                              }`}>
                              {approval.type}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900">{approval.title}</h4>
                          <p className="text-sm text-gray-600">by {approval.instructor}</p>
                          <p className="text-xs text-gray-500 mt-1">{approval.submitted}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* System Status */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">System Status</h3>
                <Card>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Server Status</span>
                      <span className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">Online</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">Connected</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Gateway</span>
                      <span className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-600">Maintenance</span>
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        title="Create New User"
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateUserModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Create User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;