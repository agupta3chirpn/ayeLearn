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
        password_hash VARCHAR(255),
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

    // Add password_hash column to existing learners table if it doesn't exist
    try {
      await pool.execute('ALTER TABLE learners ADD COLUMN password_hash VARCHAR(255)');
      console.log('Password hash column added to learners table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('Password hash column already exists in learners table');
      } else {
        console.error('Error adding password hash column:', error);
      }
    }

    // Create courses table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        level VARCHAR(100) NOT NULL,
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

    // Update existing courses table to change level field from ENUM to VARCHAR
    try {
      await pool.execute('ALTER TABLE courses MODIFY COLUMN level VARCHAR(100) NOT NULL');
      console.log('Updated courses table level field to VARCHAR');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('Level field already updated in courses table');
      } else {
        console.error('Error updating level field:', error);
      }
    }

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

    // Create course_modules table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS course_modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        heading VARCHAR(255),
        video_heading VARCHAR(255),
        assessment_name VARCHAR(255),
        assessment_link VARCHAR(500),
        module_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // Create course_files table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS course_files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        module_id INT NULL,
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type ENUM('document', 'video', 'practice') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
      )
    `);

    // Update existing course_files table if it has different structure
    try {
      await pool.execute('ALTER TABLE course_files ADD COLUMN original_name VARCHAR(255) NOT NULL DEFAULT ""');
      console.log('Added original_name column to course_files table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('original_name column already exists in course_files table');
      } else {
        console.error('Error adding original_name column:', error);
      }
    }

    try {
      await pool.execute('ALTER TABLE course_files MODIFY COLUMN file_type ENUM("document", "video", "practice") NOT NULL');
      console.log('Updated file_type column in course_files table');
    } catch (error) {
      console.error('Error updating file_type column:', error);
    }

    // Remove old columns if they exist
    try {
      await pool.execute('ALTER TABLE course_files DROP COLUMN file_size');
      console.log('Removed file_size column from course_files table');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('file_size column does not exist in course_files table');
      } else {
        console.error('Error removing file_size column:', error);
      }
    }

    try {
      await pool.execute('ALTER TABLE course_files DROP COLUMN file_category');
      console.log('Removed file_category column from course_files table');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('file_category column does not exist in course_files table');
      } else {
        console.error('Error removing file_category column:', error);
      }
    }

    try {
      await pool.execute('ALTER TABLE course_files DROP COLUMN uploaded_at');
      console.log('Removed uploaded_at column from course_files table');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('uploaded_at column does not exist in course_files table');
      } else {
        console.error('Error removing uploaded_at column:', error);
      }
    }

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
