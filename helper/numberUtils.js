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

module.exports = {convertToNumber, convertArrayValuesToNumbers, isNumber};