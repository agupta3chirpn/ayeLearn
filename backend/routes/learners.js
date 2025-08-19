const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for learner avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../assets/learners');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'learner-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all learners
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit, sort = 'created_at', order = 'desc' } = req.query;
    
    let query = `
      SELECT id, first_name, last_name, email, phone, date_of_birth, 
             gender, department, experience_level, status, avatar_url, 
             created_at, updated_at
      FROM learners 
      ORDER BY ${sort} ${order.toUpperCase()}
    `;
    
    const params = [];
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [rows] = await pool.execute(query, params);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching learners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learners'
    });
  }
});

// Get learner by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT id, first_name, last_name, email, phone, date_of_birth, 
             gender, department, experience_level, status, avatar_url, 
             created_at, updated_at
      FROM learners 
      WHERE id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Learner not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching learner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learner'
    });
  }
});

// Create new learner
router.post('/', [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name must be less than 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces')
    .custom((value) => {
      if (value && value.trim().length < 2) {
        throw new Error('First name must be at least 2 characters long');
      }
      return true;
    }),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must be less than 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces')
    .custom((value) => {
      if (value && value.trim().length < 2) {
        throw new Error('Last name must be at least 2 characters long');
      }
      return true;
    }),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number (e.g., +1234567890 or 1234567890)')
    .custom((value) => {
      if (value && value.length < 10) {
        throw new Error('Phone number must be at least 10 digits long');
      }
      if (value && value.length > 15) {
        throw new Error('Phone number must be less than 15 digits');
      }
      return true;
    }),
  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Please enter a valid date format (YYYY-MM-DD)')
    .custom((value) => {
      if (value && new Date(value) > new Date()) {
        throw new Error('Date of birth cannot be in the future');
      }
      if (value && new Date(value) < new Date('1900-01-01')) {
        throw new Error('Date of birth cannot be before 1900');
      }
      return true;
    }),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Please select a valid gender'),
  body('department')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please select a valid Department')
    .isLength({ max: 100 })
    .withMessage('Department must be less than 100 characters')
    .custom(async (value) => {
      if (value && value.trim() !== '') {
        const [rows] = await pool.execute('SELECT id FROM departments WHERE name = ?', [value]);
        if (rows.length === 0) {
          throw new Error('Please select a valid Department');
        }
      }
      return true;
    })
    .withMessage('Please select a valid Department'),
  body('experience_level')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please select a valid Experience Level')
    .custom(async (value) => {
      if (value && value.trim() !== '') {
        const [rows] = await pool.execute('SELECT id FROM experience_levels WHERE name = ?', [value]);
        if (rows.length === 0) {
          throw new Error('Please select a valid Experience Level');
        }
      }
      return true;
    })
    .withMessage('Please select a valid Experience Level'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
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

    const {
      first_name, last_name, email, phone, date_of_birth,
      gender, department, experience_level, status
    } = req.body;



    // Check if email already exists
    const [existingRows] = await pool.execute(
      'SELECT id FROM learners WHERE email = ?',
      [email]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const [result] = await pool.execute(`
      INSERT INTO learners (first_name, last_name, email, phone, date_of_birth, 
                           gender, department, experience_level, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [first_name, last_name, email, phone || null, date_of_birth || null, gender || null, department, experience_level, status || 'active']);

    const [newLearner] = await pool.execute(
      'SELECT * FROM learners WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Learner created successfully',
      data: newLearner[0]
    });
  } catch (error) {
    console.error('Error creating learner:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create learner',
      error: error.message
    });
  }
});

// Update learner
router.put('/:id', [
  body('first_name').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('last_name').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('date_of_birth').optional().isISO8601().withMessage('Valid date format required'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('department').optional().trim(),
  body('experience_level').optional().trim().custom(async (value) => {
    if (value && value.trim() !== '') {
      const [rows] = await pool.execute('SELECT id FROM experience_levels WHERE name = ?', [value]);
      if (rows.length === 0) {
        throw new Error('Please select a valid Experience Level');
      }
    }
    return true;
  }).withMessage('Please select a valid Experience Level'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be either active or inactive')
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

    const { id } = req.params;
    const updateData = req.body;

    // Check if learner exists
    const [existingRows] = await pool.execute(
      'SELECT id FROM learners WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Learner not found'
      });
    }

    // Check if email is being updated and if it already exists
    if (updateData.email) {
      const [emailCheck] = await pool.execute(
        'SELECT id FROM learners WHERE email = ? AND id != ?',
        [updateData.email, id]
      );

      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    updateValues.push(id);
    const query = `UPDATE learners SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await pool.execute(query, updateValues);

    const [updatedLearner] = await pool.execute(
      'SELECT * FROM learners WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Learner updated successfully',
      data: updatedLearner[0]
    });
  } catch (error) {
    console.error('Error updating learner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update learner'
    });
  }
});

// Upload learner avatar (general upload)
router.post('/upload-image', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imagePath = `/assets/learners/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imagePath: imagePath
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
});

// Upload learner avatar (for specific learner)
router.post('/:id/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check if learner exists
    const [existingRows] = await pool.execute(
      'SELECT id, avatar_url FROM learners WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Learner not found'
      });
    }

    const avatarUrl = `/assets/learners/${req.file.filename}`;

    // Delete old avatar if exists
    if (existingRows[0].avatar_url) {
      const oldAvatarPath = path.join(__dirname, '..', existingRows[0].avatar_url);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update learner with new avatar
    await pool.execute(
      'UPDATE learners SET avatar_url = ? WHERE id = ?',
      [avatarUrl, id]
    );

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatar_url: avatarUrl }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
});

// Delete learner
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if learner exists
    const [existingRows] = await pool.execute(
      'SELECT id, avatar_url FROM learners WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Learner not found'
      });
    }

    // Delete avatar file if exists
    if (existingRows[0].avatar_url) {
      const avatarPath = path.join(__dirname, '..', existingRows[0].avatar_url);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Delete learner (cascade will handle course_learners)
    await pool.execute('DELETE FROM learners WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Learner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting learner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete learner'
    });
  }
});

// Get learner's courses
router.get('/:id/courses', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(`
      SELECT c.*, cl.assigned_at
      FROM courses c
      INNER JOIN course_learners cl ON c.id = cl.course_id
      WHERE cl.learner_id = ?
      ORDER BY cl.assigned_at DESC
    `, [id]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching learner courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learner courses'
    });
  }
});

module.exports = router;
