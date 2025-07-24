import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  BookOpen, 
  ClipboardList, 
  MessageSquare, 
  User, 
  PlusCircle, 
  FileText, 
  Users, 
  BarChart3,
  CheckSquare,
  LogOut,
  Bell,
  Settings,
  HelpCircle,
  Search
} from 'lucide-react';
import Logo from './Logo';
import { useUser } from '../context/UserContext';

interface SidebarProps {
  userRole: 'student' | 'instructor' | 'admin';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const menuItems = {
    student: [
      { icon: BookOpen, label: 'My Courses', path: '/dashboard/student' },
      { icon: Search, label: 'Browse Courses', path: '/courses' },
      { icon: ClipboardList, label: 'Assignments', path: '/assignments' },
      { icon: CheckSquare, label: 'Quizzes', path: '/quizzes' },
      { icon: MessageSquare, label: 'Forum', path: '/forum' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
      { icon: User, label: 'Profile', path: '/profile' },
      { icon: Settings, label: 'Settings', path: '/settings' },
      { icon: HelpCircle, label: 'Help', path: '/help' }
    ],
    instructor: [
      { icon: BookOpen, label: 'My Courses', path: '/dashboard/instructor' },
      { icon: PlusCircle, label: 'Create Course', path: '/create-course' },
      { icon: FileText, label: 'Submissions', path: '/submissions' },
      { icon: MessageSquare, label: 'Forum', path: '/forum' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
      { icon: User, label: 'Profile', path: '/profile' },
      { icon: Settings, label: 'Settings', path: '/settings' },
      { icon: HelpCircle, label: 'Help', path: '/help' }
    ],
    admin: [
      { icon: Users, label: 'Users', path: '/dashboard/admin' },
      { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
      { icon: CheckSquare, label: 'Approvals', path: '/admin/approvals' },
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
      { icon: User, label: 'Profile', path: '/profile' },
      { icon: Settings, label: 'Settings', path: '/settings' },
      { icon: HelpCircle, label: 'Help', path: '/help' }
    ]
  };

  const currentMenuItems = menuItems[userRole];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Logo size="md" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {currentMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;