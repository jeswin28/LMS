import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';

const QuizzesPage: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  const quizzes = [
    {
      id: 1,
      title: 'React Fundamentals Quiz',
      course: 'React Development Fundamentals',
      description: 'Test your knowledge of React basics including components, props, and state.',
      questions: 15,
      timeLimit: 30,
      attempts: 2,
      maxAttempts: 3,
      bestScore: 85,
      status: 'available',
      dueDate: '2024-02-20',
      questions_data: [
        {
          id: 1,
          question: 'What is the main purpose of React components?',
          options: [
            'To manage application state',
            'To create reusable UI elements',
            'To handle API requests',
            'To style the application'
          ],
          correct: 1
        },
        {
          id: 2,
          question: 'Which hook is used for managing component state?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correct: 1
        },
        {
          id: 3,
          question: 'What does JSX stand for?',
          options: [
            'JavaScript XML',
            'Java Syntax Extension',
            'JavaScript Extension',
            'Java XML'
          ],
          correct: 0
        }
      ]
    },
    {
      id: 2,
      title: 'JavaScript ES6+ Features',
      course: 'Advanced JavaScript Concepts',
      description: 'Quiz covering modern JavaScript features and syntax.',
      questions: 20,
      timeLimit: 45,
      attempts: 1,
      maxAttempts: 2,
      bestScore: 92,
      status: 'completed',
      dueDate: '2024-02-15',
      questions_data: []
    },
    {
      id: 3,
      title: 'Node.js Basics',
      course: 'Node.js Backend Development',
      description: 'Test your understanding of Node.js fundamentals and npm.',
      questions: 12,
      timeLimit: 25,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      status: 'upcoming',
      dueDate: '2024-02-25',
      questions_data: []
    },
    {
      id: 4,
      title: 'Design Principles Assessment',
      course: 'UI/UX Design Principles',
      description: 'Evaluate your knowledge of design theory and best practices.',
      questions: 18,
      timeLimit: 40,
      attempts: 3,
      maxAttempts: 3,
      bestScore: 78,
      status: 'expired',
      dueDate: '2024-02-10',
      questions_data: []
    }
  ];

  const startQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setIsQuizModalOpen(true);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeRemaining(quiz.timeLimit * 60);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions_data.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    const score = Math.floor(Math.random() * 30) + 70; // Mock score
    showToast('success', `Quiz submitted! Your score: ${score}%`);
    setIsQuizModalOpen(false);
    setQuizStarted(false);
    setSelectedQuiz(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'student'} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quizzes</h1>
            <p className="text-gray-600">
              Test your knowledge and track your progress
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">88%</p>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Play className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quizzes List */}
          <div className="space-y-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} hover>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {quiz.title}
                      </h3>
                      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)}`}>
                        {getStatusIcon(quiz.status)}
                        <span className="capitalize">{quiz.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{quiz.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span>{quiz.questions} questions</span>
                      <span>{quiz.timeLimit} minutes</span>
                      <span>Due: {quiz.dueDate}</span>
                      <span>Attempts: {quiz.attempts}/{quiz.maxAttempts}</span>
                      {quiz.bestScore && (
                        <span className="font-medium text-emerald-600">
                          Best Score: {quiz.bestScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Course: {quiz.course}</p>
                  </div>
                  <div className="flex space-x-3">
                    {quiz.status === 'available' && quiz.attempts < quiz.maxAttempts && (
                      <button
                        onClick={() => startQuiz(quiz)}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        <span>Start Quiz</span>
                      </button>
                    )}
                    {quiz.status === 'completed' && (
                      <button className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                        View Results
                      </button>
                    )}
                    {quiz.attempts >= quiz.maxAttempts && quiz.status === 'available' && (
                      <span className="px-4 py-2 text-gray-500 bg-gray-100 rounded-lg">
                        No attempts left
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Quiz Modal */}
      {selectedQuiz && (
        <Modal
          isOpen={isQuizModalOpen}
          onClose={() => {
            setIsQuizModalOpen(false);
            setQuizStarted(false);
            setSelectedQuiz(null);
          }}
          title={selectedQuiz.title}
          size="xl"
        >
          <div className="space-y-6">
            {/* Quiz Header */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">
                  Question {currentQuestion + 1} of {selectedQuiz.questions_data.length}
                </h4>
                <p className="text-sm text-gray-600">{selectedQuiz.course}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-sm text-gray-600">Time Remaining</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentQuestion + 1) / selectedQuiz.questions_data.length) * 100}%` 
                }}
              />
            </div>

            {/* Question */}
            {selectedQuiz.questions_data[currentQuestion] && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedQuiz.questions_data[currentQuestion].question}
                </h3>
                <div className="space-y-3">
                  {selectedQuiz.questions_data[currentQuestion].options.map((option: string, index: number) => (
                    <label
                      key={index}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        answers[currentQuestion] === index
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={index}
                        checked={answers[currentQuestion] === index}
                        onChange={() => handleAnswerSelect(currentQuestion, index)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex space-x-3">
                {currentQuestion < selectedQuiz.questions_data.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submitQuiz}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>

            {/* Question Navigator */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Question Navigator</h4>
              <div className="grid grid-cols-5 gap-2">
                {selectedQuiz.questions_data.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      index === currentQuestion
                        ? 'bg-emerald-600 text-white'
                        : answers[index] !== undefined
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuizzesPage;