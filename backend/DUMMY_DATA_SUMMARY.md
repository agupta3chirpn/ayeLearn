# 🎯 Dummy Data Summary

This document provides a comprehensive overview of the dummy data created for testing the ayeLearn application.

## 📊 Data Overview

### 👥 Learners (3 records)
| ID | Name | Email | Department | Experience Level | Status |
|----|------|-------|------------|------------------|--------|
| 1 | John Smith | john.smith@example.com | Engineering | Intermediate | Active |
| 2 | Sarah Johnson | sarah.johnson@example.com | Marketing | Advanced | Active |
| 3 | Michael Brown | michael.brown@example.com | Sales | Beginner | Active |

### 📚 Courses (3 records)
| ID | Title | Department | Level | Duration | Deadline |
|----|-------|------------|-------|----------|----------|
| 1 | Advanced Web Development | Engineering | Advanced | 8 weeks | 2024-12-31 |
| 2 | Digital Marketing Fundamentals | Marketing | Beginner | 6 weeks | 2024-11-30 |
| 3 | Sales Techniques & Customer Relations | Sales | Intermediate | 4 weeks | 2024-10-31 |

### 📖 Modules (7 records)
| Course | Module | Assessment |
|--------|--------|------------|
| Web Development | React.js Fundamentals | React Component Quiz |
| Web Development | Node.js Backend Development | API Development Project |
| Web Development | Database Design & Management | Database Design Assignment |
| Digital Marketing | Social Media Marketing | Social Media Campaign |
| Digital Marketing | SEO Fundamentals | SEO Audit Report |
| Sales Techniques | Advanced Sales Techniques | Sales Pitch Presentation |
| Sales Techniques | Customer Relationship Management | CRM Strategy Report |

### 📁 Files (12 records)
| Course | File Type | File Name | Original Name |
|--------|-----------|-----------|---------------|
| Web Development | Document | react_tutorial.pdf | React.js Complete Guide.pdf |
| Web Development | Video | react_basics.mp4 | React Basics Video Tutorial.mp4 |
| Web Development | Document | nodejs_guide.pdf | Node.js API Development Guide.pdf |
| Web Development | Practice | webdev_practice.zip | Web Development Practice Files.zip |
| Digital Marketing | Document | social_media_guide.pdf | Social Media Marketing Strategy.pdf |
| Digital Marketing | Video | social_media_tutorial.mp4 | Social Media Marketing Tutorial.mp4 |
| Digital Marketing | Document | seo_handbook.pdf | SEO Complete Handbook.pdf |
| Digital Marketing | Practice | marketing_templates.zip | Marketing Templates Collection.zip |
| Sales Techniques | Document | sales_techniques.pdf | Advanced Sales Techniques Manual.pdf |
| Sales Techniques | Video | sales_presentation.mp4 | Sales Presentation Skills.mp4 |
| Sales Techniques | Document | crm_strategy.pdf | CRM Strategy Guide.pdf |
| Sales Techniques | Practice | sales_resources.zip | Sales Resources & Templates.zip |

### 👥 Course Assignments (6 relationships)
| Learner | Course |
|---------|--------|
| John Smith | Advanced Web Development |
| Sarah Johnson | Advanced Web Development |
| Sarah Johnson | Digital Marketing Fundamentals |
| Michael Brown | Digital Marketing Fundamentals |
| Michael Brown | Sales Techniques & Customer Relations |
| John Smith | Sales Techniques & Customer Relations |

## 🗂️ File System Structure

```
backend/assets/
├── documents/
│   ├── react_tutorial.pdf
│   ├── react_basics.mp4
│   ├── nodejs_guide.pdf
│   ├── webdev_practice.zip
│   ├── social_media_guide.pdf
│   ├── social_media_tutorial.mp4
│   ├── seo_handbook.pdf
│   ├── marketing_templates.zip
│   ├── sales_techniques.pdf
│   ├── sales_presentation.mp4
│   ├── crm_strategy.pdf
│   └── sales_resources.zip
└── learners/
    ├── john-smith-profile.svg
    ├── sarah-johnson-profile.svg
    └── michael-brown-profile.svg
```

## 🎯 Course Details

### 1. Advanced Web Development
- **Department**: Engineering
- **Level**: Advanced
- **Duration**: 8 weeks
- **Overview**: Comprehensive course covering modern web development technologies including React, Node.js, and cloud deployment.
- **Learning Objectives**:
  - Master React.js fundamentals and advanced concepts
  - Build scalable backend APIs with Node.js
  - Implement cloud deployment strategies
  - Understand modern development workflows
- **Key Skills**: JavaScript/TypeScript, React.js, Node.js, Database Design, API Development

### 2. Digital Marketing Fundamentals
- **Department**: Marketing
- **Level**: Beginner
- **Duration**: 6 weeks
- **Overview**: Introduction to digital marketing strategies, tools, and best practices for modern businesses.
- **Learning Objectives**:
  - Understand digital marketing landscape
  - Master social media marketing
  - Learn SEO fundamentals
  - Create effective marketing campaigns
- **Key Skills**: Social Media Marketing, SEO/SEM, Content Marketing, Analytics, Campaign Management

### 3. Sales Techniques & Customer Relations
- **Department**: Sales
- **Level**: Intermediate
- **Duration**: 4 weeks
- **Overview**: Advanced sales techniques, customer relationship management, and negotiation skills for sales professionals.
- **Learning Objectives**:
  - Master advanced sales techniques
  - Build strong customer relationships
  - Develop negotiation skills
  - Understand customer psychology
- **Key Skills**: Sales Techniques, Customer Relations, Negotiation, Communication, Problem Solving

## 🛠️ Scripts Available

### 1. `seed-dummy-data.js`
- Seeds the database with dummy data
- Creates learners, courses, modules, files, and assignments
- Generates dummy files in the filesystem

### 2. `clear-and-seed.js`
- Clears all existing data
- Seeds fresh dummy data
- Useful for resetting the database

### 3. `create-dummy-images.js`
- Creates dummy profile images for learners
- Generates SVG-based placeholder images

## 🚀 Usage

### To seed fresh data:
```bash
node clear-and-seed.js
```

### To create profile images:
```bash
node create-dummy-images.js
```

### To seed data without clearing:
```bash
node seed-dummy-data.js
```

## 📝 Notes

- All files are dummy files with minimal content for testing
- PDF files contain basic PDF structure
- Video files contain MP4 headers only
- ZIP files contain basic ZIP structure
- Profile images are SVG-based placeholders
- All data is interconnected and ready for testing all features

## 🎯 Testing Scenarios

This dummy data supports testing of:
- ✅ Course listing and details
- ✅ Learner management
- ✅ File uploads and downloads
- ✅ Course assignments
- ✅ Module management
- ✅ Course editing and deletion
- ✅ Search and filtering
- ✅ Pagination
- ✅ File management
- ✅ Profile management
