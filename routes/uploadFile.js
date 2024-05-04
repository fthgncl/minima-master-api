const express = require('express');
const router = express.Router();
const multer = require('multer');
const validateFile = require('../helper/validateFile');
const readExcelFile = require('../helper/readExcelFile');
const fs = require('node:fs')
const { v4: uuidv4 } = require('uuid');
const {getLangDataOnRequest} = require('../helper/languageManager');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        cb(null, `${uuidv4()}.${ext}`);
    }
});

// Multer middleware
const upload = multer({storage: storage});

router.post('/', (req, res) => {
    upload.single('file')(req, res, async (err) =>{
        const langData = getLangDataOnRequest(req);

        if (err instanceof multer.MulterError) {
            console.error(langData.fileUploadError, err);
            return res.status(500).json({
                message: langData.fileUploadError
            });
        }

        if (err) {
            console.error(langData.unexpectedError, err);
            return res.status(500).json({
                message: langData.unexpectedError
            });
        }

        // Dosya yükleme işlemi başarılıysa, bu noktaya gelinir
        const file = req.file;

        await validateFile(file,langData)
            // .then(result => res.status(200).json(result) ) TODO: Bu yapıyı kontrol et
            .catch(error => res.status(200).json(error) )

        readExcelFile(file.path,langData)
            .then(result => res.status(200).json(result) )
            .catch(error => res.status(200).json(error) )


    });
});

module.exports = router;