import React, { useState, useEffect } from 'react';
import { Download, Eye, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';
import apiService from '../services/api';
import { useToast } from '../components/ToastProvider';

const SubmissionsPage: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await apiService.getSubmissions();
        if (response.success && response.data) {
          setSubmissions(response.data);
        }
      } catch (error) {
        console.error('Failed to load submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleGradeSubmission = () => {
    if (grade && feedback.trim()) {
      showToast('success', 'Submission graded successfully!');
      setIsGradingModalOpen(false);
      setSelectedSubmission(null);
      setGrade('');
      setFeedback('');
    } else {
      showToast('error', 'Please provide both grade and feedback');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs_revision':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'needs_revision':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filterStatus === 'all') return true;
    return submission.status === filterStatus;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    needsRevision: submissions.filter(s => s.status === 'needs_revision').length
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'instructor'} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Submissions</h1>
            <p className="text-gray-600">
              Review and grade student assignments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Submissions</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.graded}</p>
                  <p className="text-sm text-gray-600">Graded</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.needsRevision}</p>
                  <p className="text-sm text-gray-600">Needs Revision</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filter */}
          <Card className="mb-6" padding="md">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Submissions</option>
                <option value="pending">Pending Review</option>
                <option value="graded">Graded</option>
                <option value="needs_revision">Needs Revision</option>
              </select>
            </div>
          </Card>

          {/* Submissions List */}
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id} hover>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {submission.assignmentTitle}
                      </h3>
                      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        <span className="capitalize">{submission.status.replace('_', ' ')}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Student: <span className="font-medium text-gray-900">{submission.studentName}</span></p>
                        <p className="text-sm text-gray-600">Email: {submission.studentEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Course: <span className="font-medium text-gray-900">{submission.courseName}</span></p>
                        <p className="text-sm text-gray-600">Submitted: {submission.submittedAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>File: {submission.fileName}</span>
                      <span>Size: {submission.fileSize}</span>
                      {submission.currentGrade !== null && (
                        <span className="font-medium text-emerald-600">
                          Grade: {submission.currentGrade}/{submission.maxPoints}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {submission.submissionText}
                    </p>

                    {submission.feedback && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Feedback:</strong> {submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="flex items-center space-x-2 px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>

                    <a
                      href={submission.fileUrl}
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </a>

                    {submission.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setIsGradingModalOpen(true);
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Grade
                      </button>
                    )}

                    {submission.status === 'graded' && (
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setGrade(submission.currentGrade?.toString() || '');
                          setFeedback(submission.feedback || '');
                          setIsGradingModalOpen(true);
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Edit Grade
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {filteredSubmissions.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                  <p className="text-gray-600">
                    {filterStatus === 'all'
                      ? 'No student submissions yet.'
                      : `No submissions with status "${filterStatus.replace('_', ' ')}".`
                    }
                  </p>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && !isGradingModalOpen && (
        <Modal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          title="Submission Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Student</h4>
                <p className="text-gray-600">{selectedSubmission.studentName}</p>
                <p className="text-sm text-gray-500">{selectedSubmission.studentEmail}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Assignment</h4>
                <p className="text-gray-600">{selectedSubmission.assignmentTitle}</p>
                <p className="text-sm text-gray-500">{selectedSubmission.courseName}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Submission</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {selectedSubmission.submissionText}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Attached File</h4>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{selectedSubmission.fileName}</p>
                  <p className="text-sm text-gray-600">{selectedSubmission.fileSize}</p>
                </div>
                <a
                  href={selectedSubmission.fileUrl}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {selectedSubmission.currentGrade !== null && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Current Grade</h4>
                <p className="text-lg font-bold text-emerald-600">
                  {selectedSubmission.currentGrade}/{selectedSubmission.maxPoints}
                </p>
                {selectedSubmission.feedback && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{selectedSubmission.feedback}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {selectedSubmission.status === 'pending' && (
                <button
                  onClick={() => setIsGradingModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Grade Submission
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Grading Modal */}
      <Modal
        isOpen={isGradingModalOpen}
        onClose={() => {
          setIsGradingModalOpen(false);
          setSelectedSubmission(null);
          setGrade('');
          setFeedback('');
        }}
        title="Grade Submission"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {selectedSubmission?.assignmentTitle}
            </h4>
            <p className="text-sm text-gray-600">
              Student: {selectedSubmission?.studentName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade (out of {selectedSubmission?.maxPoints})
            </label>
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              min="0"
              max={selectedSubmission?.maxPoints}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter grade"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Provide detailed feedback for the student..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsGradingModalOpen(false);
                setSelectedSubmission(null);
                setGrade('');
                setFeedback('');
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGradeSubmission}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Submit Grade
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubmissionsPage;