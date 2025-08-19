const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../utils/emailService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../assets/admin');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG and PNG files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Admin Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const [rows] = await pool.execute(
      'SELECT id, email, password_hash FROM admin_users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const admin = rows[0];
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Forgot Password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const [rows] = await pool.execute(
      'SELECT id FROM admin_users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.execute(
      'UPDATE admin_users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, resetTokenExpiry, email]
    );

    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email'
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reset Password
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { token } = req.params;
    const { password } = req.body;

    const [rows] = await pool.execute(
      'SELECT id FROM admin_users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.execute(
      'UPDATE admin_users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, rows[0].id]
    );

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Dashboard (Protected Route)
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get total learners count
    const [learnersResult] = await pool.execute('SELECT COUNT(*) as count FROM learners');
    const totalLearners = learnersResult[0].count;

    // Get total courses count
    const [coursesResult] = await pool.execute('SELECT COUNT(*) as count FROM courses');
    const totalCourses = coursesResult[0].count;

    // Get recent learners (last 5)
    const [recentLearners] = await pool.execute(
      'SELECT id, first_name, last_name, email, department, created_at FROM learners ORDER BY created_at DESC LIMIT 5'
    );

    // Get recent courses (last 5)
    const [recentCourses] = await pool.execute(
      'SELECT id, title, overview, estimated_duration, level, created_at FROM courses ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      success: true,
      message: 'Dashboard accessed successfully',
      stats: {
        totalLearners,
        totalCourses
      },
      recentLearners,
      recentCourses
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get dashboard statistics
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    // Get total active learners
    const [learnerRows] = await pool.execute(
      'SELECT COUNT(*) as count FROM learners WHERE status = "active"'
    );
    const activeLearners = learnerRows[0].count;

    // Get total courses
    const [courseRows] = await pool.execute(
      'SELECT COUNT(*) as count FROM courses'
    );
    const totalCourses = courseRows[0].count;

    // Get learner growth (new learners in last 30 days)
    const [learnerGrowthRows] = await pool.execute(
      'SELECT COUNT(*) as count FROM learners WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    const newLearners = learnerGrowthRows[0].count;
    const learnerGrowth = newLearners > 0 ? `+${newLearners}` : '+0';

    // Get course growth (new courses in last 30 days)
    const [courseGrowthRows] = await pool.execute(
      'SELECT COUNT(*) as count FROM courses WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    const newCourses = courseGrowthRows[0].count;
    const courseGrowth = newCourses > 0 ? `+${newCourses}` : '+0';

    // For now, set placeholder values for assessments and reports
    // These would be calculated from actual assessment data when available
    const completedAssessments = 0;
    const assessmentRate = '0%';
    const avgScore = '0%';
    const scoreGrowth = '+0%';
    const reportsExported = 0;
    const reportGrowth = '+0';

    res.json({
      success: true,
      stats: {
        activeLearners,
        totalCourses,
        learnerGrowth,
        courseGrowth,
        completedAssessments,
        assessmentRate,
        avgScore,
        scoreGrowth,
        reportsExported,
        reportGrowth
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get Profile (Protected Route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, first_name, last_name, phone_number, profile_image FROM admin_users WHERE id = ?',
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      profile: rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update Profile (Protected Route)
router.put('/profile', authenticateToken, [
  body('first_name').optional().isLength({ min: 1, max: 100 }).trim(),
  body('last_name').optional().isLength({ min: 1, max: 100 }).trim(),
  body('phone_number').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { first_name, last_name, phone_number } = req.body;

    await pool.execute(
      'UPDATE admin_users SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?',
      [first_name, last_name, phone_number, req.admin.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload Profile Image (Protected Route)
router.post('/profile/upload-image', authenticateToken, upload.single('profile_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imagePath = `/assets/admin/${req.file.filename}`;

    await pool.execute(
      'UPDATE admin_users SET profile_image = ? WHERE id = ?',
      [imagePath, req.admin.id]
    );

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imagePath: imagePath
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
