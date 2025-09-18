import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';
import apiService from '../services/api';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate learner focused on web development and modern technologies.',
    dateOfBirth: '1995-06-15',
    linkedIn: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    website: 'https://johndoe.dev'
  });

  const [achievements, setAchievements] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalHours: 0,
    certificates: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Function to calculate achievements based on user progress
  const calculateAchievements = (courses: any[], quizzes: any[]) => {
    const earnedAchievements: any[] = [];
    const completedCourses = courses.filter(course =>
      course.progress === 100 || course.progress === '100'
    );
    const totalCourses = courses.length;
    const totalHours = courses.reduce((total: number, course: any) =>
      total + (course.course?.duration || course.duration || 0), 0
    );

    // Course completion achievements
    if (completedCourses.length >= 1) {
      earnedAchievements.push({
        id: 'first-course',
        title: 'First Steps',
        description: 'Completed your first course',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '🎓',
        type: 'course-completion'
      });
    }

    if (completedCourses.length >= 3) {
      earnedAchievements.push({
        id: 'dedicated-learner',
        title: 'Dedicated Learner',
        description: 'Completed 3 courses',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '🏆',
        type: 'course-completion'
      });
    }

    if (completedCourses.length >= 5) {
      earnedAchievements.push({
        id: 'knowledge-seeker',
        title: 'Knowledge Seeker',
        description: 'Completed 5 courses',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '🌟',
        type: 'course-completion'
      });
    }

    if (completedCourses.length >= 10) {
      earnedAchievements.push({
        id: 'course-master',
        title: 'Course Master',
        description: 'Completed 10 courses',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '👑',
        type: 'course-completion'
      });
    }

    // Learning hours achievements
    if (totalHours >= 10) {
      earnedAchievements.push({
        id: 'time-investor',
        title: 'Time Investor',
        description: 'Spent 10+ hours learning',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '⏰',
        type: 'learning-hours'
      });
    }

    if (totalHours >= 50) {
      earnedAchievements.push({
        id: 'learning-enthusiast',
        title: 'Learning Enthusiast',
        description: 'Spent 50+ hours learning',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '📚',
        type: 'learning-hours'
      });
    }

    if (totalHours >= 100) {
      earnedAchievements.push({
        id: 'knowledge-hunter',
        title: 'Knowledge Hunter',
        description: 'Spent 100+ hours learning',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '🔍',
        type: 'learning-hours'
      });
    }

    // Quiz performance achievements
    const completedQuizzes = quizzes.filter(quiz =>
      quiz.status === 'completed' && quiz.score !== undefined
    );

    if (completedQuizzes.length >= 1) {
      earnedAchievements.push({
        id: 'quiz-taker',
        title: 'Quiz Taker',
        description: 'Completed your first quiz',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '📝',
        type: 'quiz-completion'
      });
    }

    if (completedQuizzes.length >= 5) {
      earnedAchievements.push({
        id: 'quiz-regular',
        title: 'Quiz Regular',
        description: 'Completed 5 quizzes',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '📊',
        type: 'quiz-completion'
      });
    }

    // High score achievements
    const highScoreQuizzes = completedQuizzes.filter(quiz => quiz.score >= 90);
    if (highScoreQuizzes.length >= 1) {
      earnedAchievements.push({
        id: 'high-achiever',
        title: 'High Achiever',
        description: 'Scored 90% or higher on a quiz',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '🧠',
        type: 'quiz-performance'
      });
    }

    if (highScoreQuizzes.length >= 3) {
      earnedAchievements.push({
        id: 'quiz-master',
        title: 'Quiz Master',
        description: 'Scored 90%+ on 3 quizzes',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '🎯',
        type: 'quiz-performance'
      });
    }

    // Perfect score achievement
    const perfectQuizzes = completedQuizzes.filter(quiz => quiz.score === 100);
    if (perfectQuizzes.length >= 1) {
      earnedAchievements.push({
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieved a perfect score on a quiz',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: '💯',
        type: 'quiz-performance'
      });
    }

    // Consistency achievement
    if (completedQuizzes.length >= 3) {
      const averageScore = completedQuizzes.reduce((sum: number, quiz: any) => sum + quiz.score, 0) / completedQuizzes.length;
      if (averageScore >= 85) {
        earnedAchievements.push({
          id: 'consistent-performer',
          title: 'Consistent Performer',
          description: 'Maintained 85%+ average across 3+ quizzes',
          earnedAt: new Date().toISOString().split('T')[0],
          icon: '📈',
          type: 'quiz-performance'
        });
      }
    }

    return earnedAchievements;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch enrolled courses and quizzes in parallel
        const [enrollmentsResponse, quizzesResponse] = await Promise.all([
          apiService.getEnrollments(),
          apiService.getQuizzes()
        ]);

        let courses: any[] = [];
        let quizzes: any[] = [];

        if (enrollmentsResponse.success && enrollmentsResponse.data) {
          courses = enrollmentsResponse.data;
          setEnrolledCourses(courses);

          // Calculate stats from enrolled courses
          const coursesEnrolled = courses.length;
          const coursesCompleted = courses.filter((course: any) =>
            course.progress === 100 || course.progress === '100'
          ).length;
          const totalHours = courses.reduce((total: number, course: any) =>
            total + (course.course?.duration || course.duration || 0), 0
          );

          setQuickStats({
            coursesEnrolled,
            coursesCompleted,
            totalHours,
            certificates: coursesCompleted // Assume 1 certificate per completed course
          });
        } else {
          courses = [];
          setEnrolledCourses([]);
          setQuickStats({
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalHours: 0,
            certificates: 0
          });
        }

        if (quizzesResponse.success && quizzesResponse.data) {
          quizzes = quizzesResponse.data;
          setQuizResults(quizzes);
        } else {
          quizzes = [];
          setQuizResults([]);
        }

        // Calculate real achievements based on course completion and quiz performance
        const earnedAchievements = calculateAchievements(courses, quizzes);
        setAchievements(earnedAchievements);

      } catch (error) {
        console.error('Failed to load profile data:', error);
        showToast('error', 'Failed to load profile data');
        setEnrolledCourses([]);
        setQuizResults([]);
        setAchievements([]);
        setQuickStats({
          coursesEnrolled: 0,
          coursesCompleted: 0,
          totalHours: 0,
          certificates: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [showToast]);

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email
      });
    }
    setIsEditing(false);
    showToast('success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      bio: 'Passionate learner focused on web development and modern technologies.',
      dateOfBirth: '1995-06-15',
      linkedIn: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev'
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'student'} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                <p className="text-gray-600">Manage your account settings and preferences</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                      <div className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50">
                          <Camera className="h-4 w-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                      <p className="text-gray-600 capitalize">{user?.role}</p>
                      <p className="text-sm text-gray-500">Member since January 2024</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.location}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.dateOfBirth}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.bio}</p>
                    )}
                  </div>
                </Card>

                {/* Social Links */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.linkedIn}
                          onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      ) : (
                        <a
                          href={formData.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 break-all"
                        >
                          {formData.linkedIn}
                        </a>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.github}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      ) : (
                        <a
                          href={formData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 break-all"
                        >
                          {formData.github}
                        </a>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      ) : (
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 break-all"
                        >
                          {formData.website}
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Achievements */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Loading achievements...</p>
                      </div>
                    ) : achievements.length > 0 ? (
                      achievements.map((achievement) => {
                        const getTypeColor = (type: string) => {
                          switch (type) {
                            case 'course-completion': return 'bg-blue-100 text-blue-800';
                            case 'learning-hours': return 'bg-green-100 text-green-800';
                            case 'quiz-completion': return 'bg-purple-100 text-purple-800';
                            case 'quiz-performance': return 'bg-orange-100 text-orange-800';
                            default: return 'bg-gray-100 text-gray-800';
                          }
                        };

                        const getTypeLabel = (type: string) => {
                          switch (type) {
                            case 'course-completion': return 'Course';
                            case 'learning-hours': return 'Learning';
                            case 'quiz-completion': return 'Quiz';
                            case 'quiz-performance': return 'Performance';
                            default: return 'General';
                          }
                        };

                        return (
                          <div key={achievement._id || achievement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl">{achievement.icon || '🏆'}</div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(achievement.type)}`}>
                                  {getTypeLabel(achievement.type)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{achievement.description}</p>
                              <p className="text-xs text-gray-500">
                                Earned on {achievement.earnedAt || achievement.date || 'Recently'}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600">No achievements yet</p>
                        <p className="text-xs text-gray-500 mt-1">Complete courses to earn achievements!</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Learning Progress */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Loading progress...</p>
                      </div>
                    ) : enrolledCourses.length > 0 ? (
                      enrolledCourses.map((course) => (
                        <div
                          key={course._id || course.id}
                          onClick={() => navigate(`/course/${course.course?._id || course.course?.id || course.id}`)}
                          className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {course.course?.title || course.title}
                            </h4>
                            <span className="text-sm text-gray-600">{course.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress || 0}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            by {course.course?.instructor?.name || course.instructor || 'Unknown Instructor'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600">No enrolled courses yet</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courses Enrolled</span>
                      <span className="font-medium text-gray-900">{quickStats.coursesEnrolled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courses Completed</span>
                      <span className="font-medium text-gray-900">{quickStats.coursesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Hours</span>
                      <span className="font-medium text-gray-900">{quickStats.totalHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certificates</span>
                      <span className="font-medium text-gray-900">{quickStats.certificates}</span>
                    </div>
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

export default ProfilePage;