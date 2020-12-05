const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { ErrorModel } = require('./models/res.model')
const { pgSql, mongodbHelper } = require('./ext/nodejs')
const { pgConf, mongoConf } = require('./config/app.conf')

pgSql.setConfig(pgConf)
mongodbHelper.setConfig(mongoConf)

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', require('./routes/test'))
app.use('/api/account', require('./routes/api/account'))

app.use(function(req, res) {
  res.json(new ErrorModel('NOFOUND_ERROR', `【${req.url}】此地址无路由可访问`))
})

module.exports = app
