const express = require('express');
const router = express.Router();


router.post('/', (req, res) => {
    const {period, startTime, timeArray, MagnitudeArray, FluxArray} = req.body;

    const data = convertDataToNumberObject(req.body);
    const errors = verifyData(data);

    if ( errors.length > 0 ){
        res.status(400).json({
            status:'error',
            errors:errors
        });
        return;
    }
    res.status(200).json({
        status:'succes'
    });

});
function verifyData(data){
    const errors = [];
    const {period, startTime, timeArray, MagnitudeArray, FluxArray} = data;

    if ( !isNumber(period) )
        errors.push('Periyot bilgisi eksik veya sayı formatında değil.');

    if ( !isNumber(startTime) )
        errors.push('Başlangıç zamanı bilgisi eksik veya sayı formatında değil.');

    if ( timeArray === undefined )
        errors.push('Zaman sütunu bilgisi eksik veya dizi formatında değil.');

    if ( timeArray === false )
        errors.push('Zaman sütunundaki tüm değerler sayı formatında olmalı.');

    if ( MagnitudeArray !== undefined && FluxArray !== undefined )
        errors.push('Parlaklık ve akı değerleri birlikte tanımlanamaz.');

    if ( MagnitudeArray === false )
        errors.push('Parlaklık sütunundaki tüm değerler sayı formatında olmalı.');

    if ( FluxArray === false )
        errors.push('Akı sütunundaki tüm değerler sayı formatında olmalı.');

    if ( !!timeArray ){
        if ( !!FluxArray && timeArray.length !== FluxArray.length )
            errors.push('Zaman ve akı veri adeti eşit değil.');

        if ( !!MagnitudeArray && timeArray.length !== MagnitudeArray.length )
            errors.push('Zaman ve parlalık veri adeti eşit değil.');
    }

    return errors;
}

function convertDataToNumberObject(reqBody){
    const {period, startTime, timeArray, MagnitudeArray, FluxArray} = reqBody;
    return {
        period : convertToNumber(period),
        startTime : convertToNumber(startTime),
        timeArray : convertArrayValuesToNumbers(timeArray),
        MagnitudeArray : convertArrayValuesToNumbers(MagnitudeArray),
        FluxArray : convertArrayValuesToNumbers(FluxArray)
    }
}

function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

function convertToNumber(input) {
    if (typeof input === 'number') {
        if (!isNaN(input)) {
            return input;
        } else {
            return null;
        }
    }

    // Input'u string olarak kabul et ve virgülleri noktaya çevir
    const formattedValue = String(input).replace(/,/g, '.');
    const numberValue = Number(formattedValue);

    if (!isNaN(numberValue) && formattedValue.trim() !== "") {
        return numberValue;
    } else {
        return null;
    }
}


function convertArrayValuesToNumbers(array) {
    if (!Array.isArray(array))
        return undefined;

    for (let i = 0; i < array.length; i++) {
        array[i] = convertToNumber(array[i]);
        if (array[i] === null)
            return false;
    }
    return array;
}

module.exports = router;