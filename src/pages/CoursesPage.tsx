import React, { useState } from 'react';
import { Search, Filter, Star, Clock, Users, BookOpen, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useUser } from '../context/UserContext';

const CoursesPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const courses = [
    {
      id: 1,
      title: 'React Development Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      category: 'Programming',
      level: 'Beginner',
      rating: 4.8,
      students: 1234,
      duration: '12 hours',
      lessons: 24,
      price: 99.99,
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=400&h=250&fit=crop',
      description: 'Master React fundamentals with hands-on projects and real-world examples.',
      tags: ['React', 'JavaScript', 'Frontend'],
      enrolled: false
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      instructor: 'Michael Chen',
      category: 'Programming',
      level: 'Advanced',
      rating: 4.9,
      students: 856,
      duration: '8 hours',
      lessons: 18,
      price: 79.99,
      thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?w=400&h=250&fit=crop',
      description: 'Deep dive into advanced JavaScript concepts and modern ES6+ features.',
      tags: ['JavaScript', 'ES6', 'Advanced'],
      enrolled: true
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      instructor: 'Emily Rodriguez',
      category: 'Design',
      level: 'Intermediate',
      rating: 4.7,
      students: 642,
      duration: '10 hours',
      lessons: 20,
      price: 89.99,
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=400&h=250&fit=crop',
      description: 'Learn fundamental design principles and create stunning user interfaces.',
      tags: ['Design', 'UI', 'UX'],
      enrolled: false
    },
    {
      id: 4,
      title: 'Node.js Backend Development',
      instructor: 'Prof. David Miller',
      category: 'Programming',
      level: 'Intermediate',
      rating: 4.6,
      students: 923,
      duration: '15 hours',
      lessons: 32,
      price: 129.99,
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?w=400&h=250&fit=crop',
      description: 'Build scalable backend applications with Node.js and Express.',
      tags: ['Node.js', 'Backend', 'API'],
      enrolled: false
    },
    {
      id: 5,
      title: 'Digital Marketing Mastery',
      instructor: 'Alex Thompson',
      category: 'Marketing',
      level: 'Beginner',
      rating: 4.5,
      students: 567,
      duration: '6 hours',
      lessons: 15,
      price: 69.99,
      thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?w=400&h=250&fit=crop',
      description: 'Master digital marketing strategies and grow your online presence.',
      tags: ['Marketing', 'SEO', 'Social Media'],
      enrolled: false
    },
    {
      id: 6,
      title: 'Data Science with Python',
      instructor: 'Dr. Lisa Wang',
      category: 'Data Science',
      level: 'Advanced',
      rating: 4.8,
      students: 789,
      duration: '20 hours',
      lessons: 40,
      price: 149.99,
      thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?w=400&h=250&fit=crop',
      description: 'Learn data science fundamentals and machine learning with Python.',
      tags: ['Python', 'Data Science', 'ML'],
      enrolled: false
    }
  ];

  const categories = ['all', 'Programming', 'Design', 'Marketing', 'Data Science', 'Business'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.students - a.students;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const handleEnroll = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'student'} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Courses</h1>
            <p className="text-gray-600">Discover new skills and advance your career</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8" padding="md">
            <div className="flex flex-col lg:flex-row gap-4">
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
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map((course) => (
              <Card key={course.id} hover className="overflow-hidden">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                  {course.enrolled && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                        Enrolled
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-emerald-600 font-medium">{course.category}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
                  
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ${course.price}
                    </div>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        course.enrolled
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {course.enrolled ? 'Continue Learning' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {sortedCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursesPage;