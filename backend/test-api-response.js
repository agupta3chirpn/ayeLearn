const { pool } = require('./config/database');

const testApiResponse = async () => {
  try {
    console.log('🔍 Testing full API response for courses...\n');
    
    // Test the exact query used in the API
    const [rows] = await pool.execute(`
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
    `);
    
    console.log('📊 Full API Response:');
    rows.forEach((course, index) => {
      console.log(`\n${index + 1}. ${course.title}`);
      console.log(`   Department: ${course.department}`);
      console.log(`   Level: ${course.level}`);
      console.log(`   Assigned Learners: ${course.assigned_learners_count}`);
      console.log(`   Modules: ${course.modules_count}`);
      console.log(`   Files: ${course.files_count}`);
      console.log(`   Created: ${course.created_at}`);
    });
    
    console.log('\n🎯 Expected vs Actual:');
    console.log('Expected:');
    console.log('  - Advanced Web Development: 2 learners');
    console.log('  - Digital Marketing Fundamentals: 2 learners');
    console.log('  - Sales Techniques & Customer Relations: 2 learners');
    
    console.log('\nActual:');
    rows.forEach(course => {
      console.log(`  - ${course.title}: ${course.assigned_learners_count} learners`);
    });
    
  } catch (error) {
    console.error('❌ Error testing API response:', error);
  } finally {
    await pool.end();
  }
};

testApiResponse();
