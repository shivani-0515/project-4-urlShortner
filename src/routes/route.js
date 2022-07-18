
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController')
const urlModel = require('../models/urlModel.js')


router.post('/url/shorten',urlController.urlShortner)
router.get('/url/:urlCode',urlController.getUrl)

module.exports = router;