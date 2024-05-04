const express = require('express');
const router = express.Router();
const {getLangDataOnRequest} = require('../helper/languageManager');

router.all('*', (req, res) => {
    const langData = getLangDataOnRequest(req);
    res.status(404).send(langData.notFound);
});

module.exports = router;
