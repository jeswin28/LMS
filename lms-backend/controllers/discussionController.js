// lms-backend/controllers/discussionController.js
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { DiscussionPost, Comment, Course, Enrollment } = require('../models');
const { createNotification } = require('./notificationController'); // Import notification helper
const User = require('../models/User'); // To notify post author

// @desc      Get all discussion posts (optionally by course)
// @route     GET /api/forum
// @access    Private
exports.getPosts = asyncHandler(async (req, res, next) => {
  let query;

  if (req.query.courseId) {
    query = DiscussionPost.find({ course: req.query.courseId });
  } else {
    query = DiscussionPost.find(); // All public or general forum posts
  }

  // Add search and filter logic based on frontend
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    query = query.or([
      { title: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } },
    ]);
  }
  // Add filters for 'unanswered', 'my-posts' etc.
  if (req.query.filter === 'unanswered') {
    query = query.where('replies').equals(0);
  }
  if (req.query.filter === 'my-posts') {
    query = query.where('author').equals(req.user.id);
  }

  const posts = await query.populate({
    path: 'author',
    select: 'name role', // Get author's name and role
  }).sort('-createdAt'); // Sort by newest first

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// @desc      Get single discussion post and its comments
// @route     GET /api/forum/:id
// @access    Private
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await DiscussionPost.findById(req.params.id).populate({
    path: 'author',
    select: 'name role',
  });

  if (!post) {
    return next(new ErrorResponse(`Post not found with id ${req.params.id}`, 404));
  }

  // Get comments for the post
  const comments = await Comment.find({ post: req.params.id })
    .populate({
      path: 'author',
      select: 'name role',
    })
    .sort('createdAt');

  res.status(200).json({
    success: true,
    data: { post, comments },
  });
});

// @desc      Create new discussion post
// @route     POST /api/forum
// @access    Private
exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id; // Set author to logged in user

  const post = await DiscussionPost.create(req.body);

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc      Update discussion post
// @route     PUT /api/forum/:id
// @access    Private (Owner or Admin)
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await DiscussionPost.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id ${req.params.id}`, 404));
  }

  // Make sure user is post owner or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this post`, 403));
  }

  post = await DiscussionPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc      Delete discussion post
// @route     DELETE /api/forum/:id
// @access    Private (Owner or Admin)
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await DiscussionPost.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id ${req.params.id}`, 404));
  }

  // Make sure user is post owner or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this post`, 403));
  }

  await post.deleteOne(); // This should also delete associated comments if cascade is setup (not by default in Mongoose)
  await Comment.deleteMany({ post: req.params.id }); // Manually delete associated comments

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Like/unlike a discussion post
// @route     PUT /api/forum/:id/like
// @access    Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await DiscussionPost.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id ${req.params.id}`, 404));
  }

  if (post.likes.includes(req.user.id)) {
    // Unlike
    post.likes = post.likes.filter((userId) => userId.toString() !== req.user.id);
  } else {
    // Like
    post.likes.push(req.user.id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    data: post.likes.length, // Return updated like count
  });
});

// @desc      Get comments for a discussion post
// @route     GET /api/forum/:postId/comments
// @access    Private
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate({
      path: 'author',
      select: 'name role',
    })
    .sort('createdAt');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

// @desc      Add a comment to a discussion post
// @route     POST /api/forum/:postId/comments
// @access    Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const post = await DiscussionPost.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id ${req.params.postId}`, 404));
  }

  req.body.post = req.params.postId;
  req.body.author = req.user.id;

  const comment = await Comment.create(req.body);

  // Notify the post author about the new comment (if not self-comment)
  if (post.author.toString() !== req.user.id.toString()) {
    const postAuthor = await User.findById(post.author);
    if (postAuthor && postAuthor.allowMessages) { // Check user settings for messages
      await createNotification({
        user: post.author,
        type: 'message',
        title: `New Reply to your post: ${post.title}`,
        message: `${req.user.name} replied to your post "${post.title}".`,
        relatedEntity: { id: post._id, type: 'DiscussionPost' }
      });
    }
  }


  res.status(201).json({
    success: true,
    data: comment,
  });
});

// @desc      Update a comment
// @route     PUT /api/forum/:postId/comments/:commentId
// @access    Private (Owner or Admin)
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id ${req.params.commentId}`, 404));
  }

  // Make sure user is comment owner or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this comment`, 403));
  }

  comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc      Delete a comment
// @route     DELETE /api/forum/:postId/comments/:commentId
// @access    Private (Owner or Admin)
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id ${req.params.commentId}`, 404));
  }

  // Make sure user is comment owner or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this comment`, 403));
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Like/unlike a comment
// @route     PUT /api/forum/:postId/comments/:commentId/like
// @access    Private
exports.likeComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id ${req.params.commentId}`, 404));
  }

  if (comment.likes.includes(req.user.id)) {
    // Unlike
    comment.likes = comment.likes.filter((userId) => userId.toString() !== req.user.id);
  } else {
    // Like
    comment.likes.push(req.user.id);
  }

  await comment.save();

  res.status(200).json({
    success: true,
    data: comment.likes.length, // Return updated like count
  });
});

// Create a discussion post (enrolled users)
exports.createDiscussionPost = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.courseId);
  if (!course) return next(new ErrorResponse('Course not found', 404));
  // Check enrollment or instructor
  const isEnrolled = req.user.role === 'admin' || course.instructorId === req.user.id ||
    await Enrollment.findOne({ where: { userId: req.user.id, courseId: course.id } });
  if (!isEnrolled) return next(new ErrorResponse('Not authorized', 403));
  const { title, content } = req.body;
  const post = await DiscussionPost.create({
    courseId: course.id, authorId: req.user.id, title, content, createdAt: new Date()
  });
  res.status(201).json({ success: true, post });
});

// Get all discussion posts for a course (enrolled users)
exports.getCourseDiscussions = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.courseId);
  if (!course) return next(new ErrorResponse('Course not found', 404));
  const isEnrolled = req.user.role === 'admin' || course.instructorId === req.user.id ||
    await Enrollment.findOne({ where: { userId: req.user.id, courseId: course.id } });
  if (!isEnrolled) return next(new ErrorResponse('Not authorized', 403));
  const posts = await DiscussionPost.findAll({ where: { courseId: course.id } });
  res.status(200).json({ success: true, count: posts.length, posts });
});

// Add a comment to a post (enrolled users)
exports.addComment = asyncHandler(async (req, res, next) => {
  const post = await DiscussionPost.findByPk(req.params.postId);
  if (!post) return next(new ErrorResponse('Post not found', 404));
  const course = await Course.findByPk(post.courseId);
  const isEnrolled = req.user.role === 'admin' || course.instructorId === req.user.id ||
    await Enrollment.findOne({ where: { userId: req.user.id, courseId: course.id } });
  if (!isEnrolled) return next(new ErrorResponse('Not authorized', 403));
  const { content } = req.body;
  const comment = await Comment.create({
    post: post.id, author: req.user.id, content, createdAt: new Date()
  });
  res.status(201).json({ success: true, comment });
});