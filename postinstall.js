const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Initializing Tailwind CSS...');

try {
  // Check if tailwind.config.js exists
  if (!fs.existsSync('tailwind.config.js')) {
    console.log('Creating tailwind.config.js...');
    execSync('npx tailwindcss init', { stdio: 'inherit' });
  }

  // Check if src/index.css exists and contains Tailwind directives
  const cssPath = path.join('src', 'index.css');
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    if (!cssContent.includes('@tailwind')) {
      console.log('Adding Tailwind directives to src/index.css...');
      const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;

`;
      fs.writeFileSync(cssPath, tailwindDirectives + cssContent);
    }
  }

  console.log('✅ Tailwind CSS initialized successfully!');
} catch (error) {
  console.error('❌ Error initializing Tailwind CSS:', error.message);
  process.exit(1);
}
