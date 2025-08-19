const { pool } = require('./config/database');
const path = require('path');
const fs = require('fs');

const seedDummyData = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🌱 Starting to seed dummy data...');
    
    // Create dummy learners
    const learners = [
      {
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@example.com',
        phone: '+1234567890',
        date_of_birth: '1990-05-15',
        gender: 'Male',
        department: 'Engineering',
        experience_level: 'Intermediate',
        status: 'active'
      },
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1234567891',
        date_of_birth: '1988-12-03',
        gender: 'Female',
        department: 'Marketing',
        experience_level: 'Advanced',
        status: 'active'
      },
      {
        first_name: 'Michael',
        last_name: 'Brown',
        email: 'michael.brown@example.com',
        phone: '+1234567892',
        date_of_birth: '1995-08-22',
        gender: 'Male',
        department: 'Sales',
        experience_level: 'Beginner',
        status: 'active'
      }
    ];

    console.log('📝 Creating dummy learners...');
    const learnerIds = [];
    for (const learner of learners) {
      const [result] = await connection.execute(
        'INSERT INTO learners (first_name, last_name, email, phone, date_of_birth, gender, department, experience_level, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [learner.first_name, learner.last_name, learner.email, learner.phone, learner.date_of_birth, learner.gender, learner.department, learner.experience_level, learner.status]
      );
      learnerIds.push(result.insertId);
      console.log(`✅ Created learner: ${learner.first_name} ${learner.last_name}`);
    }

    // Create dummy courses
    const courses = [
      {
        title: 'Advanced Web Development',
        department: 'Engineering',
        level: 'Advanced',
        estimated_duration: '8 weeks',
        deadline: '2024-12-31',
        overview: 'Comprehensive course covering modern web development technologies including React, Node.js, and cloud deployment.',
        learning_objectives: JSON.stringify([
          'Master React.js fundamentals and advanced concepts',
          'Build scalable backend APIs with Node.js',
          'Implement cloud deployment strategies',
          'Understand modern development workflows'
        ]),
        assessment_criteria: JSON.stringify([
          'Complete project portfolio',
          'Code review participation',
          'Final assessment exam'
        ]),
        key_skills: JSON.stringify([
          'JavaScript/TypeScript',
          'React.js',
          'Node.js',
          'Database Design',
          'API Development'
        ])
      },
      {
        title: 'Digital Marketing Fundamentals',
        department: 'Marketing',
        level: 'Beginner',
        estimated_duration: '6 weeks',
        deadline: '2024-11-30',
        overview: 'Introduction to digital marketing strategies, tools, and best practices for modern businesses.',
        learning_objectives: JSON.stringify([
          'Understand digital marketing landscape',
          'Master social media marketing',
          'Learn SEO fundamentals',
          'Create effective marketing campaigns'
        ]),
        assessment_criteria: JSON.stringify([
          'Marketing campaign project',
          'Social media strategy presentation',
          'SEO optimization report'
        ]),
        key_skills: JSON.stringify([
          'Social Media Marketing',
          'SEO/SEM',
          'Content Marketing',
          'Analytics',
          'Campaign Management'
        ])
      },
      {
        title: 'Sales Techniques & Customer Relations',
        department: 'Sales',
        level: 'Intermediate',
        estimated_duration: '4 weeks',
        deadline: '2024-10-31',
        overview: 'Advanced sales techniques, customer relationship management, and negotiation skills for sales professionals.',
        learning_objectives: JSON.stringify([
          'Master advanced sales techniques',
          'Build strong customer relationships',
          'Develop negotiation skills',
          'Understand customer psychology'
        ]),
        assessment_criteria: JSON.stringify([
          'Sales pitch presentation',
          'Customer scenario role-play',
          'Sales strategy report'
        ]),
        key_skills: JSON.stringify([
          'Sales Techniques',
          'Customer Relations',
          'Negotiation',
          'Communication',
          'Problem Solving'
        ])
      }
    ];

    console.log('📚 Creating dummy courses...');
    const courseIds = [];
    for (const course of courses) {
      const [result] = await connection.execute(
        'INSERT INTO courses (title, department, level, estimated_duration, deadline, overview, learning_objectives, assessment_criteria, key_skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [course.title, course.department, course.level, course.estimated_duration, course.deadline, course.overview, course.learning_objectives, course.assessment_criteria, course.key_skills]
      );
      courseIds.push(result.insertId);
      console.log(`✅ Created course: ${course.title}`);
    }

    // Create dummy modules for each course
    const modules = [
      // Course 1: Advanced Web Development
      {
        course_id: courseIds[0],
        heading: 'React.js Fundamentals',
        video_heading: 'React Basics Tutorial',
        assessment_name: 'React Component Quiz',
        assessment_link: 'https://example.com/quiz1',
        module_order: 1
      },
      {
        course_id: courseIds[0],
        heading: 'Node.js Backend Development',
        video_heading: 'Building REST APIs',
        assessment_name: 'API Development Project',
        assessment_link: 'https://example.com/project1',
        module_order: 2
      },
      {
        course_id: courseIds[0],
        heading: 'Database Design & Management',
        video_heading: 'SQL & NoSQL Databases',
        assessment_name: 'Database Design Assignment',
        assessment_link: 'https://example.com/assignment1',
        module_order: 3
      },
      // Course 2: Digital Marketing
      {
        course_id: courseIds[1],
        heading: 'Social Media Marketing',
        video_heading: 'Platform-Specific Strategies',
        assessment_name: 'Social Media Campaign',
        assessment_link: 'https://example.com/campaign1',
        module_order: 1
      },
      {
        course_id: courseIds[1],
        heading: 'SEO Fundamentals',
        video_heading: 'Search Engine Optimization',
        assessment_name: 'SEO Audit Report',
        assessment_link: 'https://example.com/seo1',
        module_order: 2
      },
      // Course 3: Sales Techniques
      {
        course_id: courseIds[2],
        heading: 'Advanced Sales Techniques',
        video_heading: 'Sales Psychology & Techniques',
        assessment_name: 'Sales Pitch Presentation',
        assessment_link: 'https://example.com/pitch1',
        module_order: 1
      },
      {
        course_id: courseIds[2],
        heading: 'Customer Relationship Management',
        video_heading: 'Building Long-term Relationships',
        assessment_name: 'CRM Strategy Report',
        assessment_link: 'https://example.com/crm1',
        module_order: 2
      }
    ];

    console.log('📖 Creating dummy modules...');
    const moduleIds = [];
    for (const module of modules) {
      const [result] = await connection.execute(
        'INSERT INTO course_modules (course_id, heading, video_heading, assessment_name, assessment_link, module_order) VALUES (?, ?, ?, ?, ?, ?)',
        [module.course_id, module.heading, module.video_heading, module.assessment_name, module.assessment_link, module.module_order]
      );
      moduleIds.push(result.insertId);
      console.log(`✅ Created module: ${module.heading}`);
    }

    // Create dummy files
    const files = [
      // Course 1 files
      {
        course_id: courseIds[0],
        module_id: moduleIds[0],
        file_name: 'react_tutorial.pdf',
        original_name: 'React.js Complete Guide.pdf',
        file_path: '/assets/documents/react_tutorial.pdf',
        file_type: 'document'
      },
      {
        course_id: courseIds[0],
        module_id: moduleIds[0],
        file_name: 'react_basics.mp4',
        original_name: 'React Basics Video Tutorial.mp4',
        file_path: '/assets/documents/react_basics.mp4',
        file_type: 'video'
      },
      {
        course_id: courseIds[0],
        module_id: moduleIds[1],
        file_name: 'nodejs_guide.pdf',
        original_name: 'Node.js API Development Guide.pdf',
        file_path: '/assets/documents/nodejs_guide.pdf',
        file_type: 'document'
      },
      {
        course_id: courseIds[0],
        module_id: null,
        file_name: 'webdev_practice.zip',
        original_name: 'Web Development Practice Files.zip',
        file_path: '/assets/documents/webdev_practice.zip',
        file_type: 'practice'
      },
      // Course 2 files
      {
        course_id: courseIds[1],
        module_id: moduleIds[3],
        file_name: 'social_media_guide.pdf',
        original_name: 'Social Media Marketing Strategy.pdf',
        file_path: '/assets/documents/social_media_guide.pdf',
        file_type: 'document'
      },
      {
        course_id: courseIds[1],
        module_id: moduleIds[3],
        file_name: 'social_media_tutorial.mp4',
        original_name: 'Social Media Marketing Tutorial.mp4',
        file_path: '/assets/documents/social_media_tutorial.mp4',
        file_type: 'video'
      },
      {
        course_id: courseIds[1],
        module_id: moduleIds[4],
        file_name: 'seo_handbook.pdf',
        original_name: 'SEO Complete Handbook.pdf',
        file_path: '/assets/documents/seo_handbook.pdf',
        file_type: 'document'
      },
      {
        course_id: courseIds[1],
        module_id: null,
        file_name: 'marketing_templates.zip',
        original_name: 'Marketing Templates Collection.zip',
        file_path: '/assets/documents/marketing_templates.zip',
        file_type: 'practice'
      },
      // Course 3 files
      {
        course_id: courseIds[2],
        module_id: moduleIds[5],
        file_name: 'sales_techniques.pdf',
        original_name: 'Advanced Sales Techniques Manual.pdf',
        file_path: '/assets/documents/sales_techniques.pdf',
        file_type: 'document'
      },
      {
        course_id: courseIds[2],
        module_id: moduleIds[5],
        file_name: 'sales_presentation.mp4',
        original_name: 'Sales Presentation Skills.mp4',
        file_path: '/assets/documents/sales_presentation.mp4',
        file_type: 'video'
      },
      {
        course_id: courseIds[2],
        module_id: moduleIds[6],
        file_name: 'crm_strategy.pdf',
        original_name: 'CRM Strategy Guide.pdf',
        file_path: '/assets/documents/crm_strategy.pdf',
        file_type: 'document'
      },
      {
        course_id: courseIds[2],
        module_id: null,
        file_name: 'sales_resources.zip',
        original_name: 'Sales Resources & Templates.zip',
        file_path: '/assets/documents/sales_resources.zip',
        file_type: 'practice'
      }
    ];

    console.log('📁 Creating dummy files...');
    for (const file of files) {
      await connection.execute(
        'INSERT INTO course_files (course_id, module_id, file_name, original_name, file_path, file_type) VALUES (?, ?, ?, ?, ?, ?)',
        [file.course_id, file.module_id, file.file_name, file.original_name, file.file_path, file.file_type]
      );
      console.log(`✅ Created file: ${file.original_name}`);
    }

    // Assign learners to courses
    const assignments = [
      { course_id: courseIds[0], learner_id: learnerIds[0] }, // John to Web Development
      { course_id: courseIds[0], learner_id: learnerIds[1] }, // Sarah to Web Development
      { course_id: courseIds[1], learner_id: learnerIds[1] }, // Sarah to Digital Marketing
      { course_id: courseIds[1], learner_id: learnerIds[2] }, // Michael to Digital Marketing
      { course_id: courseIds[2], learner_id: learnerIds[2] }, // Michael to Sales
      { course_id: courseIds[2], learner_id: learnerIds[0] }  // John to Sales
    ];

    console.log('👥 Assigning learners to courses...');
    for (const assignment of assignments) {
      await connection.execute(
        'INSERT INTO course_learners (course_id, learner_id) VALUES (?, ?)',
        [assignment.course_id, assignment.learner_id]
      );
    }
    console.log(`✅ Assigned ${assignments.length} learner-course relationships`);

    // Create dummy files in the filesystem
    console.log('💾 Creating dummy files in filesystem...');
    const uploadDir = path.join(__dirname, 'assets/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create dummy PDF files
    const dummyPdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Dummy PDF Content) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF';

    const pdfFiles = [
      'react_tutorial.pdf',
      'nodejs_guide.pdf',
      'social_media_guide.pdf',
      'seo_handbook.pdf',
      'sales_techniques.pdf',
      'crm_strategy.pdf'
    ];

    for (const pdfFile of pdfFiles) {
      const filePath = path.join(uploadDir, pdfFile);
      fs.writeFileSync(filePath, dummyPdfContent);
      console.log(`✅ Created dummy PDF: ${pdfFile}`);
    }

    // Create dummy video files (small MP4 headers)
    const dummyMp4Content = Buffer.from([
      0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32,
      0x00, 0x00, 0x00, 0x00, 0x6D, 0x70, 0x34, 0x32, 0x69, 0x73, 0x6F, 0x6D,
      0x00, 0x00, 0x00, 0x08, 0x6D, 0x64, 0x61, 0x74, 0x00, 0x00, 0x00, 0x00
    ]);

    const videoFiles = [
      'react_basics.mp4',
      'social_media_tutorial.mp4',
      'sales_presentation.mp4'
    ];

    for (const videoFile of videoFiles) {
      const filePath = path.join(uploadDir, videoFile);
      fs.writeFileSync(filePath, dummyMp4Content);
      console.log(`✅ Created dummy video: ${videoFile}`);
    }

    // Create dummy ZIP files
    const dummyZipContent = Buffer.from([
      0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x0D, 0x00, 0x00, 0x00, 0x64, 0x75, 0x6D, 0x6D, 0x79, 0x2E,
      0x74, 0x78, 0x74, 0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x57, 0x6F, 0x72,
      0x6C, 0x64, 0x50, 0x4B, 0x01, 0x02, 0x14, 0x00, 0x14, 0x00, 0x00, 0x00,
      0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0D, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x64, 0x75, 0x6D, 0x6D, 0x79, 0x2E, 0x74, 0x78, 0x74, 0x50, 0x4B, 0x05,
      0x06, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x2F, 0x00, 0x00,
      0x00, 0x2F, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);

    const zipFiles = [
      'webdev_practice.zip',
      'marketing_templates.zip',
      'sales_resources.zip'
    ];

    for (const zipFile of zipFiles) {
      const filePath = path.join(uploadDir, zipFile);
      fs.writeFileSync(filePath, dummyZipContent);
      console.log(`✅ Created dummy ZIP: ${zipFile}`);
    }

    console.log('\n🎉 Dummy data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`• Created ${learners.length} learners`);
    console.log(`• Created ${courses.length} courses`);
    console.log(`• Created ${modules.length} modules`);
    console.log(`• Created ${files.length} file records`);
    console.log(`• Created ${assignments.length} learner-course assignments`);
    console.log(`• Created ${pdfFiles.length + videoFiles.length + zipFiles.length} dummy files in filesystem`);
    
    console.log('\n👥 Learners:');
    learners.forEach((learner, index) => {
      console.log(`  ${index + 1}. ${learner.first_name} ${learner.last_name} (${learner.department})`);
    });
    
    console.log('\n📚 Courses:');
    courses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.title} (${course.department} - ${course.level})`);
    });

  } catch (error) {
    console.error('❌ Error seeding dummy data:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Run the seeding function
if (require.main === module) {
  seedDummyData()
    .then(() => {
      console.log('\n✅ Database seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDummyData };
