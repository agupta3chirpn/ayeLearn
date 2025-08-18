const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initializeDatabase = async () => {
  try {
    // Create admin_users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone_number VARCHAR(20),
        profile_image VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expiry DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create learners table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS learners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        gender ENUM('Male', 'Female', 'Other'),
        department VARCHAR(100),
        experience_level ENUM('Beginner', 'Intermediate', 'Advanced'),
        status ENUM('active', 'inactive') DEFAULT 'active',
        avatar_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add status column to existing learners table if it doesn't exist
    try {
      await pool.execute('ALTER TABLE learners ADD COLUMN status ENUM("active", "inactive") DEFAULT "active"');
      console.log('Status column added to learners table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('Status column already exists in learners table');
      } else {
        console.error('Error adding status column:', error);
      }
    }

    // Create courses table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
        estimated_duration VARCHAR(50),
        deadline VARCHAR(50),
        overview TEXT,
        learning_objectives JSON,
        assessment_criteria JSON,
        key_skills JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create course_learners table for many-to-many relationship
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS course_learners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        learner_id INT NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
        UNIQUE KEY unique_course_learner (course_id, learner_id)
      )
    `);

    // Check if default admin exists
    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE email = ?', ['agupta3chirpn@gmail.com']);
    
    if (rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Chirpn@123', 10);
      
      await pool.execute(
        'INSERT INTO admin_users (email, password_hash, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?)',
        ['agupta3chirpn@gmail.com', hashedPassword, 'Ankit', 'Gupta', '+918529187834']
      );
      console.log('Default admin user created');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = { pool, initializeDatabase };
