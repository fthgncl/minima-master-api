const express = require('express');
const router = express.Router();

const uploadFileRouter = require("../routes/uploadFile");
const createPhaseMagnitudeRouter = require("../routes/createPhaseMagnitudeDatas");
const calculateMinimumPointRouter = require("../routes/MinimumPointCalculateMethod");


router.use('/uploadFile', uploadFileRouter);
router.use('/create-phase-magnitude-data', createPhaseMagnitudeRouter);
router.use('/calculate-minimum-point', calculateMinimumPointRouter);

module.exports = router;