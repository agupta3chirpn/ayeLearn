const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateCourse = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Level must be Beginner, Intermediate, or Advanced'),
  body('estimated_duration').optional().trim(),
  body('deadline').optional().trim(),
  body('overview').optional().trim(),
  body('learning_objectives').optional().isArray().withMessage('Learning objectives must be an array'),
  body('assessment_criteria').optional().isArray().withMessage('Assessment criteria must be an array'),
  body('key_skills').optional().isArray().withMessage('Key skills must be an array')
];

// Get all courses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        COUNT(cl.learner_id) as assigned_learners_count
      FROM courses c
      LEFT JOIN course_learners cl ON c.id = cl.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get learners assigned to a course (MUST come before /:id route)
router.get('/:id/learners', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(`
      SELECT l.* FROM learners l
      INNER JOIN course_learners cl ON l.id = cl.learner_id
      WHERE cl.course_id = ?
      ORDER BY l.first_name, l.last_name
    `, [id]);

    res.json({
      success: true,
      learners: rows
    });
  } catch (error) {
    console.error('Error fetching course learners:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get course by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [courseRows] = await pool.execute(
      'SELECT * FROM courses WHERE id = ?',
      [id]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get assigned learners for this course
    const [learnerRows] = await pool.execute(`
      SELECT l.* FROM learners l
      INNER JOIN course_learners cl ON l.id = cl.learner_id
      WHERE cl.course_id = ?
    `, [id]);

    const course = courseRows[0];
    course.assigned_learners = learnerRows;

    res.json({
      success: true,
      course: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new course
router.post('/', authenticateToken, validateCourse, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      department,
      level,
      estimated_duration,
      deadline,
      overview,
      learning_objectives,
      assessment_criteria,
      key_skills
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO courses (
        title, department, level, estimated_duration, deadline, 
        overview, learning_objectives, assessment_criteria, key_skills
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      department,
      level,
      estimated_duration || null,
      deadline || null,
      overview || null,
      learning_objectives ? JSON.stringify(learning_objectives) : null,
      assessment_criteria ? JSON.stringify(assessment_criteria) : null,
      key_skills ? JSON.stringify(key_skills) : null
    ]);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      courseId: result.insertId
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update course
router.put('/:id', authenticateToken, [
  body('title').optional().trim().isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('department').optional().trim().isLength({ max: 100 }).withMessage('Department must be less than 100 characters'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Level must be Beginner, Intermediate, or Advanced'),
  body('estimated_duration').optional().trim(),
  body('deadline').optional().trim(),
  body('overview').optional().trim(),
  body('learning_objectives').optional().isArray().withMessage('Learning objectives must be an array'),
  body('assessment_criteria').optional().isArray().withMessage('Assessment criteria must be an array'),
  body('key_skills').optional().isArray().withMessage('Key skills must be an array')
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

    const { id } = req.params;
    const {
      title,
      department,
      level,
      estimated_duration,
      deadline,
      overview,
      learning_objectives,
      assessment_criteria,
      key_skills
    } = req.body;

    const [result] = await pool.execute(`
      UPDATE courses SET
        title = COALESCE(?, title), 
        department = COALESCE(?, department), 
        level = COALESCE(?, level), 
        estimated_duration = ?, 
        deadline = ?, 
        overview = ?, 
        learning_objectives = ?, 
        assessment_criteria = ?, 
        key_skills = ?, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || null,
      department || null,
      level || null,
      estimated_duration || null,
      deadline || null,
      overview || null,
      learning_objectives ? JSON.stringify(learning_objectives) : null,
      assessment_criteria ? JSON.stringify(assessment_criteria) : null,
      key_skills ? JSON.stringify(key_skills) : null,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete course
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM courses WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Assign learners to course
router.post('/:id/assign-learners', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { learner_ids } = req.body;

    if (!learner_ids || !Array.isArray(learner_ids)) {
      return res.status(400).json({
        success: false,
        message: 'learner_ids array is required'
      });
    }

    // Check if course exists
    const [courseRows] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [id]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Remove existing assignments
    await pool.execute(
      'DELETE FROM course_learners WHERE course_id = ?',
      [id]
    );

    // Add new assignments
    if (learner_ids.length > 0) {
      for (const learner_id of learner_ids) {
        await pool.execute(
          'INSERT INTO course_learners (course_id, learner_id) VALUES (?, ?)',
          [id, learner_id]
        );
      }
    }

    res.json({
      success: true,
      message: 'Learners assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning learners:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
