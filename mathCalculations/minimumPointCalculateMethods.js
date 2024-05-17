let {Calc} = require('calc-js');

function initializeDataProcessing(period, dataSet, phaseRange,method){

    const result = [];
    const timeDifference = calculateTimeDifference(period, dataSet, phaseRange);
    const groupDataByPeriod = createGroupedDataByPeriod(dataSet,timeDifference);

    groupDataByPeriod.forEach( group => {

        const points = group.map( data => {
            return {
                x : data.time,
                y : data.magnitude
            }
        } );

        if ( method === 'parabola')
            result.push(parabolaFitMethod(points));

    })

    return result
}

// Minimum ve maksimum evre değerleri arasındaki zamansal farkı hesaplar
function calculateTimeDifference(period, dataSet, phaseRange) {
    const phaseOverFlow = phaseRange[1] >= 1;

    const closestLowPhase= findClosestPhase(dataSet, phaseRange[0], true);
    const closestHighPhase= findClosestPhase(dataSet, new Calc(phaseRange[1]).minus(phaseOverFlow?1:0).finish(), false);

    const phaseDifference = new Calc(closestHighPhase).sum(phaseOverFlow?1:0).minus(closestLowPhase).finish()
    return new Calc(period).multiply(phaseDifference).finish();
}

// Gözlem verileri farklı periyotları içerecek şekilde gruplandırılır
function createGroupedDataByPeriod(dataSet,timeDifference){
    const groups = [];
    let tempDataSet = [...dataSet];

    while (tempDataSet.length > 0) {
        let currentGroup = [];
        let baseTime = tempDataSet[0].time;
        currentGroup.push(tempDataSet[0]);


        for (let i = tempDataSet.length - 1; i >= 1; i--) {
            if (Math.abs(new Calc(baseTime).minus(tempDataSet[i].time).finish()) <= timeDifference) {
                currentGroup.push(tempDataSet[i]);
                tempDataSet.splice(i, 1);
            }
        }
        tempDataSet.shift();
        groups.push(currentGroup);
    }

    return groups;
}

function findClosestPhase(dataSet, targetPhase, isGreaterThan) {
    let closestPhaseIndex = -1;
    let closestPhaseDifference = Infinity;

    for (let i = 0; i < dataSet.length; i++) {
        const phaseDifference = Math.abs(new Calc(dataSet[i].phase).minus(targetPhase).finish());
        const condition = isGreaterThan ? dataSet[i].phase > targetPhase : dataSet[i].phase < targetPhase;

        if (condition && phaseDifference < closestPhaseDifference) {
            closestPhaseIndex = i;
            closestPhaseDifference = phaseDifference;
        }
    }

    return dataSet[closestPhaseIndex].phase;
}




function parabolaFitMethod(points) {

    let minXNorm = points[0].x;
    let maxX = points[0].x
    for (let i = 1; i < points.length; i++) {
        if (points[i].x < minXNorm) {
            minXNorm = points[i].x;
        }
        if (points[i].x > maxX) {
            maxX = points[i].x;
        }
    }

    let X = 0, Y = 0, XY = 0, X2 = 0, X2Y = 0, X3 = 0, X4 = 0, Y2 = 0;
    const N = points.length;
    points.forEach(point => {
        point.x -= minXNorm;
        X = new Calc(X).sum(point.x).finish();
        Y = new Calc(Y).sum(point.y).finish();
        XY = new Calc(XY).sum(new Calc(point.x).multiply(point.y).finish()).finish();
        X2 = new Calc(X2).sum(new Calc(point.x).multiply(point.x).finish()).finish();
        X2Y = new Calc(X2Y).sum(new Calc(point.x).multiply(point.x).multiply(point.y).finish()).finish();
        X3 = new Calc(X3).sum(new Calc(point.x).multiply(point.x).multiply(point.x).finish()).finish();
        X4 = new Calc(X4).sum(new Calc(point.x).multiply(point.x).multiply(point.x).multiply(point.x).finish()).finish();
        Y2 = new Calc(Y2).sum(new Calc(point.y).multiply(point.y).finish()).finish();
    });

    const division = new Calc(N).multiply(X4).minus(new Calc(X2).multiply(X2).finish()).multiply(new Calc(N).multiply(X2).minus(new Calc(X).multiply(X).finish()).finish()).minus(new Calc(N).multiply(X3).minus(new Calc(X2).multiply(X).finish()).multiply(new Calc(N).multiply(X3).minus(new Calc(X2).multiply(X).finish()).finish()).finish()).finish();
    const a = new Calc(new Calc(N).multiply(X2Y).minus(new Calc(X2).multiply(Y).finish()).multiply(new Calc(N).multiply(X2).minus(new Calc(X).multiply(X).finish()).finish()).minus(new Calc(N).multiply(XY).minus(new Calc(X).multiply(Y).finish()).multiply(new Calc(N).multiply(X3).minus(new Calc(X2).multiply(X).finish()).finish()).finish()).finish()).divide(division).finish();
    const b = new Calc(new Calc(N).multiply(XY).minus(new Calc(X).multiply(Y).finish()).multiply(new Calc(N).multiply(X4).minus(new Calc(X2).multiply(X2).finish()).finish()).minus(new Calc(N).multiply(X2Y).minus(new Calc(X2).multiply(Y).finish()).multiply(new Calc(N).multiply(X3).minus(new Calc(X2).multiply(X).finish()).finish()).finish()).finish()).divide(division).finish();
    const c = new Calc(Y).minus(new Calc(b).multiply(X).finish()).minus(new Calc(a).multiply(X2).finish()).divide(N).finish();

    let totalFunctionalDifferance = 0;
    points.forEach(point => {
        // fX = Ax² + Bx + C
        const fX = new Calc(a).multiply(Math.pow(point.x, 2)).sum(new Calc(b).multiply(point.x).finish()).sum(c).finish()
        totalFunctionalDifferance = new Calc(totalFunctionalDifferance).sum(Math.pow(new Calc(fX).minus(point.y).finish(), 2)).finish();
    });
    const rms = Math.sqrt(new Calc(totalFunctionalDifferance).divide(N).finish());
    let minimumTime = new Calc(-b).divide(2).divide(a).sum(minXNorm).finish();

    const isMinimumTimeTrueRange = minimumTime > minXNorm && minimumTime < maxX;

    if ( !minimumTime ){
        minimumTime = 0;
    }

    return { minXNorm, points, minimumTime, isMinimumTimeTrueRange, rms, pointCount:N };
}



function kweeVanWoerdenMethod(points){

    console.log('KWEE FIT');
}


module.exports = { initializeDataProcessing };
