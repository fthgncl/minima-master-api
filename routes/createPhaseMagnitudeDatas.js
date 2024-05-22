const express = require('express');
const router = express.Router();
const { getLangDataOnRequest } = require("../helper/languageManager");
const fluxToMagnitude = require('../mathCalculations/fluxToMagnitude');
const calculatePhase = require('../mathCalculations/calculatePhase');
const {convertToNumber, convertArrayValuesToNumbers, isNumber} = require('../helper/numberUtils');

router.post('/', (req, res) => {
    const langData = getLangDataOnRequest(req);
    const data = convertDataToNumberObject(req.body);
    const errors = verifyData(data, langData);

    if ( errors.length === 0 ){ // No Error
        analyzeProcess(data)
    }

    if (errors.length > 0) {
        res.status(400).json({
            status: 'error',
            errors: errors
        });
        return;
    }
    res.status(200).json({
        status: 'success',
        message: langData.phaseBrightnessDataCreated,
        responseData: {
            magnitudeArray: data.magnitudeArray,
            phaseArray: data.phaseArray,
            timeArray: data.timeArray
        }
    });
});

function analyzeProcess(data){
    if ( data.magnitudeArray === undefined )
        calculateMagnitudes(data)

    calculatePhases(data);


}
function calculatePhases(data){
    data.phaseArray = [];
    for ( let i = 0 ; i < data.timeArray.length ; i++ ){
        const time = data.timeArray[i];
        data.phaseArray.push(calculatePhase(time,data.startTime,data.period))
    }
}
function calculateMagnitudes(data){
    data.magnitudeArray = data.fluxArray.map(flux => fluxToMagnitude(flux));
}





function verifyData(data, langData) {
    const errors = [];
    const { period, startTime, timeArray, magnitudeArray, fluxArray } = data;

    if (!isNumber(period))
        errors.push(langData.invalidPeriodInfo);
    else if ( period === 0 )
        errors.push(langData.periodCannotBeZero);

    if (!isNumber(startTime))
        errors.push(langData.invalidStartTimeInfo);

    if (timeArray === undefined)
        errors.push(langData.invalidTimeColumnInfo);

    if (timeArray === false)
        errors.push(langData.timeColumnValuesNumeric);

    if (magnitudeArray !== undefined && fluxArray !== undefined)
        errors.push(langData.brightnessLuminanceConflict);

    if (magnitudeArray === false)
        errors.push(langData.brightnessColumnValuesNumeric);

    if (fluxArray === false)
        errors.push(langData.luminanceColumnValuesNumeric);

    if (!!timeArray) {
        if (!!fluxArray && timeArray.length !== fluxArray.length)
            errors.push(langData.timeLuminanceCountMismatch);

        if (!!magnitudeArray && timeArray.length !== magnitudeArray.length)
            errors.push(langData.timeBrightnessCountMismatch);
    }

    return errors;
}

function convertDataToNumberObject(reqBody) {
    const { period, startTime, timeArray, magnitudeArray, fluxArray } = reqBody;
    return {
        period: convertToNumber(period),
        startTime: convertToNumber(startTime),
        timeArray: convertArrayValuesToNumbers(timeArray),
        magnitudeArray: convertArrayValuesToNumbers(magnitudeArray),
        fluxArray: convertArrayValuesToNumbers(fluxArray)
    }
}




module.exports = router;
