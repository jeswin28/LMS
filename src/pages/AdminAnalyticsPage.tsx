import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, BookOpen, Calendar, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useUser } from '../context/UserContext';

const AdminAnalyticsPage: React.FC = () => {
  const { user } = useUser();
  const [dateRange, setDateRange] = useState('30d');

  // Mock analytics data
  const stats = {
    totalRevenue: 125680,
    revenueGrowth: 23.5,
    totalUsers: 2547,
    userGrowth: 12.3,
    activeCourses: 124,
    courseGrowth: 8.1,
    completionRate: 78.5,
    completionGrowth: 5.2
  };

  const revenueData = [
    { month: 'Jan', revenue: 8500, users: 180 },
    { month: 'Feb', revenue: 12300, users: 220 },
    { month: 'Mar', revenue: 15600, users: 280 },
    { month: 'Apr', revenue: 18900, users: 320 },
    { month: 'May', revenue: 22100, users: 380 },
    { month: 'Jun', revenue: 25400, users: 420 }
  ];

  const topCourses = [
    {
      id: 1,
      title: 'React Development Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      students: 156,
      revenue: 15599.44,
      rating: 4.8,
      completion: 85
    },
    {
      id: 2,
      title: 'Node.js Backend Development',
      instructor: 'Prof. David Miller',
      students: 203,
      revenue: 26407.97,
      rating: 4.7,
      completion: 78
    },
    {
      id: 3,
      title: 'Advanced JavaScript Concepts',
      instructor: 'Michael Chen',
      students: 89,
      revenue: 7119.11,
      rating: 4.9,
      completion: 92
    },
    {
      id: 4,
      title: 'Digital Marketing Mastery',
      instructor: 'Alex Thompson',
      students: 78,
      revenue: 5459.22,
      rating: 4.6,
      completion: 73
    },
    {
      id: 5,
      title: 'UI/UX Design Principles',
      instructor: 'Emily Rodriguez',
      students: 45,
      revenue: 4049.55,
      rating: 4.8,
      completion: 81
    }
  ];

  const userActivity = [
    { day: 'Mon', active: 1250, new: 45 },
    { day: 'Tue', active: 1380, new: 52 },
    { day: 'Wed', active: 1420, new: 38 },
    { day: 'Thu', active: 1560, new: 67 },
    { day: 'Fri', active: 1680, new: 73 },
    { day: 'Sat', active: 1200, new: 28 },
    { day: 'Sun', active: 980, new: 22 }
  ];

  const categoryPerformance = [
    { category: 'Programming', courses: 45, students: 1250, revenue: 87500 },
    { category: 'Design', courses: 28, students: 680, revenue: 45200 },
    { category: 'Marketing', courses: 22, students: 420, revenue: 28800 },
    { category: 'Data Science', courses: 18, students: 380, revenue: 52600 },
    { category: 'Business', courses: 11, students: 190, revenue: 15400 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    const color = growth >= 0 ? 'text-green-600' : 'text-red-600';
    return <span className={color}>{sign}{growth}%</span>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'admin'} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitor platform performance and user engagement</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-sm">{formatGrowth(stats.revenueGrowth)} from last month</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm">{formatGrowth(stats.userGrowth)} from last month</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeCourses}</p>
                  <p className="text-sm">{formatGrowth(stats.courseGrowth)} from last month</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                  <p className="text-sm">{formatGrowth(stats.completionGrowth)} from last month</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Last 6 months</span>
                </div>
              </div>
              <div className="space-y-4">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600 w-8">{data.month}</span>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.revenue / 30000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(data.revenue)}</p>
                      <p className="text-xs text-gray-600">{data.users} users</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* User Activity */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Daily Active Users</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>This week</span>
                </div>
              </div>
              <div className="space-y-4">
                {userActivity.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600 w-8">{data.day}</span>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.active / 2000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{data.active.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{data.new} new</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performing Courses */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Courses</h3>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{course.title}</h4>
                      <p className="text-xs text-gray-600">by {course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(course.revenue)}</p>
                      <p className="text-xs text-gray-600">{course.students} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Category Performance */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Performance</h3>
              <div className="space-y-4">
                {categoryPerformance.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{category.category}</span>
                      <span className="text-sm text-gray-600">{formatCurrency(category.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(category.revenue / 100000) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{category.courses} courses</span>
                      <span>{category.students} students</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;