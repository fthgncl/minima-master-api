const express = require('express');
const router = express.Router();
const {getLangDataOnRequest} = require("../helper/languageManager");
const {convertToNumber, convertArrayValuesToNumbers, isNumber} = require('../helper/numberUtils');
const calculatePhase = require('../mathCalculations/calculatePhase');

router.post('/', (req, res) => {

    const langData = getLangDataOnRequest(req);

    const timeArray = convertArrayValuesToNumbers(req.body.timeArray);
    const period = convertToNumber(req.body.period);
    const startTime = convertToNumber(req.body.startTime);

    const errors = verifyData({ timeArray, period, startTime },langData);

    if (errors.length > 0) {
        res.status(400).json({
            status: 'error',
            errors: errors
        });
        return;
    }


    return res.status(200).json({
        status : 'success',
        phases : timeArray.map(time => calculatePhase(time,startTime,period) )
    });

});

function verifyData(data, langData) {
    const errors = [];
    const { period, startTime, timeArray } = data;

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

    return errors;
}

module.exports = router;
