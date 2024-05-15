const express = require('express');
const router = express.Router();
const { getLangDataOnRequest } = require("../helper/languageManager");
const { initializeDataProcessing } = require('../mathCalculations/minimumPointCalculateMethods');

router.post('/', (req, res) => {

    const langData = getLangDataOnRequest(req);
    const { method, period, dataSet, phaseRange } = req.body;


    if (!method || !period || !dataSet || !phaseRange){
        return res.status(400).json({
            status: 'error',
            message: langData.missingParamsError,
        });
    }

    if (isNaN(period)) {
        return res.status(400).json({
            status: 'error',
            message: langData.invalidPeriodFormatError,
        });
    }

    if (!Array.isArray(phaseRange) || phaseRange.length !== 2 || typeof phaseRange[0] !== 'number' || typeof phaseRange[1] !== 'number') {
        return res.status(400).json({
            status: 'error',
            message: langData.invalidPhaseRangeFormatError
        });
    }


    const periodAsNumber = parseFloat(period);

    if (periodAsNumber <= 0) {
        return res.status(400).json({
            status: 'error',
            message: langData.invalidPeriodValueError,
        });
    }


    const dataFormat = checkDataFormat(dataSet,langData);
    if (dataFormat.status !== 'success')
        return res.status(400).json(dataFormat);

    if ( method !== 'parabola' )
        return res.status(400).json({
            status: 'error',
            message: langData.invalidMethodError
        });

    return res.status(200).json({
            status : 'success',
            method,
            data : initializeDataProcessing(periodAsNumber,dataSet,phaseRange,method),
            message: langData.minimumTimeCalculationCompleted
    });

});

function checkDataFormat(dataSet,langData) {

    if (!Array.isArray(dataSet)) {
        return {
            status : 'error',
            message : langData.dataSetNotArrayError
        };
    }

    for (let i = 0; i < dataSet.length; i++) {
        if (typeof dataSet[i] !== 'object' || !('time' in dataSet[i]) || !('magnitude' in dataSet[i]) || !('phase' in dataSet[i])) {
            return {
                status : 'error',
                message : langData.invalidDataSetFormatError
            };
        }
    }

    return {
        status : 'success'
    };
}

module.exports = router;
