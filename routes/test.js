const express = require('express')
const { SuccessModel } = require('../models/res.model')
const router = express.Router()

router.get('/', function(req, res) {
  res.json(new SuccessModel({
    ok: 'ok'
  }))
})

module.exports = router
