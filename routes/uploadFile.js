const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

    res.status(200).json({
        message: 'bağlantı başarılı'
    });

});

module.exports = router;