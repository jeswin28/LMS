import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import apiService from '../services/api';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: any;
  dueDate: string;
  status: 'pending' | 'submitted' | 'overdue' | 'graded';
  grade?: number;
  feedback?: string;
  submission?: {
    fileUrl: string;
    submittedAt: string;
    comments: string;
  };
}

const AssignmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { showToast } = useToast();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionComments, setSubmissionComments] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await apiService.getAssignments();
        if (response.success) {
          setAssignments(response.data || []);
        }
      } catch (error) {
        showToast('error', 'Failed to load assignments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment || !submissionFile) {
      showToast('error', 'Please select a file to submit');
      return;
    }

    try {
      // In a real app, this would upload the file and submit the assignment
      const formData = new FormData();
      formData.append('file', submissionFile);
      formData.append('assignmentId', selectedAssignment._id);
      formData.append('comments', submissionComments);

      // Mock submission success
      setAssignments(prev => prev.map(assignment =>
        assignment._id === selectedAssignment._id
          ? {
            ...assignment,
            status: 'submitted',
            submission: {
              fileUrl: URL.createObjectURL(submissionFile),
              submittedAt: new Date().toISOString(),
              comments: submissionComments
            }
          }
          : assignment
      ));

      showToast('success', 'Assignment submitted successfully!');
      setShowSubmissionModal(false);
      setSelectedAssignment(null);
      setSubmissionFile(null);
      setSubmissionComments('');
    } catch (error) {
      showToast('error', 'Failed to submit assignment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Upload className="h-4 w-4" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="student" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="student" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assignments</h1>
            <p className="text-gray-600">
              Track your assignments, submit your work, and view feedback
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                <p className="text-sm text-gray-600">Total Assignments</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length}
                </p>
                <p className="text-sm text-gray-600">Submitted</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {assignments.filter(a => a.status === 'pending' && !isOverdue(a.dueDate)).length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {assignments.filter(a => isOverdue(a.dueDate)).length}
                </p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </Card>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment._id} hover>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)}
                        <span>{assignment.status}</span>
                      </span>
                      {isOverdue(assignment.dueDate) && assignment.status === 'pending' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{assignment.course?.title || 'Unknown Course'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      {assignment.grade && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Grade: {assignment.grade}%</span>
                        </div>
                      )}
                    </div>

                    {assignment.feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-1">Feedback:</p>
                        <p className="text-sm text-gray-600">{assignment.feedback}</p>
                      </div>
                    )}

                    {assignment.submission && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-1">Your Submission:</p>
                        <p className="text-sm text-gray-600 mb-2">{assignment.submission.comments}</p>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(assignment.submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {assignment.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmissionModal(true);
                        }}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        {isOverdue(assignment.dueDate) ? 'Submit Late' : 'Submit Assignment'}
                      </button>
                    )}

                    {assignment.status === 'submitted' && (
                      <button
                        onClick={() => navigate(`/course/${assignment.course?._id}`)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        View Course
                      </button>
                    )}

                    {assignment.status === 'graded' && (
                      <button
                        onClick={() => navigate(`/course/${assignment.course?._id}`)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        View Feedback
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {assignments.length === 0 && (
              <Card>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any assignments at the moment. Check back later or enroll in a course to get started.
                  </p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Browse Courses
                  </button>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submit Assignment: {selectedAssignment.title}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={submissionComments}
                  onChange={(e) => setSubmissionComments(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Add any comments about your submission..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSubmissionModal(false);
                    setSelectedAssignment(null);
                    setSubmissionFile(null);
                    setSubmissionComments('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  disabled={!submissionFile}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;