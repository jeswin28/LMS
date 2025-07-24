import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize, Download, FileText, MessageSquare, Send, ThumbsUp, Clock, Users, Star } from 'lucide-react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';

export const CourseDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600); // 1 hour
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const course = {
    id: 1,
    title: 'Advanced React Development',
    instructor: 'Dr. Sarah Johnson',
    rating: 4.8,
    students: 1234,
    duration: '12 hours',
    description: 'Master advanced React concepts including hooks, context, performance optimization, and modern patterns.',
    progress: 65
  };

  const videos = [
    { id: 1, title: 'Introduction to Advanced React', duration: '15:30', completed: true },
    { id: 2, title: 'Custom Hooks Deep Dive', duration: '22:45', completed: true },
    { id: 3, title: 'Context API and State Management', duration: '18:20', completed: false },
    { id: 4, title: 'Performance Optimization', duration: '25:10', completed: false },
    { id: 5, title: 'Testing React Applications', duration: '20:15', completed: false }
  ];

  const resources = [
    { id: 1, name: 'React Hooks Cheat Sheet', type: 'PDF', size: '2.3 MB' },
    { id: 2, name: 'Code Examples', type: 'ZIP', size: '5.1 MB' },
    { id: 3, name: 'Presentation Slides', type: 'PPT', size: '8.7 MB' }
  ];

  const comments = [
    {
      id: 1,
      user: 'Alex Chen',
      avatar: 'AC',
      time: '2 hours ago',
      content: 'Great explanation of custom hooks! The examples really helped me understand the concept.',
      likes: 12,
      replies: [
        {
          id: 2,
          user: 'Dr. Sarah Johnson',
          avatar: 'SJ',
          time: '1 hour ago',
          content: 'Thank you Alex! I\'m glad the examples were helpful.',
          likes: 5
        }
      ]
    },
    {
      id: 3,
      user: 'Maria Rodriguez',
      avatar: 'MR',
      time: '5 hours ago',
      content: 'Could you provide more examples of useCallback optimization?',
      likes: 8,
      replies: []
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the primary purpose of React hooks?',
      options: [
        'To replace class components entirely',
        'To allow state and lifecycle features in functional components',
        'To improve performance automatically',
        'To handle routing in React applications'
      ],
      correct: 1
    },
    {
      question: 'Which hook is used for side effects in React?',
      options: ['useState', 'useContext', 'useEffect', 'useReducer'],
      correct: 2
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, currentTime + seconds)));
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressChange = (newTime: number) => {
    setCurrentTime(newTime);
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const submitQuiz = () => {
    // Calculate score
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === quizQuestions[index].correct ? 1 : 0);
    }, 0);
    
    alert(`Quiz completed! Score: ${score}/${quizQuestions.length}`);
    setShowQuizModal(false);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.students} students
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {course.rating}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Progress</div>
            <ProgressBar progress={course.progress} className="w-32" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Video Player */}
          <Card className="mb-6">
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              {/* Video Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-lg">Video: {videos[2].title}</p>
                </div>
              </div>

              {/* Play/Pause Overlay */}
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity"
              >
                {isPlaying ? (
                  <Pause className="w-16 h-16 text-white" />
                ) : (
                  <Play className="w-16 h-16 text-white ml-2" />
                )}
              </button>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => handleProgressChange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:text-emerald-400 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    
                    <button
                      onClick={() => handleSkip(-10)}
                      className="text-white hover:text-emerald-400 transition-colors"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleSkip(10)}
                      className="text-white hover:text-emerald-400 transition-colors"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:text-emerald-400 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="bg-gray-800 text-white text-sm rounded px-2 py-1 border-none outline-none"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>

                    <button className="text-white hover:text-emerald-400 transition-colors">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Video Tabs */}
          <Card>
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {['overview', 'transcript', 'notes'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About this lesson</h3>
                  <p className="text-gray-600 mb-6">
                    In this lesson, we'll explore the Context API and how it can be used for state management
                    in React applications. We'll cover creating contexts, providers, and consuming context
                    values throughout your component tree.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
                      <div className="space-y-2">
                        {resources.map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{resource.name}</p>
                                <p className="text-sm text-gray-500">{resource.type} • {resource.size}</p>
                              </div>
                            </div>
                            <button className="text-emerald-600 hover:text-emerald-700 transition-colors">
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowQuizModal(true)}
                          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Take Quiz
                        </button>
                        <button 
                          onClick={() => navigate('/assignments')}
                          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Submit Assignment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transcript' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Transcript</h3>
                  <div className="prose max-w-none text-gray-600">
                    <p className="mb-4">
                      [00:00] Welcome back to our Advanced React course. In today's lesson, we're going to dive deep into the Context API and explore how it can revolutionize state management in your React applications.
                    </p>
                    <p className="mb-4">
                      [00:15] The Context API provides a way to pass data through the component tree without having to pass props down manually at every level. This is particularly useful for global state that many components need to access.
                    </p>
                    <p className="mb-4">
                      [00:30] Let's start by creating our first context. We'll use the createContext function from React to establish a new context for our user authentication state.
                    </p>
                    <p className="mb-4">
                      [00:45] Here's how we create a context: const AuthContext = React.createContext(). Notice that we can provide a default value as an argument to createContext.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">My Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes while watching the video..."
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => {
                        // Save notes logic here
                        alert('Notes saved successfully!');
                      }}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Discussion Section */}
          <Card className="mt-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Discussion</h3>
              
              {/* Add Comment */}
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ask a question or share your thoughts..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Post Comment</span>
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.user}</span>
                          <span className="text-sm text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-emerald-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{comment.likes}</span>
                          </button>
                          <button 
                            onClick={() => {
                              // Reply functionality
                              console.log('Reply to comment', comment.id);
                            }}
                            className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                          >
                            Reply
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                  {reply.avatar}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 text-sm">{reply.user}</span>
                                    <span className="text-xs text-gray-500">{reply.time}</span>
                                  </div>
                                  <p className="text-gray-700 text-sm mb-1">{reply.content}</p>
                                  <button className="flex items-center space-x-1 text-gray-500 hover:text-emerald-600 transition-colors">
                                    <ThumbsUp className="w-3 h-3" />
                                    <span className="text-xs">{reply.likes}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Course Content</h3>
          <div className="space-y-2">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  index === 2
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  // Switch to this video
                  console.log('Switch to video', video.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      video.completed
                        ? 'bg-emerald-600 text-white'
                        : index === 2
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {video.completed ? '✓' : index + 1}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        index === 2 ? 'text-emerald-900' : 'text-gray-900'
                      }`}>
                        {video.title}
                      </p>
                      <p className="text-sm text-gray-500">{video.duration}</p>
                    </div>
                  </div>
                  {index === 2 && (
                    <Play className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <Modal isOpen={showQuizModal} onClose={() => setShowQuizModal(false)} title="Lesson Quiz">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <div className="w-32">
              <ProgressBar progress={((currentQuestion + 1) / quizQuestions.length) * 100} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {quizQuestions[currentQuestion].question}
            </h3>
            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={selectedAnswers[currentQuestion] === index}
                    onChange={() => handleQuizAnswer(currentQuestion, index)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentQuestion === quizQuestions.length - 1 ? (
              <button
                onClick={submitQuiz}
                disabled={selectedAnswers.length !== quizQuestions.length}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CourseDetail;