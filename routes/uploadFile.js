const express = require('express');
const router = express.Router();
const multer = require('multer');
const validateFile = require('../helper/validateFile');
const fs = require('node:fs')
const { v4: uuidv4 } = require('uuid');

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

        if (err instanceof multer.MulterError) {
            console.error('Dosya yükleme hatası:', err);
            return res.status(500).json({
                message: 'Dosya yüklenirken bir hata oluştu'
            });
        }

        if (err) {
            console.error('Beklenmeyen bir hata oluştu:', err);
            return res.status(500).json({
                message: 'Beklenmeyen bir hata oluştu'
            });
        }

        // Dosya yükleme işlemi başarılıysa, bu noktaya gelinir
        const file = req.file;
        res.status(200).json({
            ...validateFile(file)
        });

    });
});

module.exports = router;