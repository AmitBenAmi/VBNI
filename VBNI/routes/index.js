'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.sendfile('views/index.html')
});

router.get('/login', function (req, res) {
    res.sendfile('views/login.html')
});

module.exports = router;
