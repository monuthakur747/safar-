#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Installing dependencies for Safar Travelling App...\n');

const dirs = [
  { name: 'Frontend', path: 'safar-travelling-app' },
  { name: 'Backend', path: 'safar-travelling-app/server' }
];

dirs.forEach(({ name, path: dirPath }) => {
  try {
    console.log(`\n📦 Installing ${name} packages in ${dirPath}...`);
    execSync('npm install', { 
      cwd: dirPath,
      stdio: 'inherit'
    });
    console.log(`✅ ${name} packages installed successfully!\n`);
  } catch (error) {
    console.error(`❌ Failed to install ${name} packages:`, error.message);
    process.exit(1);
  }
});

console.log('✨ All packages installed successfully!');
