const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Enrollment, Course, User } = require('../models');
const PDFDocument = require('pdfkit');

// Generate course completion certificate (student only)
exports.generateCertificate = asyncHandler(async (req, res, next) => {
    const enrollment = await Enrollment.findByPk(req.params.enrollmentId, {
        include: [
            { model: Course, as: 'course', include: [{ model: User, as: 'instructor' }] },
            { model: User, as: 'user' }
        ]
    });
    if (!enrollment) return next(new ErrorResponse('Enrollment not found', 404));
    if (enrollment.userId !== req.user.id) return next(new ErrorResponse('Not authorized', 403));
    if (enrollment.progress < 100) return next(new ErrorResponse('Course not completed', 400));

    const course = enrollment.course;
    const student = enrollment.user;
    const instructor = course.instructor;

    // Generate PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${course.title}.pdf"`);

    doc.fontSize(28).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`This certifies that`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(22).text(`${student.name}`, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(18).text(`has successfully completed the course`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(22).text(`${course.title}`, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(16).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Instructor: ${instructor.name}`, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text('Congratulations on your achievement!', { align: 'center' });
    doc.end();
    doc.pipe(res);
}); 