var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel')

// const moment = require('moment');
const pgUtils = require('../utils/pgUtils')

router.get('/', function(req, res, next) {
  pgUtils.query('SELECT name, ST_AsText(geom) FROM geometries;').then(result => {
    res.json(new SuccessModel(result));
  }).catch(err => {
    res.json(new ErrorModel(err));
  });
});

module.exports = router;
