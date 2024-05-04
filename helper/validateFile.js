const magicBytes = require('magic-bytes.js')
const fs = require('node:fs')
const {uploadConfig} = require('../config.json');
const {getLangData} = require('../helper/languageManager');

function validateFile(file,langData){

    return new Promise((resolve, reject) => {
        // file size control
        if ( !checkSize(file) ){
            return reject({
                status: false,
                message: langData.sizeExceedsMax
            });
        }

        // extension control
        const matchedFileType = checkExtension(file)
        if ( !matchedFileType ){
            return reject({
                status: false,
                message: langData.unsupportedExtension
            });
        }

        // File type - Mime type control
        if(checkFileType(file,matchedFileType) ){
            return reject({
                status: false,
                message: langData.typeMismatch
            });
        }

        resolve({
            status: true,
            message: langData.validFile
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