const path = require('path');
const fs = require('fs');

const createDummyImages = () => {
  console.log('🖼️ Creating dummy profile images...');
  
  const imagesDir = path.join(__dirname, 'assets/learners');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Create a simple SVG-based dummy image
  const createDummySVG = (name, initials) => {
    return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#8B5CF6"/>
      <circle cx="100" cy="80" r="40" fill="#FFFFFF" opacity="0.2"/>
      <text x="100" y="120" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#FFFFFF">${initials}</text>
      <text x="100" y="150" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#FFFFFF" opacity="0.8">${name}</text>
    </svg>`;
  };

  const learners = [
    { name: 'John Smith', initials: 'JS', filename: 'john-smith-profile.png' },
    { name: 'Sarah Johnson', initials: 'SJ', filename: 'sarah-johnson-profile.png' },
    { name: 'Michael Brown', initials: 'MB', filename: 'michael-brown-profile.png' }
  ];

  learners.forEach(learner => {
    const svgContent = createDummySVG(learner.name, learner.initials);
    const filePath = path.join(imagesDir, learner.filename);
    
    // For simplicity, we'll save as SVG instead of PNG
    const svgFilePath = filePath.replace('.png', '.svg');
    fs.writeFileSync(svgFilePath, svgContent);
    console.log(`✅ Created profile image: ${learner.filename.replace('.png', '.svg')}`);
  });

  console.log('🎨 Dummy profile images created successfully!');
};

// Run the function
if (require.main === module) {
  createDummyImages();
}

module.exports = { createDummyImages };
