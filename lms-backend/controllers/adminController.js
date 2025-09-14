// lms-backend/controllers/adminController.js
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Course, User, Assignment, Enrollment, Quiz } = require('../models');
const { createNotification } = require('./notificationController'); // Import helper

// @desc      Get all pending approvals (courses, instructors, content updates)
// @route     GET /api/admin/approvals
// @access    Private/Admin
exports.getPendingApprovals = asyncHandler(async (req, res, next) => {
  const { type } = req.query; // Filter by type: 'course', 'instructor', 'content'

  let pendingItems = [];

  // Fetch pending courses
  if (!type || type === 'course') {
    const pendingCourses = await Course.findAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] }
      ]
    });
    pendingItems = pendingItems.concat(pendingCourses.map(item => ({
      id: item.id,
      type: 'course',
      title: item.title,
      submitter: item.instructor ? item.instructor.name : 'N/A',
      submitterEmail: item.instructor ? item.instructor.email : 'N/A',
      submittedAt: item.createdAt,
      description: item.description,
      category: item.category,
      price: item.price,
      lessons: 0, // Will be calculated when we have lessons
      duration: item.duration,
      thumbnail: item.thumbnail,
      status: 'pending', // Always 'pending' for this view
      priority: 'medium', // Default priority for courses, can be dynamic
      rawItem: item // Include full item for detail view
    })));
  }

  // Fetch pending instructor applications (assuming status field in User for application state)
  // For simplicity, let's assume 'pending_approval' is a status in User model for instructors
  if (!type || type === 'instructor') {
    const pendingInstructors = await User.findAll({
      where: { role: 'instructor', status: 'pending_approval' },
      attributes: ['id', 'name', 'email', 'bio', 'createdAt', 'linkedIn', 'github', 'website']
    });
    pendingItems = pendingItems.concat(pendingInstructors.map(item => ({
      id: item.id,
      type: 'instructor',
      title: `Instructor Application - ${item.name}`,
      submitter: item.name,
      submitterEmail: item.email,
      submittedAt: item.createdAt,
      description: item.bio, // Using bio as description for application
      qualifications: ['Review profile and experience'], // Placeholder, would need a dedicated field on User or separate model
      portfolio: item.website || item.linkedIn, // Use website/linkedin as portfolio link
      linkedin: item.linkedIn,
      status: 'pending',
      priority: 'high', // Instructor applications might be high priority
      rawItem: item // Include full item for detail view
    })));
  }

  // Frontend displays generic 'content' type. This would ideally be a separate model
  // or a more granular status on existing models (e.g., Lesson).
  // For now, let's represent content updates as a mock or simplified entry.
  // We'll create a hardcoded mock entry for 'content' type for demo purposes,
  // or it could be a different status on a Lesson or Course like 'content_needs_review'.
  if (!type || type === 'content') {
    // Example: A course might have a field `contentNeedsReview: boolean`
    // Or a dedicated ContentUpdate model
    const mockContentUpdates = [
      {
        id: 'mock-content-1',
        type: 'content',
        title: 'Course Content Update - React Hooks',
        submitter: 'Dr. Sarah Johnson',
        submitterEmail: 'sarah.johnson@example.com',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        description: 'Major update to React course including new lessons on React 18 features and concurrent rendering.',
        courseName: 'React Development Fundamentals',
        changes: [
          'Added 5 new lessons on React 18',
          'Updated existing content for latest best practices',
          'Added practical exercises for concurrent features'
        ],
        status: 'pending',
        priority: 'low'
      }
    ];
    pendingItems = pendingItems.concat(mockContentUpdates);
  }

  // Sort by submittedAt, newest first
  pendingItems.sort((a, b) => b.submittedAt - a.submittedAt);

  res.status(200).json({
    success: true,
    count: pendingItems.length,
    data: pendingItems,
  });
});

