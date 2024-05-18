const express = require('express');
const router = express.Router();

const uploadFileRouter = require("../routes/uploadFile");
const createPhaseMagnitudeRouter = require("../routes/createPhaseMagnitudeDatas");
const calculateMinimumPointRouter = require("../routes/MinimumPointCalculateMethod");
const SampleFile = require("../routes/SampleFile");


router.use('/uploadFile', uploadFileRouter);
router.use('/create-phase-magnitude-data', createPhaseMagnitudeRouter);
router.use('/calculate-minimum-point', calculateMinimumPointRouter);
router.use('/sample-file', SampleFile);

module.exports = router;