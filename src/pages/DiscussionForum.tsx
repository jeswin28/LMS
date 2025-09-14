import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  ThumbsUp,
  Reply,
  Send,
  User,
  Clock,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';
import apiService from '../services/api';
import { useToast } from '../components/ToastProvider';

const DiscussionForum: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { showToast } = useToast();

  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        const response = await apiService.getDiscussionPosts(courseId);
        if (response.success && response.data) {
          setForumPosts(response.data);
        }
      } catch (error) {
        console.error('Failed to load forum posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForumPosts();
  }, [courseId]);

  const handleNewPost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      showToast('success', 'New post created successfully!');
      setIsNewPostModalOpen(false);
      setNewPostTitle('');
      setNewPostContent('');
    }
  };

  const handleReply = (postId: number) => {
    if (replyContent.trim()) {
      showToast('success', 'Reply posted successfully!');
      setReplyingTo(null);
      setReplyContent('');
    }
  };

  const handleLike = (postId: number, type: 'post' | 'reply', replyId?: number) => {
    showToast('success', 'Liked!');
  };

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'unanswered') return matchesSearch && post.replies === 0;
    if (selectedFilter === 'my-posts') return matchesSearch && post.author === user?.name;

    return matchesSearch;
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user.role} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Discussion Forum
              </h1>
              <p className="text-gray-600">
                Ask questions, share knowledge, and connect with your classmates
              </p>
            </div>
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors mt-4 sm:mt-0"
            >
              <Plus className="h-5 w-5" />
              <span>New Post</span>
            </button>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6" padding="md">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Posts</option>
                  <option value="unanswered">Unanswered</option>
                  <option value="my-posts">My Posts</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} hover>
                <div className="space-y-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.author}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs ${post.authorRole === 'Instructor'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}>
                            {post.authorRole}
                          </span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-700">{post.content}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post.id, 'post')}
                      className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(post.id)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.replies} replies</span>
                    </div>
                  </div>

                  {/* Replies */}
                  {post.replies_data.length > 0 && (
                    <div className="pl-6 border-l-2 border-gray-100 space-y-4">
                      {post.replies_data.map((reply) => (
                        <div key={reply.id} className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">{reply.author}</span>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${reply.authorRole === 'Instructor'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                                }`}>
                                {reply.authorRole}
                              </span>
                              <span className="ml-2 text-sm text-gray-600">{reply.createdAt}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 ml-11">{reply.content}</p>
                          <div className="ml-11">
                            <button
                              onClick={() => handleLike(post.id, 'reply', reply.id)}
                              className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="text-sm">{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === post.id && (
                    <div className="pl-6 border-l-2 border-emerald-200">
                      <div className="flex space-x-3">
                        <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => setReplyingTo(null)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReply(post.id)}
                              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded transition-colors"
                            >
                              <Send className="h-4 w-4" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {filteredPosts.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
                  </p>
                  <button
                    onClick={() => setIsNewPostModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Create New Post
                  </button>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* New Post Modal */}
      <Modal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        title="Create New Post"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleNewPost(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter post title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Write your question or discussion topic..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsNewPostModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Create Post
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DiscussionForum;