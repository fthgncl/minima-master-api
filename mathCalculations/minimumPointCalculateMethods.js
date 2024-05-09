

function parabolFitMethod(points) {

    return points.map(point => [point.x,point.y]);
}

function kweeVanWoerdenMethod(points) {
    console.log('KWEE FIT');
}

module.exports = { parabolFitMethod, kweeVanWoerdenMethod };
