// lms-backend/controllers/courseController.js
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Course, Lesson, User } = require('../models');
const path = require('path');
const fs = require('fs');

// @desc    Create a new course (instructor only)
// @route   POST /api/courses
// @access  Private/Instructors
exports.createCourse = asyncHandler(async (req, res, next) => {
  const { title, description, category, level, price, thumbnail, videoUrl, tags, requirements, outcomes, materials } = req.body;
  const instructorId = req.user.id;
  const course = await Course.create({
    title,
    description,
    category,
    level,
    price,
    thumbnail,
    videoUrl,
    tags,
    requirements,
    outcomes,
    materials,
    instructorId,
    status: 'pending', // Default to pending
    isApproved: false,
  });
  res.status(201).json({ success: true, course });
});

// @desc    Get all approved courses (public)
// @route   GET /api/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.findAll({
    where: { status: 'approved' },
    include: [
      { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json({ success: true, count: courses.length, courses });
});

// @desc    Get instructor's courses (instructor only)
// @route   GET /api/courses/my-courses
// @access  Private/Instructors
exports.getMyCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.findAll({
    where: { instructorId: req.user.id },
    include: [
      { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc    Get all pending courses (admin only)
// @route   GET /api/courses/admin/pending
// @access  Private/Admin
exports.getPendingCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.findAll({
    where: { status: 'pending' },
    include: [
      { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json({ success: true, count: courses.length, courses });
});

// @desc    Approve a course (admin only)
// @route   PUT /api/courses/:id/approve
// @access  Private/Admin
exports.approveCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return next(new ErrorResponse('Course not found', 404));
  }
  course.status = 'approved';
  course.isApproved = true;
  await course.save();
  res.status(200).json({ success: true, course });
});

// @desc    Get a single course by ID (public, with lessons and instructor)
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      { model: Lesson, as: 'courseLessons' },
      { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
    ],
  });
  if (!course) {
    return next(new ErrorResponse('Course not found', 404));
  }
  res.status(200).json({ success: true, course });
});

// @desc    Update a course (instructor only, must be owner)
// @route   PUT /api/courses/:id
// @access  Private/Instructors
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return next(new ErrorResponse('Course not found', 404));
  }
  // Only the course owner (instructor) or admin can update
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this course', 403));
  }
  const updatableFields = [
    'title', 'description', 'category', 'level', 'price', 'thumbnail', 'videoUrl', 'tags', 'requirements', 'outcomes', 'materials', 'status'
  ];
  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      course[field] = req.body[field];
    }
  });
  await course.save();
  res.status(200).json({ success: true, course });
});

// @desc    Delete a course (admin or instructor/owner)
// @route   DELETE /api/courses/:id
// @access  Private/Admin or Instructor
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return next(new ErrorResponse('Course not found', 404));
  }
  // Only the course owner (instructor) or admin can delete
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this course', 403));
  }
  await course.destroy();
  res.status(200).json({ success: true, message: 'Course deleted' });
});

// @desc      Upload course thumbnail
// @route     POST /api/courses/:id/thumbnail
// @access    Private/Instructor, Admin
exports.uploadCourseThumbnail = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is course owner or admin
  if (
    course.instructorId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to upload thumbnail for this course`,
        401
      )
    );
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.file;

  // Check file type
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  const fileName = `photo_${course._id}${path.parse(file.originalname).ext}`;
  const filePath = `${process.cwd()}/uploads/thumbnails/${fileName}`;

  // Move file to public uploads folder
  file.mv(filePath, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Course.findByIdAndUpdate(req.params.id, { thumbnail: `/uploads/thumbnails/${fileName}` });

    res.status(200).json({
      success: true,
      data: `/uploads/thumbnails/${fileName}`,
    });
  });
});

// @desc      Add a lesson to a course
// @route     POST /api/courses/:id/lessons
// @access    Private/Instructor, Admin
exports.addLesson = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is course owner or admin
  if (
    course.instructorId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add lessons to this course`,
        401
      )
    );
  }

  // For videoUrl and resources, frontend might send temporary URLs or base64
  // In a real scenario, video and resource uploads would be separate steps with their own dedicated endpoints.
  // For this project, we assume the frontend might send path or a placeholder, and actual file moves are in updateLesson/addResourceToLesson
  const lesson = await Lesson.create({
    course: req.params.id,
    title: req.body.title,
    description: req.body.description,
    videoUrl: req.body.videoUrl || 'no-video.mp4', // Placeholder if not uploaded yet
    duration: req.body.duration,
    resources: req.body.resources || [],
    quiz: req.body.quiz,
  });

  course.lessons.push(lesson._id);
  await course.save(); // This will trigger recalculation of course duration

  res.status(201).json({
    success: true,
    data: lesson,
  });
});

