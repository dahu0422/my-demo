const path = require('path');

module.exports = {
  server: {
    port: 3000
  },
  upload: {
    dir: path.join(__dirname, '../../uploads'),
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4'
    ]
  }
}; 