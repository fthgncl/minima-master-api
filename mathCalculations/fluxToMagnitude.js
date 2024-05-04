let {Calc} = require('calc-js');

function fluxToMagnitude(flux) { // Mag = -2.5 * log10(Flux)
    return new Calc(Math.log10(flux)).multiply(-2.5).finish();
}

module.exports = fluxToMagnitude;