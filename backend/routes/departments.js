const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get all departments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [departments] = await pool.execute('SELECT * FROM departments ORDER BY name ASC');
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch departments' });
  }
});

// Get department by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [departments] = await pool.execute('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    
    if (departments.length === 0) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    
    res.json({ success: true, data: departments[0] });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch department' });
  }
});

// Create new department
router.post('/', authenticateToken, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Department name is required and must be less than 100 characters')
    .matches(/^[a-zA-Z\s\-&]+$/)
    .withMessage('Department name can only contain letters, spaces, hyphens, and ampersands'),
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

    const { name, status } = req.body;

    // Check if department already exists
    const [existing] = await pool.execute('SELECT id FROM departments WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Department with this name already exists' 
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO departments (name, status, created_at) VALUES (?, ?, NOW())',
      [name, status]
    );

    const [newDepartment] = await pool.execute('SELECT * FROM departments WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Department created successfully',
      department: newDepartment[0]
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ success: false, message: 'Failed to create department' });
  }
});

// Update department
router.put('/:id', authenticateToken, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Department name is required and must be less than 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&]+$/)
    .withMessage('Department name can only contain letters, numbers, spaces, hyphens, and ampersands'),
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

    const { name, status } = req.body;
    const departmentId = req.params.id;

    // Check if department exists
    const [existing] = await pool.execute('SELECT id FROM departments WHERE id = ?', [departmentId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    // Check if name already exists for other departments
    const [nameExists] = await pool.execute('SELECT id FROM departments WHERE name = ? AND id != ?', [name, departmentId]);
    if (nameExists.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Department with this name already exists' 
      });
    }

    await pool.execute(
      'UPDATE departments SET name = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [name, status, departmentId]
    );

    const [updatedDepartment] = await pool.execute('SELECT * FROM departments WHERE id = ?', [departmentId]);
    
    res.json({ 
      success: true, 
      message: 'Department updated successfully',
      department: updatedDepartment[0]
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ success: false, message: 'Failed to update department' });
  }
});

// Delete department
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const departmentId = req.params.id;

    // Check if department exists
    const [existing] = await pool.execute('SELECT id FROM departments WHERE id = ?', [departmentId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    // Check if department is being used by learners
    const [learners] = await pool.execute('SELECT id FROM learners WHERE department = (SELECT name FROM departments WHERE id = ?)', [departmentId]);
    if (learners.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete department. It is being used by learners.' 
      });
    }

    await pool.execute('DELETE FROM departments WHERE id = ?', [departmentId]);
    
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ success: false, message: 'Failed to delete department' });
  }
});

module.exports = router;
