import React, { useState, useEffect } from 'react';
import { Upload, Calendar, Clock, Video, CheckCircle, AlertCircle } from 'lucide-react';
import Card from './Card';
import Modal from './Modal';
import { useToast } from './ToastProvider';

interface DailyUpload {
    id: string;
    date: string;
    course: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    uploadedAt: string;
    status: 'pending' | 'uploaded' | 'processing' | 'ready';
}

const DailyUploadManager: React.FC = () => {
    const { showToast } = useToast();
    const [uploads, setUploads] = useState<DailyUpload[]>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadData, setUploadData] = useState({
        course: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [isUploading, setIsUploading] = useState(false);

    // Generate today's upload schedule
    useEffect(() => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const todayUpload: DailyUpload = {
            id: 'today',
            date: todayStr,
            course: 'React Development Fundamentals',
            title: `Daily Lecture - ${today.toLocaleDateString()}`,
            description: 'Today\'s physical class recording and key concepts',
            videoUrl: '',
            duration: 0,
            uploadedAt: '',
            status: 'pending'
        };

        setUploads([todayUpload]);
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type.startsWith('video/')) {
                setSelectedFile(file);
                showToast('success', 'Video file selected successfully');
            } else {
                showToast('error', 'Please select a video file');
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !uploadData.course || !uploadData.title) {
            showToast('error', 'Please fill in all required fields and select a video file');
            return;
        }

        setIsUploading(true);

        try {
            // Simulate upload process
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newUpload: DailyUpload = {
                id: Date.now().toString(),
                date: uploadData.date,
                course: uploadData.course,
                title: uploadData.title,
                description: uploadData.description,
                videoUrl: URL.createObjectURL(selectedFile),
                duration: Math.floor(Math.random() * 60) + 30, // Random duration between 30-90 minutes
                uploadedAt: new Date().toISOString(),
                status: 'ready'
            };

            setUploads(prev => [newUpload, ...prev]);
            showToast('success', 'Video uploaded successfully! Students can now access the lecture.');

            // Reset form
            setSelectedFile(null);
            setUploadData({
                course: '',
                title: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            setIsUploadModalOpen(false);
        } catch (error) {
            showToast('error', 'Failed to upload video. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ready':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'processing':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            case 'uploaded':
                return <Video className="h-5 w-5 text-blue-600" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'uploaded':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Daily Lecture Uploads</h2>
                    <p className="text-gray-600">Upload daily physical class recordings for students</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Upload className="h-5 w-5" />
                    <span>Upload Today's Lecture</span>
                </button>
            </div>

            {/* Uploads List */}
            <div className="space-y-4">
                {uploads.map((upload) => (
                    <Card key={upload.id} hover>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    {getStatusIcon(upload.status)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="font-semibold text-gray-900">{upload.title}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(upload.status)}`}>
                                            {upload.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{upload.course}</p>
                                    <p className="text-sm text-gray-500">{upload.description}</p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                                        <span className="flex items-center space-x-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(upload.date).toLocaleDateString()}</span>
                                        </span>
                                        {upload.duration > 0 && (
                                            <span className="flex items-center space-x-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{upload.duration} minutes</span>
                                            </span>
                                        )}
                                        {upload.uploadedAt && (
                                            <span>Uploaded: {new Date(upload.uploadedAt).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {upload.status === 'ready' && upload.videoUrl && (
                                    <button
                                        onClick={() => window.open(upload.videoUrl, '_blank')}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Watch
                                    </button>
                                )}
                                {upload.status === 'pending' && (
                                    <button
                                        onClick={() => setIsUploadModalOpen(true)}
                                        className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors"
                                    >
                                        Upload
                                    </button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Upload Modal */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Upload Daily Lecture"
                size="lg"
            >
                <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course *
                        </label>
                        <select
                            value={uploadData.course}
                            onChange={(e) => setUploadData(prev => ({ ...prev, course: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        >
                            <option value="">Select Course</option>
                            <option value="React Development Fundamentals">React Development Fundamentals</option>
                            <option value="Advanced JavaScript Concepts">Advanced JavaScript Concepts</option>
                            <option value="Node.js Backend Development">Node.js Backend Development</option>
                            <option value="Database Management">Database Management</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lecture Title *
                        </label>
                        <input
                            type="text"
                            value={uploadData.title}
                            onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="e.g., React Hooks and State Management"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={uploadData.description}
                            onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Brief description of today's lecture content..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date *
                        </label>
                        <input
                            type="date"
                            value={uploadData.date}
                            onChange={(e) => setUploadData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video File *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="video-upload"
                                required
                            />
                            <label
                                htmlFor="video-upload"
                                className="cursor-pointer flex flex-col items-center space-y-2"
                            >
                                <Video className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {selectedFile ? selectedFile.name : 'Click to select video file'}
                                </span>
                                <span className="text-xs text-gray-500">MP4, MOV, AVI files supported</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? 'Uploading...' : 'Upload Lecture'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DailyUploadManager;