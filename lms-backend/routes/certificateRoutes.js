const express = require('express');
const { generateCertificate } = require('../controllers/certificateController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/enrollments/:enrollmentId/certificate', protect, generateCertificate);

module.exports = router; 