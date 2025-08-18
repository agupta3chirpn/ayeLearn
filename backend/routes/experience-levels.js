const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get all experience levels
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [experienceLevels] = await pool.execute('SELECT * FROM experience_levels ORDER BY level_order ASC');
    res.json({ success: true, data: experienceLevels });
  } catch (error) {
    console.error('Error fetching experience levels:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch experience levels' });
  }
});

// Get experience level by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [experienceLevels] = await pool.execute('SELECT * FROM experience_levels WHERE id = ?', [req.params.id]);
    
    if (experienceLevels.length === 0) {
      return res.status(404).json({ success: false, message: 'Experience level not found' });
    }
    
    res.json({ success: true, data: experienceLevels[0] });
  } catch (error) {
    console.error('Error fetching experience level:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch experience level' });
  }
});

// Create new experience level
router.post('/', authenticateToken, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Experience level name is required and must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Experience level name can only contain letters and spaces'),
  body('level_order')
    .isInt({ min: 1, max: 100 })
    .withMessage('Level order must be a number between 1 and 100'),
  body('status')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, level_order, status } = req.body;

    // Check if experience level already exists
    const [existing] = await pool.execute('SELECT id FROM experience_levels WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Experience level with this name already exists' 
      });
    }

    // Check if level order already exists
    const [orderExists] = await pool.execute('SELECT id FROM experience_levels WHERE level_order = ?', [level_order]);
    if (orderExists.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Experience level with this order already exists' 
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO experience_levels (name, level_order, status, created_at) VALUES (?, ?, ?, NOW())',
      [name, level_order, status]
    );

    const [newExperienceLevel] = await pool.execute('SELECT * FROM experience_levels WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Experience level created successfully',
      experienceLevel: newExperienceLevel[0]
    });
  } catch (error) {
    console.error('Error creating experience level:', error);
    res.status(500).json({ success: false, message: 'Failed to create experience level' });
  }
});

// Update experience level
router.put('/:id', authenticateToken, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Experience level name is required and must be less than 50 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Experience level name can only contain letters, numbers, and spaces'),
  body('level_order')
    .isInt({ min: 1, max: 100 })
    .withMessage('Level order must be a number between 1 and 100'),
  body('status')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, level_order, status } = req.body;
    const experienceLevelId = req.params.id;

    // Check if experience level exists
    const [existing] = await pool.execute('SELECT id FROM experience_levels WHERE id = ?', [experienceLevelId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Experience level not found' });
    }

    // Check if name already exists for other experience levels
    const [nameExists] = await pool.execute('SELECT id FROM experience_levels WHERE name = ? AND id != ?', [name, experienceLevelId]);
    if (nameExists.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Experience level with this name already exists' 
      });
    }

    // Check if level order already exists for other experience levels
    const [orderExists] = await pool.execute('SELECT id FROM experience_levels WHERE level_order = ? AND id != ?', [level_order, experienceLevelId]);
    if (orderExists.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Experience level with this order already exists' 
      });
    }

    await pool.execute(
      'UPDATE experience_levels SET name = ?, level_order = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [name, level_order, status, experienceLevelId]
    );

    const [updatedExperienceLevel] = await pool.execute('SELECT * FROM experience_levels WHERE id = ?', [experienceLevelId]);
    
    res.json({ 
      success: true, 
      message: 'Experience level updated successfully',
      experienceLevel: updatedExperienceLevel[0]
    });
  } catch (error) {
    console.error('Error updating experience level:', error);
    res.status(500).json({ success: false, message: 'Failed to update experience level' });
  }
});

// Delete experience level
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const experienceLevelId = req.params.id;

    // Check if experience level exists
    const [existing] = await pool.execute('SELECT id FROM experience_levels WHERE id = ?', [experienceLevelId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Experience level not found' });
    }

    // Check if experience level is being used by learners
    const [learners] = await pool.execute('SELECT id FROM learners WHERE experience_level = (SELECT name FROM experience_levels WHERE id = ?)', [experienceLevelId]);
    if (learners.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete experience level. It is being used by learners.' 
      });
    }

    await pool.execute('DELETE FROM experience_levels WHERE id = ?', [experienceLevelId]);
    
    res.json({ success: true, message: 'Experience level deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience level:', error);
    res.status(500).json({ success: false, message: 'Failed to delete experience level' });
  }
});

module.exports = router;
