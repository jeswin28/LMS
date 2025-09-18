import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Filter, Mail, MessageSquare, Award, BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';
import apiService from '../services/api';

const NotificationsPage: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiService.getNotifications();
        if (response.success && response.data) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
        showToast('error', 'Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [showToast]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await apiService.markNotificationAsRead(id);
      if (response.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        showToast('success', 'Notification marked as read');
      } else {
        showToast('error', response.error || 'Failed to mark notification as read');
      }
    } catch (error) {
      showToast('error', 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await apiService.markAllNotificationsAsRead();
      if (response.success) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        showToast('success', 'All notifications marked as read');
      } else {
        showToast('error', response.error || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      showToast('error', 'Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiService.deleteNotification(id);
      if (response.success) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        showToast('success', 'Notification deleted');
      } else {
        showToast('error', response.error || 'Failed to delete notification');
      }
    } catch (error) {
      showToast('error', 'Failed to delete notification');
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        const response = await apiService.deleteAllNotifications();
        if (response.success) {
          setNotifications([]);
          showToast('success', 'All notifications deleted');
        } else {
          showToast('error', response.error || 'Failed to delete all notifications');
        }
      } catch (error) {
        showToast('error', 'Failed to delete all notifications');
      }
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
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === filterOption.value
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
            {isLoading ? (
              <Card>
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading notifications...</p>
                </div>
              </Card>
            ) : (
              <>
                {filteredNotifications.map((notification) => {
                  // Map notification type to icon and colors
                  const getNotificationIcon = (type: string) => {
                    switch (type) {
                      case 'assignment': return BookOpen;
                      case 'grade': return Award;
                      case 'message': return MessageSquare;
                      case 'announcement': return Bell;
                      case 'reminder': return Mail;
                      case 'achievement': return Award;
                      default: return Bell;
                    }
                  };

                  const getNotificationColors = (type: string) => {
                    switch (type) {
                      case 'assignment': return { color: 'text-blue-600', bgColor: 'bg-blue-100' };
                      case 'grade': return { color: 'text-green-600', bgColor: 'bg-green-100' };
                      case 'message': return { color: 'text-purple-600', bgColor: 'bg-purple-100' };
                      case 'announcement': return { color: 'text-orange-600', bgColor: 'bg-orange-100' };
                      case 'reminder': return { color: 'text-red-600', bgColor: 'bg-red-100' };
                      case 'achievement': return { color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
                      default: return { color: 'text-gray-600', bgColor: 'bg-gray-100' };
                    }
                  };

                  const IconComponent = getNotificationIcon(notification.type);
                  const colors = getNotificationColors(notification.type);

                  return (
                    <Card key={notification.id} hover className={`${!notification.read ? 'border-l-4 border-l-emerald-500' : ''}`}>
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${colors.bgColor}`}>
                          <IconComponent className={`h-5 w-5 ${colors.color}`} />
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
                                <span>{notification.time || notification.createdAt}</span>
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
                  );
                })}

                {filteredNotifications.length === 0 && !isLoading && (
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;