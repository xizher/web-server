const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.json(new WXZ.Model.Response.SuccessModel({
    t: 'result'
  }))
});

module.exports = router;
