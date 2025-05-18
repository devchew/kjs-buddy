// This file is executed during the build process
// It updates the version.json file with the current build time

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the version.json file path
const versionFilePath = path.resolve(__dirname, '../public/version.json');

// Read the current content
try {
  const versionFileContent = fs.readFileSync(versionFilePath, 'utf-8');
  
  // Parse the JSON
  const versionData = JSON.parse(versionFileContent);
  
  // Update the buildTime property with the current timestamp
  versionData.buildTime = new Date().toISOString();
  
  // Stringify the updated data with pretty formatting
  const updatedContent = JSON.stringify(versionData, null, 2);
  
  // Write the updated content back to the file
  fs.writeFileSync(versionFilePath, updatedContent, 'utf-8');
  
  console.log('Successfully updated version.json with build timestamp:', versionData.buildTime);
} catch (error) {
  console.error('Failed to update version.json:', error);
  process.exit(1);
}
