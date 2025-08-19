const { pool } = require('./config/database');

const checkCourses = async () => {
  try {
    console.log('🔍 Checking course data...\n');
    
    const [rows] = await pool.execute('SELECT id, title, department FROM courses ORDER BY id');
    
    console.log('📚 Course Data:');
    rows.forEach(row => {
      console.log(`${row.id}. ${row.title} - ${row.department}`);
    });
    
    console.log('\n👥 Learner Assignments:');
    const [assignments] = await pool.execute(`
      SELECT 
        c.title,
        COUNT(DISTINCT cl.learner_id) as learner_count
      FROM courses c
      LEFT JOIN course_learners cl ON c.id = cl.course_id
      GROUP BY c.id, c.title
      ORDER BY c.id
    `);
    
    assignments.forEach(row => {
      console.log(`${row.title}: ${row.learner_count} learners`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
};

checkCourses();
