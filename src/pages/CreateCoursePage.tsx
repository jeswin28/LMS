import React, { useState } from 'react';
import { Upload, Plus, X, Video, FileText, Save, Eye } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';

const CreateCoursePage: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: '',
    thumbnail: null as File | null,
    tags: [] as string[],
    learningObjectives: [''],
    prerequisites: ['']
  });

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: '',
      description: '',
      videoFile: null as File | null,
      resources: [] as File[],
      quiz: {
        questions: [
          {
            question: '',
            options: ['', '', '', ''],
            correct: 0
          }
        ]
      }
    }
  ]);

  const [newTag, setNewTag] = useState('');

  const categories = [
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Design',
    'Business',
    'Marketing',
    'Photography'
  ];

  const handleCourseDataChange = (field: string, value: any) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addLearningObjective = () => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const updateLearningObjective = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => 
        i === index ? value : obj
      )
    }));
  };

  const removeLearningObjective = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const addPrerequisite = () => {
    setCourseData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, '']
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((prereq, i) => 
        i === index ? value : prereq
      )
    }));
  };

  const removePrerequisite = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const addLesson = () => {
    setLessons(prev => [...prev, {
      id: prev.length + 1,
      title: '',
      description: '',
      videoFile: null,
      resources: [],
      quiz: {
        questions: [
          {
            question: '',
            options: ['', '', '', ''],
            correct: 0
          }
        ]
      }
    }]);
  };

  const updateLesson = (lessonId: number, field: string, value: any) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
    ));
  };

  const removeLesson = (lessonId: number) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
  };

  const handleSaveDraft = () => {
    showToast('success', 'Course saved as draft!');
  };

  const handlePublish = () => {
    showToast('success', 'Course published successfully!');
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Course Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleCourseDataChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={courseData.category}
                  onChange={(e) => handleCourseDataChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  value={courseData.level}
                  onChange={(e) => handleCourseDataChange('level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) => handleCourseDataChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={courseData.description}
                onChange={(e) => handleCourseDataChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe what students will learn in this course"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {courseData.thumbnail ? (
                  <div>
                    <img
                      src={URL.createObjectURL(courseData.thumbnail)}
                      alt="Thumbnail preview"
                      className="w-32 h-20 object-cover mx-auto rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-600">{courseData.thumbnail.name}</p>
                    <button
                      onClick={() => handleCourseDataChange('thumbnail', null)}
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
                        Upload thumbnail image
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleCourseDataChange('thumbnail', e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {courseData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-emerald-600 hover:text-emerald-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Add a tag"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Learning Objectives & Prerequisites</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives
              </label>
              <p className="text-sm text-gray-600 mb-4">
                What will students learn from this course?
              </p>
              <div className="space-y-3">
                {courseData.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateLearningObjective(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter learning objective"
                    />
                    {courseData.learningObjectives.length > 1 && (
                      <button
                        onClick={() => removeLearningObjective(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addLearningObjective}
                  className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Learning Objective</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <p className="text-sm text-gray-600 mb-4">
                What should students know before taking this course?
              </p>
              <div className="space-y-3">
                {courseData.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={prerequisite}
                      onChange={(e) => updatePrerequisite(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter prerequisite"
                    />
                    {courseData.prerequisites.length > 1 && (
                      <button
                        onClick={() => removePrerequisite(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addPrerequisite}
                  className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Prerequisite</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
              <button
                onClick={addLesson}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Lesson</span>
              </button>
            </div>

            <div className="space-y-6">
              {lessons.map((lesson, index) => (
                <Card key={lesson.id}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Lesson {index + 1}
                    </h3>
                    {lessons.length > 1 && (
                      <button
                        onClick={() => removeLesson(lesson.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Title
                      </label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter lesson title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Description
                      </label>
                      <textarea
                        value={lesson.description}
                        onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Describe what this lesson covers"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Content
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {lesson.videoFile ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Video className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">{lesson.videoFile.name}</span>
                            <button
                              onClick={() => updateLesson(lesson.id, 'videoFile', null)}
                              className="text-red-600 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-sm">
                              <label className="text-emerald-600 cursor-pointer hover:text-emerald-700">
                                Upload recorded video lesson
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="video/*"
                                  onChange={(e) => updateLesson(lesson.id, 'videoFile', e.target.files?.[0] || null)}
                                />
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                Supported formats: MP4, WebM, MOV (Max 500MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {lesson.videoFile && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">Video Preview</h5>
                          <video
                            src={URL.createObjectURL(lesson.videoFile)}
                            controls
                            className="w-full max-w-md h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resources
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm">
                          <label className="text-emerald-600 cursor-pointer hover:text-emerald-700">
                            Upload resource files (PDF, PPT, etc.)
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept=".pdf,.ppt,.pptx,.doc,.docx"
                              onChange={(e) => updateLesson(lesson.id, 'resources', Array.from(e.target.files || []))}
                            />
                          </label>
                        </div>
                        {lesson.resources.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {lesson.resources.map((file, fileIndex) => (
                              <div key={fileIndex} className="text-sm text-gray-600">
                                {file.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'instructor'} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
                <p className="text-gray-600">Build an engaging learning experience for your students</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Draft</span>
                </button>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    <div className="ml-2">
                      <p className={`text-sm font-medium ${
                        step <= currentStep ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        {step === 1 && 'Course Info'}
                        {step === 2 && 'Objectives'}
                        {step === 3 && 'Content'}
                      </p>
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-4 ${
                        step < currentStep ? 'bg-emerald-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <Card className="mb-8">
              {renderStepContent()}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex space-x-3">
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handlePublish}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Publish Course
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Course Preview"
        size="xl"
      >
        <div className="space-y-6">
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            {courseData.thumbnail ? (
              <img
                src={URL.createObjectURL(courseData.thumbnail)}
                alt="Course thumbnail"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-500">Course Thumbnail</div>
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {courseData.title || 'Course Title'}
            </h3>
            <p className="text-gray-600 mb-4">
              {courseData.description || 'Course description will appear here...'}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {courseData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Category:</span> {courseData.category || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Level:</span> {courseData.level}
              </div>
              <div>
                <span className="font-medium">Price:</span> ${courseData.price || '0.00'}
              </div>
              <div>
                <span className="font-medium">Lessons:</span> {lessons.length}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateCoursePage;