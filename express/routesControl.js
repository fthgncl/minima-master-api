const express = require('express');
const router = express.Router();

const uploadFileRouter = require("../routes/uploadFile");


router.use('/uploadFile', uploadFileRouter);

module.exports = router;