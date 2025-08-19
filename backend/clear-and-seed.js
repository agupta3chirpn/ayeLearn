const { pool } = require('./config/database');
const { seedDummyData } = require('./seed-dummy-data');
const path = require('path');
const fs = require('fs');

const clearAndSeed = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🧹 Clearing existing data...');
    
    // Clear data in proper order to maintain referential integrity
    await connection.execute('DELETE FROM course_learners');
    console.log('✅ Cleared course_learners');
    
    await connection.execute('DELETE FROM course_files');
    console.log('✅ Cleared course_files');
    
    await connection.execute('DELETE FROM course_modules');
    console.log('✅ Cleared course_modules');
    
    await connection.execute('DELETE FROM courses');
    console.log('✅ Cleared courses');
    
    await connection.execute('DELETE FROM learners');
    console.log('✅ Cleared learners');
    
    // Clear files from filesystem
    const uploadDir = path.join(__dirname, 'assets/documents');
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      for (const file of files) {
        const filePath = path.join(uploadDir, file);
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted file: ${file}`);
      }
    }
    
    console.log('\n🌱 Starting to seed fresh dummy data...');
    await seedDummyData();
    
  } catch (error) {
    console.error('❌ Error in clear and seed:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Run the clear and seed function
if (require.main === module) {
  clearAndSeed()
    .then(() => {
      console.log('\n✅ Clear and seed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Clear and seed failed:', error);
      process.exit(1);
    });
}

module.exports = { clearAndSeed };
