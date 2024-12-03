const express = require('express');
const router = express.Router();
const sketchController = require('../controllers/sketch');

router.post('/upload', sketchController.upload, sketchController.processSketch);

module.exports = router;