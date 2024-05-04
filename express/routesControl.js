const express = require('express');
const router = express.Router();

const uploadFileRouter = require("../routes/uploadFile");
const createPhaseMagnitudeRouter = require("../routes/createPhaseMagnitudeDatas");


router.use('/uploadFile', uploadFileRouter);
router.use('/create-phase-magnitude-data', createPhaseMagnitudeRouter);

module.exports = router;