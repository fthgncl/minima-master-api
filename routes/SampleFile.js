const express = require('express');
const router = express.Router();
const path = require('path');

router.post('/', (req, res) => {
    const filePath = path.join(__dirname, '..', 'files', 'TT And - Minima Master Format.xlsx');
    res.download(filePath, (err) => {
        if (err) {
            res.status(500).send('Dosya indirilemedi.');
        }
    });
});

module.exports = router;
