const { pool } = require('./config/database');

const fixCourseData = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔧 Fixing course data...\n');
    
    // First, let's see what we have
    const [currentCourses] = await connection.execute('SELECT id, title, department FROM courses ORDER BY id');
    console.log('📚 Current Courses:');
    currentCourses.forEach(row => {
      console.log(`${row.id}. ${row.title} - ${row.department}`);
    });
    
    // Update the departments to match our dummy data
    await connection.execute('UPDATE courses SET department = ? WHERE title = ?', ['Engineering', 'Advanced Web Development']);
    await connection.execute('UPDATE courses SET department = ? WHERE title = ?', ['Marketing', 'Digital Marketing Fundamentals']);
    await connection.execute('UPDATE courses SET department = ? WHERE title = ?', ['Sales', 'Sales Techniques & Customer Relations']);
    
    console.log('\n✅ Updated departments');
    
    // Check the results
    const [updatedCourses] = await connection.execute('SELECT id, title, department FROM courses ORDER BY id');
    console.log('\n📚 Updated Courses:');
    updatedCourses.forEach(row => {
      console.log(`${row.id}. ${row.title} - ${row.department}`);
    });
    
    // Check learner counts
    console.log('\n👥 Learner Counts:');
    const [learnerCounts] = await connection.execute(`
      SELECT 
        c.title,
        COUNT(DISTINCT cl.learner_id) as learner_count
      FROM courses c
      LEFT JOIN course_learners cl ON c.id = cl.course_id
      GROUP BY c.id, c.title
      ORDER BY c.id
    `);
    
    learnerCounts.forEach(row => {
      console.log(`${row.title}: ${row.learner_count} learners`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing course data:', error);
  } finally {
    connection.release();
    await pool.end();
  }
};

fixCourseData();