// @desc      Approve an item (course, instructor, content)
// @route     PUT /api/admin/approvals/:id/approve
// @access    Private/Admin
exports.approveItem = asyncHandler(async (req, res, next) => {
  const { itemType } = req.body; // Expect itemType (e.g., 'course', 'instructor') from frontend

  let item;
  let successMessage = '';
  let notificationTitle = '';
  let notificationMessage = '';
  let relatedUser = null;

  switch (itemType) {
    case 'course':
      item = await Course.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true, runValidators: true });
      if (item) {
        successMessage = `Course "${item.title}" approved and published.`;
        notificationTitle = `Course Approved: ${item.title}`;
        notificationMessage = `Your course "${item.title}" has been approved and is now live!`;
        relatedUser = item.instructor;
      }
      break;
    case 'instructor':
      // This would involve updating the user's role/status based on instructor approval
      // Set to active if they were pending approval, and ensure role is instructor
      item = await User.findByIdAndUpdate(req.params.id, { status: 'active', role: 'instructor' }, { new: true, runValidators: true });
      if (item) {
        successMessage = `Instructor application for ${item.name} approved.`;
        notificationTitle = `Instructor Status Update`;
        notificationMessage = `Congratulations ${item.name}! Your instructor application has been approved. You can now create courses.`;
        relatedUser = item._id;
      }
      break;
    case 'content':
      // Logic to approve content update (e.g., change status on a specific lesson or content version)
      // This is a placeholder for actual content approval logic
      successMessage = `Content update with ID ${req.params.id} approved. (Placeholder for specific content logic)`;
      // For demo, assume `req.params.id` is a Course ID for content update example
      item = await Course.findById(req.params.id);
      if (item) {
        notificationTitle = `Content Update Approved for ${item.title}`;
        notificationMessage = `Your recent content changes for "${item.title}" have been approved.`;
        relatedUser = item.instructor;
      }
      break;
    default:
      return next(new ErrorResponse('Invalid item type for approval', 400));
  }

  if (!item) {
    return next(new ErrorResponse(`Item not found with id ${req.params.id} or invalid type`, 404));
  }

  // Send notification to the user who submitted the item
  if (relatedUser) {
    await createNotification({
      user: relatedUser,
      type: 'approval_status',
      title: notificationTitle,
      message: notificationMessage,
      relatedEntity: { id: item._id, type: itemType }
    });
  }

  res.status(200).json({
    success: true,
    message: successMessage,
    data: item,
  });
});

// @desc      Reject an item (course, instructor, content)
// @route     PUT /api/admin/approvals/:id/reject
// @access    Private/Admin
exports.rejectItem = asyncHandler(async (req, res, next) => {
  const { itemType, reason } = req.body; // Expect itemType and reason for rejection

  let item;
  let errorMessage = '';
  let notificationTitle = '';
  let notificationMessage = '';
  let relatedUser = null;

  switch (itemType) {
    case 'course':
      item = await Course.findByIdAndUpdate(req.params.id, { status: 'draft' }, { new: true, runValidators: true }); // Revert to draft
      if (item) {
        errorMessage = `Course "${item.title}" rejected.`;
        notificationTitle = `Course Rejection: ${item.title}`;
        notificationMessage = `Your course "${item.title}" was rejected. Reason: ${reason || 'No reason provided.'}`;
        relatedUser = item.instructor;
      }
      break;
    case 'instructor':
      // This involves changing the user's status to 'rejected_application'
      item = await User.findByIdAndUpdate(req.params.id, { status: 'rejected_application' }, { new: true, runValidators: true }); // Set a specific rejected status
      if (item) {
        errorMessage = `Instructor application for ${item.name} rejected.`;
        notificationTitle = `Instructor Application Status`;
        notificationMessage = `Your instructor application was rejected. Reason: ${reason || 'No reason provided.'}`;
        relatedUser = item._id;
      }
      break;
    case 'content':
      errorMessage = `Content update with ID ${req.params.id} rejected. (Placeholder for specific content logic)`;
      // For demo, assume `req.params.id` is a Course ID for content update example
      item = await Course.findById(req.params.id);
      if (item) {
        notificationTitle = `Content Update Rejected for ${item.title}`;
        notificationMessage = `Your recent content changes for "${item.title}" were rejected. Reason: ${reason || 'No reason provided.'}`;
        relatedUser = item.instructor;
      }
      break;
    default:
      return next(new ErrorResponse('Invalid item type for rejection', 400));
  }

  if (!item) {
    return next(new ErrorResponse(`Item not found with id ${req.params.id} or invalid type`, 404));
  }

  // Send notification to the user who submitted the item
  if (relatedUser) {
    await createNotification({
      user: relatedUser,
      type: 'approval_status',
      title: notificationTitle,
      message: notificationMessage,
      relatedEntity: { id: item._id, type: itemType }
    });
  }

  res.status(200).json({
    success: true,
    message: errorMessage,
    data: item,
  });
});

