const magicBytes = require('magic-bytes.js')
const fs = require('node:fs')
const {uploadConfig} = require('../config.json');

function validateFile(file){
    return new Promise((resolve, reject) => {
        // file size control
        if ( !checkSize(file) ){
            return reject({
                status: false,
                message: 'File size exceeds the maximum allowed size'
            });
        }

        // extension control
        const matchedFileType = checkExtension(file)
        if ( !matchedFileType ){
            return reject({
                status: false,
                message: 'Unsupported file extension'
            });
        }

        // File type - Mime type control
        if(checkFileType(file,matchedFileType) ){
            return reject({
                status: false,
                message: 'The file type information did not match completely'
            });
        }

        resolve({
            status: true,
            message: 'The file is valid'
        });
    });
}

function checkSize(file){
    return (file.size <= 1024 * 1024 * uploadConfig.maxFileSizeMB);
}

function checkExtension(file){
    const fileExtension = file.originalname.split('.').pop();
    return uploadConfig.allowedFileTypes.find(fileType => fileType.extension === fileExtension);
}

function checkFileType(file,mustBeFileType){
    const fileData = fs.readFileSync(file.path);
    const fileInfo = magicBytes.filetypeinfo(fileData);
    const isCompleteMatch = fileInfo.some(info => {
        return (
            info.extension === mustBeFileType.extension &&
            info.typename === mustBeFileType.typename &&
            info.mime === mustBeFileType.mime
        );
    });
    return !isCompleteMatch;
}

module.exports = validateFile;