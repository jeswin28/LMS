import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, BookOpen, FileText, CheckCircle, Clock, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import apiService from '../services/api';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number;
  isCompleted: boolean;
  order: number;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'overdue';
  grade?: number;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { showToast } = useToast();

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'assignments'>('overview');

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;

      try {
        // Fetch course details
        const courseResponse = await apiService.getCourse(id);
        if (courseResponse.success) {
          setCourse(courseResponse.data);
        }

        // Fetch assignments for this course
        const assignmentsResponse = await apiService.getAssignments();
        if (assignmentsResponse.success) {
          const courseAssignments = assignmentsResponse.data.filter(
            (assignment: any) => assignment.course === id
          );
          setAssignments(courseAssignments);
        }

        // Fetch lessons for this course
        const lessonsResponse = await apiService.getCourseLessons(id);
        if (lessonsResponse.success && lessonsResponse.data) {
          setLessons(lessonsResponse.data);
        }
      } catch (error) {
        showToast('error', 'Failed to load course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const response = await apiService.markLessonComplete(lessonId);
      if (response.success) {
        setLessons(prev => prev.map(lesson =>
          lesson._id === lessonId
            ? { ...lesson, isCompleted: true }
            : lesson
        ));
        showToast('success', 'Lesson marked as complete!');

        // Check if course is now completed and show achievement notification
        const updatedLessons = lessons.map(lesson =>
          lesson._id === lessonId
            ? { ...lesson, isCompleted: true }
            : lesson
        );
        const completedLessons = updatedLessons.filter(lesson => lesson.isCompleted).length;
        const totalLessons = updatedLessons.length;

        if (completedLessons === totalLessons && totalLessons > 0) {
          showToast('success', '🎉 Congratulations! You completed the course and earned an achievement!');
        }
      } else {
        showToast('error', response.error || 'Failed to mark lesson as complete');
      }
    } catch (error) {
      showToast('error', 'Failed to mark lesson as complete');
    }
  };

  const startAssignment = (assignment: Assignment) => {
    navigate(`/assignments/${assignment._id}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="student" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="student" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/dashboard/student')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const progress = (completedLessons / lessons.length) * 100;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          {/* Course Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600">by {course.instructor?.name || 'Unknown Instructor'}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-lg font-semibold text-emerald-600">{Math.round(progress)}%</p>
                </div>
                <ProgressBar progress={progress} className="w-32" />
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-8 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'lessons'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Lessons ({lessons.length})
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Assignments ({assignments.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Description</h3>
                    <p className="text-gray-600 mb-4">{course.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{course.duration || 0} hours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{assignments.length} assignments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{course.enrolledStudents || 0} students</span>
                      </div>
                    </div>

                    {currentLesson && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Current Lesson</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900">{currentLesson.title}</h5>
                          <p className="text-sm text-gray-600 mb-3">{currentLesson.description}</p>
                          <div className="flex items-center space-x-2">
                            <Play className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm text-gray-600">{currentLesson.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                <div>
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Lessons Completed</span>
                        <span className="font-semibold">{completedLessons}/{lessons.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Assignments Submitted</span>
                        <span className="font-semibold">
                          {assignments.filter(a => a.status === 'submitted').length}/{assignments.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Average Grade</span>
                        <span className="font-semibold">
                          {assignments.filter(a => a.grade).length > 0
                            ? Math.round(assignments.filter(a => a.grade).reduce((sum, a) => sum + (a.grade || 0), 0) / assignments.filter(a => a.grade).length)
                            : 'N/A'}%
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <Card key={lesson._id} hover className="cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-600">{lesson.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Play className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500">{lesson.duration} min</span>
                            </div>
                            {lesson.isCompleted && (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                <span className="text-xs text-emerald-600">Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLessonClick(lesson)}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                          {lesson.isCompleted ? 'Review' : 'Start'}
                        </button>
                        {!lesson.isCompleted && (
                          <button
                            onClick={() => markLessonComplete(lesson._id)}
                            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <Card key={assignment._id}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${assignment.status === 'submitted' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {assignment.status}
                          </span>
                          {assignment.grade && (
                            <span className="text-sm font-semibold text-emerald-600">
                              Grade: {assignment.grade}%
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => startAssignment(assignment)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        {assignment.status === 'submitted' ? 'View Submission' : 'Start Assignment'}
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;