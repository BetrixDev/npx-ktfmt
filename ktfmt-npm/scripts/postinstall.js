#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

// Extract ktfmt version from package version
// Package version format: 0.56.0 -> ktfmt version: 0.56
const versionParts = version.split('.');
const ktfmtVersion = versionParts[0] + '.' + versionParts[1];

// Correct Maven Central URL for ktfmt
const jarUrl = `https://repo1.maven.org/maven2/com/facebook/ktfmt/${ktfmtVersion}/ktfmt-${ktfmtVersion}-with-dependencies.jar`;
const jarPath = path.join(__dirname, '..', 'ktfmt.jar');

// Check if jar already exists
if (fs.existsSync(jarPath)) {
  const stats = fs.statSync(jarPath);
  if (stats.size > 0) {
    console.log(`ktfmt ${ktfmtVersion} already downloaded (${(stats.size / 1024 / 1024).toFixed(1)}MB).`);
    process.exit(0);
  } else {
    // Remove empty file
    fs.unlinkSync(jarPath);
  }
}

console.log(`Downloading ktfmt ${ktfmtVersion}...`);
console.log(`From: ${jarUrl}`);

// Function to download file
function downloadFile(url, dest, callback) {
  const file = fs.createWriteStream(dest);
  let downloadedSize = 0;
  
  const request = https.get(url, (response) => {
    // Handle redirects
    if (response.statusCode === 301 || response.statusCode === 302) {
      file.close();
      fs.unlinkSync(dest);
      downloadFile(response.headers.location, dest, callback);
      return;
    }
    
    // Check for successful response
    if (response.statusCode !== 200) {
      file.close();
      fs.unlinkSync(dest);
      callback(new Error(`Failed to download: HTTP ${response.statusCode}`));
      return;
    }
    
    const totalSize = parseInt(response.headers['content-length'], 10);
    
    response.on('data', (chunk) => {
      downloadedSize += chunk.length;
      if (totalSize) {
        const percentage = ((downloadedSize / totalSize) * 100).toFixed(1);
        const downloadedMB = (downloadedSize / 1024 / 1024).toFixed(1);
        const totalMB = (totalSize / 1024 / 1024).toFixed(1);
        process.stdout.write(`\rDownloading... ${percentage}% (${downloadedMB}MB / ${totalMB}MB)`);
      }
    });
    
    response.pipe(file);
    
    file.on('finish', () => {
      file.close(() => {
        console.log('\nDownload complete!');
        
        // Verify file size
        const stats = fs.statSync(dest);
        if (stats.size === 0) {
          fs.unlinkSync(dest);
          callback(new Error('Downloaded file is empty'));
          return;
        }
        
        console.log(`ktfmt ${ktfmtVersion} installed successfully!`);
        callback(null);
      });
    });
  });
  
  request.on('error', (err) => {
    file.close();
    fs.unlinkSync(dest);
    callback(err);
  });
  
  file.on('error', (err) => {
    file.close();
    fs.unlinkSync(dest);
    callback(err);
  });
}

// Start download
downloadFile(jarUrl, jarPath, (err) => {
  if (err) {
    console.error('\nError downloading ktfmt:', err.message);
    console.error('Please check your internet connection and try again.');
    process.exit(1);
  }
});