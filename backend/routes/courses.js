const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for course file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../assets/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const fileType = req.body.type || 'document';
    
    // Generate unique filename based on file type
    let prefix;
    switch (fileType) {
      case 'practiceFiles':
        prefix = 'practice';
        break;
      case 'documents':
        prefix = 'document';
        break;
      case 'videos':
        prefix = 'video';
        break;
      default:
        prefix = 'file';
    }
    
    cb(null, `${prefix}_${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf', 
    'text/plain', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload course file
router.post('/upload-course-file', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = `/assets/documents/${req.file.filename}`;
    const fileType = req.body.type || 'document';

    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileName: req.file.filename,
      filePath: filePath,
      originalName: req.file.originalname,
      fileType: fileType,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('Error uploading course file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    });
  }
});

// Validation middleware
const validateCourse = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('level').trim().notEmpty().withMessage('Level is required'),
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
    const { limit } = req.query;
    
    let query = `
      SELECT 
        c.*,
        COUNT(DISTINCT cl.learner_id) as assigned_learners_count,
        COUNT(DISTINCT cm.id) as modules_count,
        COUNT(DISTINCT cf.id) as files_count
      FROM courses c
      LEFT JOIN course_learners cl ON c.id = cl.course_id
      LEFT JOIN course_modules cm ON c.id = cm.course_id
      LEFT JOIN course_files cf ON c.id = cf.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
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

    // Get modules for this course
    const [moduleRows] = await pool.execute(`
      SELECT * FROM course_modules 
      WHERE course_id = ? 
      ORDER BY module_order
    `, [id]);

    // Get files for this course
    const [fileRows] = await pool.execute(`
      SELECT * FROM course_files 
      WHERE course_id = ?
    `, [id]);

    const course = courseRows[0];
    course.assigned_learners = learnerRows;
    course.modules = moduleRows.map(module => {
      const moduleFiles = fileRows.filter(file => file.module_id === module.id);
      return {
        ...module,
        documents: moduleFiles.filter(file => file.file_type === 'document'),
        videos: moduleFiles.filter(file => file.file_type === 'video')
      };
    });
    course.practice_files = fileRows.filter(file => file.file_type === 'practice' && !file.module_id);

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
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    console.log('Received course data:', req.body);

    const {
      title,
      department,
      level,
      estimated_duration,
      deadline,
      overview,
      learning_objectives,
      assessment_criteria,
      key_skills,
      modules,
      practiceFiles
    } = req.body;



    // Create course
    const [result] = await connection.execute(`
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

    const courseId = result.insertId;

    // Create modules if provided
    if (modules && Array.isArray(modules)) {
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        
        const [moduleResult] = await connection.execute(`
          INSERT INTO course_modules (
            course_id, heading, video_heading, assessment_name, assessment_link, module_order
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          courseId,
          module.heading || null,
          module.videoHeading || module.video_heading || null,
          module.assessmentName || module.assessment_name || null,
          module.assessmentLink || module.assessment_link || null,
          i + 1
        ]);

        const moduleId = moduleResult.insertId;

        // Save module documents
        if (module.documents && Array.isArray(module.documents)) {
          for (const doc of module.documents) {
            await connection.execute(`
              INSERT INTO course_files (
                course_id, module_id, file_name, original_name, file_path, file_type
              ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
              courseId,
              moduleId,
              doc.fileName,
              doc.originalName,
              doc.filePath,
              'document'
            ]);
          }
        }

        // Save module videos
        if (module.videos && Array.isArray(module.videos)) {
          for (const video of module.videos) {
            await connection.execute(`
              INSERT INTO course_files (
                course_id, module_id, file_name, original_name, file_path, file_type
              ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
              courseId,
              moduleId,
              video.fileName,
              video.originalName,
              video.filePath,
              'video'
            ]);
          }
        }
      }
    }

    // Save practice files
    if (practiceFiles && Array.isArray(practiceFiles)) {
      for (const file of practiceFiles) {
        await connection.execute(`
          INSERT INTO course_files (
            course_id, module_id, file_name, original_name, file_path, file_type
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          courseId,
          null, // No module_id for practice files
          file.fileName,
          file.originalName,
          file.filePath,
          'practice'
        ]);
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      courseId: courseId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating course:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    connection.release();
  }
});

// Update course
router.put('/:id', authenticateToken, [
  body('title').optional().trim().isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('department').optional().trim().isLength({ max: 100 }).withMessage('Department must be less than 100 characters'),
  body('level').optional().trim().notEmpty().withMessage('Level is required'),
  body('estimated_duration').optional().trim(),
  body('deadline').optional().trim(),
  body('overview').optional().trim(),
  body('learning_objectives').optional().isArray().withMessage('Learning objectives must be an array'),
  body('assessment_criteria').optional().isArray().withMessage('Assessment criteria must be an array'),
  body('key_skills').optional().isArray().withMessage('Key skills must be an array')
], async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Update course validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    console.log('Updating course with data:', req.body);

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
      key_skills,
      modules,
      practiceFiles
    } = req.body;

    // Update course basic info
    const [result] = await connection.execute(`
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

    // Update modules and files if provided
    if (modules !== undefined || practiceFiles !== undefined) {
      // Delete existing modules and files
      await connection.execute('DELETE FROM course_files WHERE course_id = ?', [id]);
      await connection.execute('DELETE FROM course_modules WHERE course_id = ?', [id]);

      // Recreate modules if provided
      if (modules && Array.isArray(modules)) {
        for (let i = 0; i < modules.length; i++) {
          const module = modules[i];
          
          const [moduleResult] = await connection.execute(`
            INSERT INTO course_modules (
              course_id, heading, video_heading, assessment_name, assessment_link, module_order
            ) VALUES (?, ?, ?, ?, ?, ?)
          `, [
            id,
            module.heading || null,
            module.videoHeading || module.video_heading || null,
            module.assessmentName || module.assessment_name || null,
            module.assessmentLink || module.assessment_link || null,
            i + 1
          ]);

          const moduleId = moduleResult.insertId;

          // Save module documents
          if (module.documents && Array.isArray(module.documents)) {
            for (const doc of module.documents) {
              await connection.execute(`
                INSERT INTO course_files (
                  course_id, module_id, file_name, original_name, file_path, file_type
                ) VALUES (?, ?, ?, ?, ?, ?)
              `, [
                id,
                moduleId,
                doc.fileName || doc.file_name,
                doc.originalName || doc.original_name,
                doc.filePath || doc.file_path,
                'document'
              ]);
            }
          }

          // Save module videos
          if (module.videos && Array.isArray(module.videos)) {
            for (const video of module.videos) {
              await connection.execute(`
                INSERT INTO course_files (
                  course_id, module_id, file_name, original_name, file_path, file_type
                ) VALUES (?, ?, ?, ?, ?, ?)
              `, [
                id,
                moduleId,
                video.fileName || video.file_name,
                video.originalName || video.original_name,
                video.filePath || video.file_path,
                'video'
              ]);
            }
          }
        }
      }

      // Save practice files
      if (practiceFiles && Array.isArray(practiceFiles)) {
        for (const file of practiceFiles) {
          await connection.execute(`
            INSERT INTO course_files (
              course_id, module_id, file_name, original_name, file_path, file_type
            ) VALUES (?, ?, ?, ?, ?, ?)
          `, [
            id,
            null, // No module_id for practice files
            file.fileName || file.file_name,
            file.originalName || file.original_name,
            file.filePath || file.file_path,
            'practice'
          ]);
        }
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Course updated successfully',
      courseId: id
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    connection.release();
  }
});

// Delete file from server and database
router.delete('/delete-file', authenticateToken, async (req, res) => {
  try {
    const { filePath, fileId } = req.body;

    if (!filePath || !fileId) {
      return res.status(400).json({
        success: false,
        message: 'File path and file ID are required'
      });
    }

    // Delete file from filesystem
    try {
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log('File deleted from filesystem:', fullPath);
      } else {
        console.log('File not found in filesystem:', fullPath);
      }
    } catch (error) {
      console.error('Error deleting file from filesystem:', error);
    }

    // Delete file record from database
    const [result] = await pool.execute(
      'DELETE FROM course_files WHERE id = ?',
      [fileId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found in database'
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete course
router.delete('/:id', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    console.log(`Starting deletion of course ID: ${id}`);

    // First, get all course files to delete from filesystem
    const [fileRows] = await connection.execute(
      'SELECT file_path, file_name FROM course_files WHERE course_id = ?',
      [id]
    );

    console.log(`Found ${fileRows.length} files to delete`);

    // Get course details for logging
    const [courseRows] = await connection.execute(
      'SELECT title FROM courses WHERE id = ?',
      [id]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const courseTitle = courseRows[0].title;

    // Delete course_learners entries
    const [learnerResult] = await connection.execute(
      'DELETE FROM course_learners WHERE course_id = ?',
      [id]
    );
    console.log(`Deleted ${learnerResult.affectedRows} learner assignments`);

    // Delete course_files entries
    const [fileResult] = await connection.execute(
      'DELETE FROM course_files WHERE course_id = ?',
      [id]
    );
    console.log(`Deleted ${fileResult.affectedRows} file records`);

    // Delete course_modules entries
    const [moduleResult] = await connection.execute(
      'DELETE FROM course_modules WHERE course_id = ?',
      [id]
    );
    console.log(`Deleted ${moduleResult.affectedRows} module records`);

    // Finally, delete the course itself
    const [courseResult] = await connection.execute(
      'DELETE FROM courses WHERE id = ?',
      [id]
    );

    if (courseResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Delete files from filesystem
    let deletedFilesCount = 0;
    for (const file of fileRows) {
      try {
        const filePath = path.join(__dirname, '..', file.file_path);
        console.log(`Attempting to delete file: ${filePath}`);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Successfully deleted file: ${file.file_name}`);
          deletedFilesCount++;
        } else {
          console.log(`File not found on filesystem: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error deleting file ${file.file_name}:`, error);
        // Continue with other files even if one fails
      }
    }

    await connection.commit();

    console.log(`Course "${courseTitle}" (ID: ${id}) deleted successfully`);
    console.log(`- Deleted ${learnerResult.affectedRows} learner assignments`);
    console.log(`- Deleted ${fileResult.affectedRows} file records`);
    console.log(`- Deleted ${moduleResult.affectedRows} module records`);
    console.log(`- Deleted ${deletedFilesCount} files from filesystem`);

    res.json({
      success: true,
      message: 'Course deleted successfully',
      details: {
        courseTitle,
        deletedLearners: learnerResult.affectedRows,
        deletedFiles: fileResult.affectedRows,
        deletedModules: moduleResult.affectedRows,
        deletedFilesFromFS: deletedFilesCount
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  } finally {
    connection.release();
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