// @desc      Update a lesson in a course (can handle video file upload)
// @route     PUT /api/courses/:id/lessons/:lessonId
// @access    Private/Instructor, Admin
exports.updateLesson = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  let lesson = await Lesson.findByPk(req.params.lessonId);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  if (!lesson) {
    return next(
      new ErrorResponse(`Lesson not found with id of ${req.params.lessonId}`, 404)
    );
  }

  // Make sure user is course owner or admin
  if (
    course.instructorId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this lesson`,
        401
      )
    );
  }

  // Handle video file upload if provided via `req.file`
  if (req.file && req.file.mimetype.startsWith('video')) {
    const file = req.file;

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload a video less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
          400
        )
      );
    }

    // Delete old video if exists
    if (lesson.videoUrl && lesson.videoUrl !== 'no-video.mp4') {
      const oldFilePath = `${process.cwd()}${lesson.videoUrl}`;
      if (fs.existsSync(oldFilePath)) {
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error(`Error deleting old video: ${err}`);
        });
      }
    }

    // Create custom filename and move file
    const videoFileName = `video_${lesson._id}${path.parse(file.originalname).ext}`;
    const uploadPath = `${process.cwd()}/uploads/videos/${videoFileName}`; // Ensure this directory exists
    file.mv(uploadPath, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with video file upload`, 500));
      }
      // Update videoUrl and duration in lesson
      lesson.videoUrl = `/uploads/videos/${videoFileName}`;
      lesson.duration = req.body.duration || lesson.duration; // Update duration if provided
      await lesson.save();
      await course.save(); // Re-save course to trigger duration recalculation
      res.status(200).json({ success: true, data: lesson });
    });
  } else {
    // If no video file is uploaded, update other lesson fields
    Object.assign(lesson, req.body); // Update all fields sent in req.body
    await lesson.save();
    await course.save(); // Re-save course to trigger duration recalculation
    res.status(200).json({ success: true, data: lesson });
  }
});

