const fs = require('fs');

function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true });
    }
}

module.exports = deleteFile;