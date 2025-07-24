import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, Award, Calendar } from 'lucide-react';
import Card from '../components/Card';
import Logo from '../components/Logo';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';

const CertificatePage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { showToast } = useToast();

  // Mock certificate data
  const certificate = {
    id: `CERT-${courseId}-${user?.id}`,
    courseName: 'React Development Fundamentals',
    studentName: user?.name || 'Student Name',
    instructorName: 'Dr. Sarah Johnson',
    completionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    grade: 'A+',
    creditsEarned: '3.0',
    verificationUrl: `https://nexfern.academy/verify/${courseId}-${user?.id}`
  };

  const handleDownload = () => {
    showToast('success', 'Certificate download started!');
    // In a real app, this would trigger a PDF download
    const link = document.createElement('a');
    link.href = '#'; // Would be actual PDF URL
    link.download = `certificate-${certificate.id}.pdf`;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Nexfern Academy Certificate',
        text: `I just completed ${certificate.courseName} at Nexfern Academy!`,
        url: certificate.verificationUrl
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(certificate.verificationUrl);
      showToast('success', 'Certificate URL copied to clipboard!');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-emerald-600 hover:text-emerald-700 mb-4"
          >
            ← Back to Course
          </button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Award className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Congratulations!</h1>
          </div>
          <p className="text-gray-600 text-lg">
            You have successfully completed the course and earned your certificate.
          </p>
        </div>

        {/* Certificate */}
        <Card className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <div className="text-center space-y-6 py-8">
            {/* Header */}
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>

            {/* Certificate Title */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Certificate of Completion
              </h2>
              <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
            </div>

            {/* Recipient */}
            <div>
              <p className="text-lg text-gray-600 mb-2">This is to certify that</p>
              <h3 className="text-3xl font-bold text-emerald-600 mb-4">
                {certificate.studentName}
              </h3>
              <p className="text-lg text-gray-600">has successfully completed the course</p>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-lg p-6 mx-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                {certificate.courseName}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Instructor</p>
                  <p className="font-semibold text-gray-900">{certificate.instructorName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Grade Achieved</p>
                  <p className="font-semibold text-gray-900">{certificate.grade}</p>
                </div>
                <div>
                  <p className="text-gray-600">Credits Earned</p>
                  <p className="font-semibold text-gray-900">{certificate.creditsEarned}</p>
                </div>
              </div>
            </div>

            {/* Date and Signature */}
            <div className="flex justify-between items-end mx-8 pt-8">
              <div className="text-left">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Completed on</span>
                </div>
                <p className="font-semibold text-gray-900">{certificate.completionDate}</p>
              </div>
              <div className="text-right">
                <div className="w-32 border-b border-gray-400 mb-1"></div>
                <p className="text-sm text-gray-600">Nexfern Academy</p>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="text-xs text-gray-500 pt-4 border-t border-gray-200 mx-8">
              Certificate ID: {certificate.id}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Download Certificate</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span>Share Certificate</span>
          </button>
        </div>

        {/* Verification Info */}
        <Card className="mt-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Certificate Verification
            </h3>
            <p className="text-gray-600 mb-4">
              This certificate can be verified using the following URL:
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <code className="text-sm text-gray-800 break-all">
                {certificate.verificationUrl}
              </code>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => navigate('/courses')}
              className="text-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Explore More Courses</h4>
              <p className="text-sm text-gray-600">Continue learning with our advanced courses</p>
            </div>
            <div 
              onClick={() => window.open('https://linkedin.com', '_blank')}
              className="text-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💼</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Update LinkedIn</h4>
              <p className="text-sm text-gray-600">Add this certification to your profile</p>
            </div>
            <div 
              onClick={() => navigate(`/course/${courseId}`)}
              className="text-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌟</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Leave a Review</h4>
              <p className="text-sm text-gray-600">Help others by sharing your experience</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CertificatePage;