import React, { useState } from 'react';
import { Bell, Check, Trash2, Filter, Mail, MessageSquare, Award, BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';

const NotificationsPage: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'assignment',
      title: 'New Assignment: React Component Design',
      message: 'A new assignment has been posted in React Development Fundamentals',
      course: 'React Development Fundamentals',
      time: '2 hours ago',
      read: false,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'grade',
      title: 'Assignment Graded',
      message: 'Your API Integration Project has been graded: 92/100',
      course: 'Advanced JavaScript Concepts',
      time: '5 hours ago',
      read: false,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message from Dr. Sarah Johnson',
      message: 'Great work on your latest submission! Keep it up.',
      course: 'React Development Fundamentals',
      time: '1 day ago',
      read: true,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 4,
      type: 'announcement',
      title: 'Course Update Available',
      message: 'New lessons have been added to Node.js Backend Development',
      course: 'Node.js Backend Development',
      time: '2 days ago',
      read: true,
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Quiz Reminder',
      message: 'JavaScript Fundamentals Quiz is due in 2 days',
      course: 'Advanced JavaScript Concepts',
      time: '3 days ago',
      read: false,
      icon: Mail,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 6,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You\'ve completed 5 courses and earned the "Dedicated Learner" badge',
      course: null,
      time: '1 week ago',
      read: true,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    showToast('success', 'Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    showToast('success', 'All notifications marked as read');
  };

  const handleDelete = (id: number) => {
    showToast('success', 'Notification deleted');
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      showToast('success', 'All notifications deleted');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'student'} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                Stay updated with your learning progress and course activities
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Mark All Read</span>
                </button>
              )}
              <button
                onClick={handleDeleteAll}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Mail className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                  <p className="text-sm text-gray-600">Unread</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.type === 'grade').length}
                  </p>
                  <p className="text-sm text-gray-600">Grades</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.type === 'message').length}
                  </p>
                  <p className="text-sm text-gray-600">Messages</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6" padding="md">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'unread', label: 'Unread' },
                  { value: 'assignment', label: 'Assignments' },
                  { value: 'grade', label: 'Grades' },
                  { value: 'message', label: 'Messages' },
                  { value: 'announcement', label: 'Announcements' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.value}
                    onClick={() => setFilter(filterOption.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === filterOption.value
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id} hover className={`${!notification.read ? 'border-l-4 border-l-emerald-500' : ''}`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${notification.bgColor}`}>
                    <notification.icon className={`h-5 w-5 ${notification.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{notification.time}</span>
                          {notification.course && (
                            <>
                              <span>•</span>
                              <span>{notification.course}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredNotifications.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">
                    {filter === 'all' 
                      ? 'You\'re all caught up!' 
                      : `No ${filter} notifications found.`
                    }
                  </p>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;