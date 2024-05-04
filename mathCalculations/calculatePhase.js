let {Calc} = require('calc-js');

function calculatePhase(time,startTime,period) { // EPOCH = ( time - startTime ) / period
    const timeDifferance = new Calc(time).minus(startTime).finish();
    const epoch = new Calc(timeDifferance).divide(period).finish();
    const result = "0." + epoch.toString().split('.')[1];
    return parseFloat(result);
}

module.exports = calculatePhase;