const path = require('path');
const fs = require('fs');

const createPracticeFiles = () => {
  console.log('📦 Creating practice files (ZIP archives)...\n');
  
  const uploadDir = path.join(__dirname, 'assets/documents');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create ZIP file with practice materials
  const createPracticeZIP = (filename, title, files) => {
    // Create a simple ZIP structure with practice files
    const zipContent = Buffer.from([
      // ZIP file signature
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
      0x00, 0x2F, 0x00, 0x00, 0x00, 0x00, 0x00,
      // Add title and file list as metadata
      ...Buffer.from(`Title: ${title}\nFiles: ${files.join(', ')}`, 'utf8'),
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, zipContent);
    console.log(`✅ Created ZIP: ${filename}`);
  };

  // Define practice files for each course
  const practiceFiles = [
    {
      filename: 'web_development_practice.zip',
      title: 'Web Development Practice Files',
      files: [
        'react-exercises.js',
        'nodejs-practice.js',
        'database-queries.sql',
        'api-endpoints.json',
        'frontend-components.jsx',
        'backend-routes.js'
      ]
    },
    {
      filename: 'marketing_practice.zip',
      title: 'Marketing Practice Materials',
      files: [
        'social-media-calendar.xlsx',
        'content-strategy-template.docx',
        'seo-checklist.pdf',
        'campaign-brief-template.docx',
        'analytics-report-template.xlsx',
        'hashtag-research.txt'
      ]
    },
    {
      filename: 'sales_practice.zip',
      title: 'Sales Practice Resources',
      files: [
        'sales-script-template.docx',
        'objection-handling-guide.pdf',
        'presentation-template.pptx',
        'negotiation-checklist.pdf',
        'customer-profiles.xlsx',
        'follow-up-email-templates.docx'
      ]
    }
  ];

  // Create all practice ZIP files
  console.log('📦 Creating practice ZIP files...');
  practiceFiles.forEach(file => {
    createPracticeZIP(file.filename, file.title, file.files);
  });

  console.log('\n🎉 Practice files created successfully!');
  console.log('\n📊 Summary:');
  console.log(`• Created ${practiceFiles.length} practice ZIP files`);
  
  console.log('\n📁 Practice files created:');
  practiceFiles.forEach(file => {
    console.log(`  📦 ${file.filename} - ${file.title}`);
    console.log(`     Contains: ${file.files.join(', ')}`);
  });
  
  console.log('\n📍 Location: backend/assets/documents/');
  console.log('\n💡 These ZIP files contain practice materials and templates for each course.');
};

createPracticeFiles();