// @desc      Get platform-wide analytics
// @route     GET /api/admin/analytics
// @access    Private/Admin
exports.getPlatformAnalytics = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const students = await User.countDocuments({ role: 'student' });
  const instructors = await User.countDocuments({ role: 'instructor' });
  const admins = await User.countDocuments({ role: 'admin' });
  const activeUsers = await User.countDocuments({ status: 'active' });

  const totalCourses = await Course.countDocuments();
  const publishedCourses = await Course.countDocuments({ status: 'published' });
  const draftCourses = await Course.countDocuments({ status: 'draft' });
  const underReviewCourses = await Course.countDocuments({ status: 'under_review' });

  const totalRevenueResult = await Course.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$revenue' },
      },
    },
  ]);
  const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

  const totalStudentsEnrolled = await Enrollment.countDocuments(); // Count of enrollment documents

  // Mock data for trends (in a real app, this would query historical data)
  const revenueData = [
    { month: 'Jan', revenue: 8500, users: 180 },
    { month: 'Feb', revenue: 12300, users: 220 },
    { month: 'Mar', revenue: 15600, users: 280 },
    { month: 'Apr', revenue: 18900, users: 320 },
    { month: 'May', revenue: 22100, users: 380 },
    { month: 'Jun', revenue: 25400, users: 420 },
  ];

  const userActivity = [
    { day: 'Mon', active: 1250, new: 45 },
    { day: 'Tue', active: 1380, new: 52 },
    { day: 'Wed', active: 1420, new: 38 },
    { day: 'Thu', active: 1560, new: 67 },
    { day: 'Fri', active: 1680, new: 73 },
    { day: 'Sat', active: 1200, new: 28 },
    { day: 'Sun', active: 980, new: 22 },
  ];

  const topCourses = await Course.findAll({
    where: { status: 'approved' },
    include: [
      { model: User, as: 'instructor', attributes: ['id', 'name'] }
    ],
    attributes: ['id', 'title', 'students', 'revenue', 'rating'],
    order: [['revenue', 'DESC']],
    limit: 5
  });

  // For category performance, we'll use a simpler approach since Sequelize doesn't have aggregation like MongoDB
  const allCourses = await Course.findAll({
    where: { status: 'approved' },
    attributes: ['category', 'students', 'revenue']
  });

  const categoryPerformance = allCourses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = {
        totalCourses: 0,
        totalStudents: 0,
        totalRevenue: 0
      };
    }
    acc[course.category].totalCourses += 1;
    acc[course.category].totalStudents += course.students || 0;
    acc[course.category].totalRevenue += course.revenue || 0;
    return acc;
  }, {});

  const categoryPerformanceArray = Object.entries(categoryPerformance).map(([category, data]) => ({
    _id: category,
    totalCourses: data.totalCourses,
    totalStudents: data.totalStudents,
    totalRevenue: data.totalRevenue
  })).sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Frontend expects growth percentages; these would be calculated based on previous periods
  const growthPercentages = {
    revenueGrowth: 23.5,
    userGrowth: 12.3,
    courseGrowth: 8.1,
    completionGrowth: 5.2 // This would require tracking historical completion rates
  };


  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        students,
        instructors,
        admins,
        activeUsers,
        totalCourses,
        publishedCourses,
        draftCourses,
        underReviewCourses,
        totalRevenue,
        totalStudentsEnrolled, // For 'Total Students' on Instructor Dashboard / Admin Analytics
        ...growthPercentages, // Add growth data for frontend display
      },
      revenueTrend: revenueData,
      userActivityTrend: userActivity,
      topPerformingCourses: topCourses,
      categoryPerformance: categoryPerformanceArray.map(cat => ({
        category: cat._id,
        courses: cat.totalCourses,
        students: cat.totalStudents,
        revenue: cat.totalRevenue,
      })),
    },
  });
});

// @desc      Admin contacts support (e.g., for internal issues)
// @route     POST /api/admin/support
// @access    Private/Admin
exports.contactSupport = asyncHandler(async (req, res, next) => {
  const { subject, message, priority } = req.body;

  // In a real application, this would integrate with a ticketing system or send an email to a support inbox
  console.log(`Admin Support Request from ${req.user.email}:`);
  console.log(`Subject: ${subject}`);
  console.log(`Priority: ${priority}`);
  console.log(`Message: ${message}`);

  // You might also store this as a 'SupportTicket' in your database.
  // For demo, just acknowledging receipt.
  res.status(200).json({
    success: true,
    message: 'Support request sent successfully. We will address it shortly.',
  });
});