// @desc      Delete a lesson from a course
// @route     DELETE /api/courses/:id/lessons/:lessonId
// @access    Private/Instructor, Admin
exports.deleteLesson = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  const lesson = await Lesson.findByPk(req.params.lessonId);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  if (!lesson) {
    return next(
      new ErrorResponse(`Lesson not found with id of ${req.params.lessonId}`, 404)
    );
  }

  // Make sure user is course owner or admin
  if (
    course.instructorId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this lesson`,
        401
      )
    );
  }

  // Remove lesson from course's lessons array
  course.lessons = course.lessons.filter(
    (l) => l.toString() !== req.params.lessonId
  );
  await course.save(); // This will trigger recalculation of course duration

  // Delete the lesson document and associated files
  if (lesson.videoUrl && lesson.videoUrl !== 'no-video.mp4') {
    const videoFilePath = `${process.cwd()}${lesson.videoUrl}`;
    if (fs.existsSync(videoFilePath)) {
      fs.unlink(videoFilePath, (err) => {
        if (err) console.error(`Error deleting video file: ${err}`);
      });
    }
  }
  lesson.resources.forEach(resource => {
    const resourceFilePath = `${process.cwd()}${resource.url}`;
    if (fs.existsSync(resourceFilePath)) {
      fs.unlink(resourceFilePath, (err) => {
        if (err) console.error(`Error deleting resource file: ${err}`);
      });
    }
  });

  await lesson.deleteOne(); // Use deleteOne() to trigger pre/post hooks if configured

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Add resources to a lesson
// @route     POST /api/courses/:id/lessons/:lessonId/resources
// @access    Private/Instructor, Admin
exports.addResourceToLesson = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  const lesson = await Lesson.findByPk(req.params.lessonId);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id ${req.params.id}`, 404));
  }
  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found with id ${req.params.lessonId}`, 404));
  }
  if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to add resources to this lesson`, 401));
  }

  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse(`Please upload at least one file`, 400));
  }

  const uploadedResources = [];
  const uploadPromises = req.files.map(file => {
    return new Promise((resolve, reject) => {
      // Check file size
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        return reject(
          new ErrorResponse(
            `File ${file.originalname} is too large. Max size is ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
            400
          )
        );
      }
      const fileName = `resource_${lesson._id}_${Date.now()}${path.parse(file.originalname).ext}`;
      const uploadPath = `${process.cwd()}/uploads/resources/${fileName}`; // Ensure this directory exists
      file.mv(uploadPath, (err) => {
        if (err) {
          console.error(`Error uploading resource ${file.originalname}: ${err}`);
          return reject(new ErrorResponse(`Problem with file upload for ${file.originalname}`, 500));
        }
        uploadedResources.push({
          name: file.originalname,
          url: `/uploads/resources/${fileName}`,
          fileType: file.mimetype.split('/')[1] || path.parse(file.originalname).ext.substring(1), // e.g., 'pdf', 'zip'
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        });
        resolve();
      });
    });
  });

  await Promise.all(uploadPromises); // Wait for all files to be moved

  lesson.resources.push(...uploadedResources);
  await lesson.save();

  res.status(200).json({
    success: true,
    data: lesson.resources,
  });
});


// @desc      Delete a resource from a lesson
// @route     DELETE /api/courses/:id/lessons/:lessonId/resources/:resourceId
// @access    Private/Instructor, Admin
exports.deleteResourceFromLesson = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  const lesson = await Lesson.findByPk(req.params.lessonId);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id ${req.params.id}`, 404));
  }
  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found with id ${req.params.lessonId}`, 404));
  }
  if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete resources from this lesson`, 401));
  }

  const resourceIndex = lesson.resources.findIndex(res => res._id.toString() === req.params.resourceId);

  if (resourceIndex === -1) {
    return next(new ErrorResponse(`Resource not found with id ${req.params.resourceId}`, 404));
  }

  const [removedResource] = lesson.resources.splice(resourceIndex, 1);
  await lesson.save();

  // Optional: Delete the actual file from the file system
  if (removedResource.url) {
    const filePath = `${process.cwd()}${removedResource.url}`;
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Error deleting resource file: ${err}`);
      });
    }
  }

  res.status(200).json({ success: true, data: {} });
});

// @desc      Add/Update quiz for a lesson
// @route     PUT /api/courses/:id/lessons/:lessonId/quiz
// @access    Private/Instructor, Admin
exports.addQuizToLesson = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  const lesson = await Lesson.findByPk(req.params.lessonId);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  if (!lesson) {
    return next(
      new ErrorResponse(`Lesson not found with id of ${req.params.lessonId}`, 404)
    );
  }

  // Make sure user is course owner or admin
  if (
    course.instructorId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to modify this lesson's quiz`,
        401
      )
    );
  }

  // Frontend sends the entire quiz object for the lesson,
  // ensure it matches the Lesson.quiz schema structure
  lesson.quiz = {
    title: req.body.title,
    questions: req.body.questions,
  };

  await lesson.save();

  res.status(200).json({
    success: true,
    data: lesson.quiz,
  });
});