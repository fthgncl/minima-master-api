const express = require('express');
const router = express.Router();

const uploadFileRouter = require("../routes/uploadFile");
const createPhaseMagnitudeRouter = require("../routes/createPhaseMagnitudeDatas");
const calculateMinimumPointRouter = require("../routes/MinimumPointCalculateMethod");
const CalculatePhasesRouter = require("../routes/CalculatePhases");
const SampleFileRouter = require("../routes/SampleFile");


router.use('/sample-file', SampleFileRouter);
router.use('/uploadFile', uploadFileRouter);
router.use('/create-phase-magnitude-data', createPhaseMagnitudeRouter);
router.use('/calculate-minimum-point', calculateMinimumPointRouter);
router.use('/calculate-phases', CalculatePhasesRouter);

module.exports = router;