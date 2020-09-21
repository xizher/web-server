const express = require('express');
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel')

const Ajax = require('../exts/ajax/ajax')

router.get('/', function(req, res, next) {
  Ajax.get('https://cn.bing.com/search?q=axios').then(result => {
    res.json({
      t: result
    })
  })
});

module.exports = router;
