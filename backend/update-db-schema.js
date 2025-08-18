const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabaseSchema() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ayelearn_db'
    });

    console.log('Connected to MySQL database');

    // Create departments table
    const createDepartmentsTable = `
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Create experience_levels table
    const createExperienceLevelsTable = `
      CREATE TABLE IF NOT EXISTS experience_levels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        level_order INT NOT NULL UNIQUE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Execute table creation
    await connection.execute(createDepartmentsTable);
    console.log('✅ Departments table created/verified');

    await connection.execute(createExperienceLevelsTable);
    console.log('✅ Experience levels table created/verified');

    // Insert default departments
    const defaultDepartments = [
      { name: 'Computer Science', description: 'Computer Science and Engineering' },
      { name: 'Information Technology', description: 'Information Technology' },
      { name: 'Electronics', description: 'Electronics and Communication' },
      { name: 'Mechanical', description: 'Mechanical Engineering' },
      { name: 'Civil', description: 'Civil Engineering' },
      { name: 'Electrical', description: 'Electrical Engineering' }
    ];

    for (const dept of defaultDepartments) {
      try {
        await connection.execute(
          'INSERT INTO departments (name, description, status) VALUES (?, ?, ?)',
          [dept.name, dept.description, 'active']
        );
        console.log(`✅ Added department: ${dept.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️  Department already exists: ${dept.name}`);
        } else {
          console.error(`❌ Error adding department ${dept.name}:`, error.message);
        }
      }
    }

    // Insert default experience levels
    const defaultExperienceLevels = [
      { name: 'Beginner', description: 'No prior experience', level_order: 1 },
      { name: 'Intermediate', description: 'Some experience', level_order: 2 },
      { name: 'Advanced', description: 'Experienced', level_order: 3 },
      { name: 'Expert', description: 'Highly experienced', level_order: 4 }
    ];

    for (const level of defaultExperienceLevels) {
      try {
        await connection.execute(
          'INSERT INTO experience_levels (name, description, level_order, status) VALUES (?, ?, ?, ?)',
          [level.name, level.description, level.level_order, 'active']
        );
        console.log(`✅ Added experience level: ${level.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️  Experience level already exists: ${level.name}`);
        } else {
          console.error(`❌ Error adding experience level ${level.name}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Database schema updated successfully!');
    console.log('\n📋 Summary:');
    console.log('- Departments table created with 6 default departments');
    console.log('- Experience levels table created with 4 default levels');
    console.log('- All tables include proper timestamps and constraints');

  } catch (error) {
    console.error('❌ Error updating database schema:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the update
updateDatabaseSchema();

