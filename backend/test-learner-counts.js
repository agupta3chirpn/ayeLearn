const { pool } = require('./config/database');

const testLearnerCounts = async () => {
  try {
    console.log('🔍 Testing learner counts for courses...\n');
    
    // Test the current query (before fix)
    const [oldRows] = await pool.execute(`
      SELECT 
        c.title,
        COUNT(cl.learner_id) as old_count
      FROM courses c
      LEFT JOIN course_learners cl ON c.id = cl.course_id
      GROUP BY c.id, c.title
      ORDER BY c.title
    `);
    
    console.log('❌ OLD Query Results (COUNT without DISTINCT):');
    oldRows.forEach(row => {
      console.log(`  ${row.title}: ${row.old_count} learners`);
    });
    
    console.log('\n✅ NEW Query Results (COUNT with DISTINCT):');
    const [newRows] = await pool.execute(`
      SELECT 
        c.title,
        COUNT(DISTINCT cl.learner_id) as new_count
      FROM courses c
      LEFT JOIN course_learners cl ON c.id = cl.course_id
      GROUP BY c.id, c.title
      ORDER BY c.title
    `);
    
    newRows.forEach(row => {
      console.log(`  ${row.title}: ${row.new_count} learners`);
    });
    
    console.log('\n📊 Detailed Assignment Data:');
    const [assignments] = await pool.execute(`
      SELECT 
        c.title,
        l.first_name,
        l.last_name
      FROM courses c
      LEFT JOIN course_learners cl ON c.id = cl.course_id
      LEFT JOIN learners l ON cl.learner_id = l.id
      ORDER BY c.title, l.first_name
    `);
    
    let currentCourse = '';
    assignments.forEach(row => {
      if (row.title !== currentCourse) {
        currentCourse = row.title;
        console.log(`\n  ${row.title}:`);
      }
      if (row.first_name) {
        console.log(`    - ${row.first_name} ${row.last_name}`);
      } else {
        console.log(`    - No learners assigned`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error testing learner counts:', error);
  } finally {
    await pool.end();
  }
};

testLearnerCounts();
