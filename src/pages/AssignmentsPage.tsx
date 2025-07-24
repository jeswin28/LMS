import React, { useState } from 'react';
import { Calendar, Clock, FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';

const AssignmentsPage: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  const assignments = [
    {
      id: 1,
      title: 'React Component Design',
      course: 'React Development Fundamentals',
      description: 'Create a reusable component library with proper TypeScript definitions.',
      dueDate: '2024-02-15',
      status: 'pending',
      points: 100,
      submitted: false,
      timeRemaining: '3 days',
      instructions: 'Build at least 5 reusable components including Button, Input, Card, Modal, and Table. Each component should have proper TypeScript interfaces and be fully responsive.'
    },
    {
      id: 2,
      title: 'API Integration Project',
      course: 'Advanced JavaScript Concepts',
      description: 'Build a weather app that integrates with external APIs.',
      dueDate: '2024-02-20',
      status: 'submitted',
      points: 85,
      submitted: true,
      grade: 92,
      feedback: 'Excellent work! Great error handling and clean code structure.',
      timeRemaining: 'Submitted',
      instructions: 'Create a weather application that fetches data from OpenWeatherMap API and displays current weather and 5-day forecast.'
    },
    {
      id: 3,
      title: 'Database Schema Design',
      course: 'Node.js Backend Development',
      description: 'Design and implement a database schema for an e-commerce platform.',
      dueDate: '2024-02-25',
      status: 'overdue',
      points: 120,
      submitted: false,
      timeRemaining: 'Overdue by 2 days',
      instructions: 'Design a complete database schema including users, products, orders, and inventory management. Include proper relationships and constraints.'
    },
    {
      id: 4,
      title: 'UI/UX Case Study',
      course: 'UI/UX Design Principles',
      description: 'Conduct a complete UX audit of an existing application.',
      dueDate: '2024-03-01',
      status: 'upcoming',
      points: 90,
      submitted: false,
      timeRemaining: '2 weeks',
      instructions: 'Choose a popular mobile app and conduct a comprehensive UX audit. Identify pain points and propose solutions with wireframes and prototypes.'
    }
  ];

  const handleSubmission = () => {
    if (submissionFile || submissionText.trim()) {
      showToast('success', 'Assignment submitted successfully!');
      setIsSubmissionModalOpen(false);
      setSubmissionFile(null);
      setSubmissionText('');
      setSelectedAssignment(null);
    } else {
      showToast('error', 'Please provide either a file or text submission');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'student'} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
            <p className="text-gray-600">
              Track your assignments, submit work, and view feedback
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-sm text-gray-600">Total Assignments</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-sm text-gray-600">Overdue</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Assignments List */}
          <div className="space-y-6">
            {assignments.map((assignment) => (
              <Card key={assignment.id} hover>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {assignment.title}
                      </h3>
                      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)}
                        <span className="capitalize">{assignment.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{assignment.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{assignment.timeRemaining}</span>
                      </div>
                      <span>Course: {assignment.course}</span>
                      <span>Points: {assignment.points}</span>
                      {assignment.grade && (
                        <span className="font-medium text-green-600">
                          Grade: {assignment.grade}%
                        </span>
                      )}
                    </div>
                    {assignment.feedback && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Feedback:</strong> {assignment.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      View Details
                    </button>
                    {!assignment.submitted && assignment.status !== 'overdue' && (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setIsSubmissionModalOpen(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Submit</span>
                      </button>
                    )}
                    {assignment.submitted && (
                      <button
                        onClick={() => navigate(`/certificate/${assignment.id}`)}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        View Certificate
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Assignment Details Modal */}
      {selectedAssignment && !isSubmissionModalOpen && (
        <Modal
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          title={selectedAssignment.title}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Course</h4>
              <p className="text-gray-600">{selectedAssignment.course}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
              <p className="text-gray-600">{selectedAssignment.instructions}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Due Date</h4>
                <p className="text-gray-600">{selectedAssignment.dueDate}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Points</h4>
                <p className="text-gray-600">{selectedAssignment.points}</p>
              </div>
            </div>
            {!selectedAssignment.submitted && selectedAssignment.status !== 'overdue' && (
              <div className="pt-4">
                <button
                  onClick={() => setIsSubmissionModalOpen(true)}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Submit Assignment
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Submission Modal */}
      <Modal
        isOpen={isSubmissionModalOpen}
        onClose={() => {
          setIsSubmissionModalOpen(false);
          setSelectedAssignment(null);
        }}
        title="Submit Assignment"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {selectedAssignment?.title}
            </h4>
            <p className="text-sm text-gray-600">
              Due: {selectedAssignment?.dueDate}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {submissionFile ? (
                <div>
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-900 font-medium">{submissionFile.name}</p>
                  <button
                    onClick={() => setSubmissionFile(null)}
                    className="text-red-600 text-sm mt-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm">
                    <label className="text-emerald-600 cursor-pointer hover:text-emerald-700">
                      Choose file to upload
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Submission (Optional)
            </label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your submission text, notes, or comments..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsSubmissionModalOpen(false);
                setSelectedAssignment(null);
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmission}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Submit Assignment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignmentsPage;