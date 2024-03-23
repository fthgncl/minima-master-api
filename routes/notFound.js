const express = require('express');
const router = express.Router();

router.all('*', async (req, res) => {
    res.status(404).send('Not Found');
});

module.exports = router;