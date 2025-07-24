import React, { useState } from 'react';
import { Search, HelpCircle, Book, MessageCircle, Mail, Phone, ChevronDown, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useUser } from '../context/UserContext';
import { useToast } from '../components/ToastProvider';

const HelpPage: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const faqCategories = [
    { id: 'all', name: 'All Topics' },
    { id: 'account', name: 'Account & Profile' },
    { id: 'courses', name: 'Courses & Learning' },
    { id: 'technical', name: 'Technical Issues' },
    { id: 'billing', name: 'Billing & Payments' },
    { id: 'certificates', name: 'Certificates' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and follow the instructions sent to your email.'
    },
    {
      id: 2,
      category: 'account',
      question: 'How can I update my profile information?',
      answer: 'Navigate to your Profile page from the sidebar menu. Click the "Edit Profile" button to update your personal information, bio, and social links.'
    },
    {
      id: 3,
      category: 'courses',
      question: 'How do I enroll in a course?',
      answer: 'Browse courses from the Courses page, click on a course you\'re interested in, and click the "Enroll Now" button. You\'ll be taken through the enrollment process.'
    },
    {
      id: 4,
      category: 'courses',
      question: 'Can I download course videos for offline viewing?',
      answer: 'Currently, course videos are only available for streaming online. However, you can download course resources like PDFs and slides from the course materials section.'
    },
    {
      id: 5,
      category: 'courses',
      question: 'How do I submit assignments?',
      answer: 'Go to the Assignments page, select the assignment you want to submit, and click "Submit". You can upload files or enter text responses as required.'
    },
    {
      id: 6,
      category: 'technical',
      question: 'The video player is not working. What should I do?',
      answer: 'Try refreshing the page first. If the issue persists, check your internet connection and try using a different browser. Contact support if the problem continues.'
    },
    {
      id: 7,
      category: 'technical',
      question: 'I\'m having trouble accessing my courses.',
      answer: 'Make sure you\'re logged in with the correct account. Clear your browser cache and cookies, then try again. If you still can\'t access your courses, contact support.'
    },
    {
      id: 8,
      category: 'billing',
      question: 'How do I get a refund?',
      answer: 'Refunds are available within 30 days of purchase if you haven\'t completed more than 30% of the course. Contact support with your order details to request a refund.'
    },
    {
      id: 9,
      category: 'billing',
      question: 'Can I change my payment method?',
      answer: 'Yes, you can update your payment method in the Billing section of your account settings. Your new payment method will be used for future purchases.'
    },
    {
      id: 10,
      category: 'certificates',
      question: 'How do I download my certificate?',
      answer: 'Once you complete a course, go to the course page and click "View Certificate". From there, you can download your certificate as a PDF.'
    },
    {
      id: 11,
      category: 'certificates',
      question: 'Are the certificates accredited?',
      answer: 'Our certificates are issued by Nexfern Academy and recognized by many employers. While not formally accredited, they demonstrate your completion of our comprehensive courses.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.subject && contactForm.message) {
      showToast('success', 'Your message has been sent! We\'ll get back to you within 24 hours.');
      setContactForm({ subject: '', message: '', priority: 'medium' });
    } else {
      showToast('error', 'Please fill in all required fields.');
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role || 'student'} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
            <p className="text-gray-600">Find answers to common questions or get in touch with our support team</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card 
              hover 
              className="text-center cursor-pointer"
              onClick={() => {
                document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Knowledge Base</h3>
                <p className="text-gray-600 text-sm">Browse our comprehensive FAQ section</p>
              </div>
            </Card>
            
            <Card 
              hover 
              className="text-center cursor-pointer"
              onClick={() => {
                // Open live chat
                alert('Live chat feature would open here');
              }}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm">Chat with our support team in real-time</p>
              </div>
            </Card>
            
            <Card 
              hover 
              className="text-center cursor-pointer"
              onClick={() => {
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm">Send us a detailed message</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <div id="faq-section" className="lg:col-span-2">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {faqCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FAQ List */}
                  <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {expandedFaq === faq.id ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {expandedFaq === faq.id && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                      <p className="text-gray-600">Try adjusting your search or browse all topics</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div id="contact-form">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Please provide as much detail as possible about your issue..."
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </Card>

              {/* Contact Info */}
              <Card className="mt-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">support@nexfern.academy</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Live Chat</p>
                        <p className="text-sm text-gray-600">Available 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Response Times */}
              <Card className="mt-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Live Chat</span>
                      <span className="font-medium text-gray-900">Immediate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email (Urgent)</span>
                      <span className="font-medium text-gray-900">2-4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email (Standard)</span>
                      <span className="font-medium text-gray-900">24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-medium text-gray-900">Business hours</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpPage;