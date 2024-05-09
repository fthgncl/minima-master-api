const express = require('express');
const router = express.Router();
const { getLangDataOnRequest } = require("../helper/languageManager");
const { parabolFitMethod } = require('../mathCalculations/minimumPointCalculateMethods');

router.post('/', (req, res) => {

    const langData = getLangDataOnRequest(req);
    const { method, points } = req.body;

    if (!method || !points){
        return res.status(400).json({
            status: 'error',
            message: langData.methodAndPointsRequired
        });
    }

    if ( method === 'parabol' )
        return res.status(200).json({
            status: 'success',
            test: parabolFitMethod(points)
        });




    res.status(200).json({
        status: 'success'
    });
});

module.exports = router;
