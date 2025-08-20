const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify admin still exists in database
    const [rows] = await pool.execute(
      'SELECT id, email FROM admin_users WHERE id = ?',
      [decoded.adminId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    req.admin = rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

const authenticateLearnerToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔍 Learner Auth Debug:');
    console.log('Auth Header:', authHeader);
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'No token');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 Decoded token:', decoded);
    
    // Verify learner still exists in database
    const [rows] = await pool.execute(
      'SELECT id, first_name, last_name, email, department, experience_level FROM learners WHERE id = ?',
      [decoded.learnerId]
    );

    console.log('👤 Database query result:', rows);

    if (rows.length === 0) {
      console.log('❌ Learner not found in database');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    console.log('✅ Learner authenticated successfully');
    req.learner = rows[0];
    next();
  } catch (error) {
    console.log('❌ Authentication error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

module.exports = { authenticateToken, authenticateLearnerToken };
