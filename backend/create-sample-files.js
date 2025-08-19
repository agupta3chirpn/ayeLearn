const path = require('path');
const fs = require('fs');

const createSampleFiles = () => {
  console.log('🎬 Creating sample MP4 and PDF files...\n');
  
  const uploadDir = path.join(__dirname, 'assets/documents');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create sample PDF files with realistic content
  const createSamplePDF = (filename, title, content) => {
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj

4 0 obj
<<
/Length ${content.length + 100}
>>
stream
BT
/F1 16 Tf
72 720 Td
(${title}) Tj
0 -30 Td
/F1 12 Tf
${content.split('\n').map(line => `(${line}) Tj 0 -20 Td`).join('\n')}
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${content.length + 400}
%%EOF`;

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, pdfContent);
    console.log(`✅ Created PDF: ${filename}`);
  };

  // Create sample MP4 files (with proper MP4 headers)
  const createSampleMP4 = (filename, title) => {
    // Create a minimal MP4 file with proper headers
    const mp4Content = Buffer.from([
      // MP4 file signature
      0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32,
      0x00, 0x00, 0x00, 0x00, 0x6D, 0x70, 0x34, 0x32, 0x69, 0x73, 0x6F, 0x6D,
      0x00, 0x00, 0x00, 0x08, 0x6D, 0x64, 0x61, 0x74,
      // Add some dummy video data
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      // Add title as metadata
      ...Buffer.from(`Title: ${title}`, 'utf8'),
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, mp4Content);
    console.log(`✅ Created MP4: ${filename}`);
  };

  // Create sample PDF files
  const pdfFiles = [
    {
      filename: 'react_complete_guide.pdf',
      title: 'React.js Complete Guide',
      content: `React.js Complete Guide

Chapter 1: Introduction to React
- What is React?
- Why use React?
- Setting up your development environment

Chapter 2: Components and JSX
- Understanding components
- JSX syntax
- Props and state

Chapter 3: Hooks and Lifecycle
- useState hook
- useEffect hook
- Custom hooks

Chapter 4: Advanced Concepts
- Context API
- Performance optimization
- Testing React components

This guide covers all essential React concepts for modern web development.`
    },
    {
      filename: 'nodejs_api_guide.pdf',
      title: 'Node.js API Development Guide',
      content: `Node.js API Development Guide

Chapter 1: Getting Started with Node.js
- Installing Node.js
- Understanding the event loop
- Basic server setup

Chapter 2: Express.js Framework
- Routing
- Middleware
- Error handling

Chapter 3: Database Integration
- MySQL with Node.js
- Connection pooling
- Query optimization

Chapter 4: Authentication & Security
- JWT tokens
- Password hashing
- Input validation

Chapter 5: API Best Practices
- RESTful design
- Error handling
- Documentation

This comprehensive guide will help you build robust APIs with Node.js.`
    },
    {
      filename: 'social_media_strategy.pdf',
      title: 'Social Media Marketing Strategy',
      content: `Social Media Marketing Strategy

Chapter 1: Platform Overview
- Facebook marketing
- Instagram strategies
- LinkedIn for B2B
- Twitter engagement

Chapter 2: Content Strategy
- Content calendar
- Visual content creation
- Copywriting tips
- Hashtag strategy

Chapter 3: Audience Engagement
- Community management
- Responding to comments
- Crisis management
- Building relationships

Chapter 4: Analytics & Measurement
- Key metrics to track
- Tools and platforms
- ROI measurement
- A/B testing

Chapter 5: Paid Advertising
- Facebook Ads
- Instagram Ads
- Targeting strategies
- Budget optimization

Master the art of social media marketing with this comprehensive guide.`
    },
    {
      filename: 'seo_handbook.pdf',
      title: 'SEO Complete Handbook',
      content: `SEO Complete Handbook

Chapter 1: SEO Fundamentals
- What is SEO?
- How search engines work
- Keyword research
- On-page vs off-page SEO

Chapter 2: Technical SEO
- Website structure
- Page speed optimization
- Mobile optimization
- Schema markup

Chapter 3: Content SEO
- Content strategy
- Keyword optimization
- Internal linking
- Content marketing

Chapter 4: Link Building
- Quality vs quantity
- Outreach strategies
- Guest posting
- Broken link building

Chapter 5: Local SEO
- Google My Business
- Local citations
- Review management
- Local link building

Chapter 6: Analytics & Monitoring
- Google Analytics
- Search Console
- Competitor analysis
- Performance tracking

The ultimate guide to search engine optimization.`
    },
    {
      filename: 'sales_techniques_manual.pdf',
      title: 'Advanced Sales Techniques Manual',
      content: `Advanced Sales Techniques Manual

Chapter 1: Sales Psychology
- Understanding buyer behavior
- Building rapport
- Overcoming objections
- Closing techniques

Chapter 2: Prospecting Strategies
- Lead generation
- Cold calling techniques
- Social selling
- Referral programs

Chapter 3: Presentation Skills
- Storytelling in sales
- Value proposition
- Handling questions
- Presentation structure

Chapter 4: Negotiation Skills
- Win-win negotiations
- Price anchoring
- Concession strategies
- Closing deals

Chapter 5: Customer Relationship Management
- Building long-term relationships
- Follow-up strategies
- Customer retention
- Upselling techniques

Chapter 6: Sales Technology
- CRM systems
- Sales automation
- Analytics and reporting
- Social media tools

Master the art of professional selling with proven techniques.`
    },
    {
      filename: 'crm_strategy_guide.pdf',
      title: 'CRM Strategy Guide',
      content: `CRM Strategy Guide

Chapter 1: CRM Fundamentals
- What is CRM?
- Types of CRM systems
- Implementation planning
- Change management

Chapter 2: Customer Data Management
- Data collection strategies
- Data quality management
- Privacy and compliance
- Data integration

Chapter 3: Sales Process Optimization
- Lead management
- Opportunity tracking
- Pipeline management
- Sales forecasting

Chapter 4: Customer Service Excellence
- Case management
- Knowledge base
- Self-service portals
- Customer satisfaction

Chapter 5: Marketing Automation
- Email marketing
- Campaign management
- Lead nurturing
- Marketing analytics

Chapter 6: Analytics and Reporting
- Key performance indicators
- Custom reports
- Dashboards
- Business intelligence

Transform your business with effective CRM strategies.`
    }
  ];

  // Create sample MP4 files
  const mp4Files = [
    {
      filename: 'react_basics_tutorial.mp4',
      title: 'React Basics Tutorial'
    },
    {
      filename: 'nodejs_api_tutorial.mp4',
      title: 'Node.js API Development Tutorial'
    },
    {
      filename: 'social_media_tutorial.mp4',
      title: 'Social Media Marketing Tutorial'
    },
    {
      filename: 'seo_tutorial.mp4',
      title: 'SEO Fundamentals Tutorial'
    },
    {
      filename: 'sales_presentation_skills.mp4',
      title: 'Sales Presentation Skills'
    },
    {
      filename: 'crm_implementation.mp4',
      title: 'CRM Implementation Guide'
    }
  ];

  // Create all PDF files
  console.log('📄 Creating PDF files...');
  pdfFiles.forEach(file => {
    createSamplePDF(file.filename, file.title, file.content);
  });

  // Create all MP4 files
  console.log('\n🎬 Creating MP4 files...');
  mp4Files.forEach(file => {
    createSampleMP4(file.filename, file.title);
  });

  console.log('\n🎉 Sample files created successfully!');
  console.log('\n📊 Summary:');
  console.log(`• Created ${pdfFiles.length} PDF files`);
  console.log(`• Created ${mp4Files.length} MP4 files`);
  console.log(`• Total files: ${pdfFiles.length + mp4Files.length}`);
  
  console.log('\n📁 Files created:');
  pdfFiles.forEach(file => {
    console.log(`  📄 ${file.filename} - ${file.title}`);
  });
  mp4Files.forEach(file => {
    console.log(`  🎬 ${file.filename} - ${file.title}`);
  });
  
  console.log('\n📍 Location: backend/assets/documents/');
  console.log('\n💡 These files can be used for testing file uploads and downloads in the course system.');
};

createSampleFiles();
