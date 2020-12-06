
const express = require('express')
const { pgSql, mongodbHelper } = require('../../ext/nodejs')
const { SuccessModel, ErrorModel } = require('../../models/res.model')
const { RegExpHelper, guid } = require('../../ext/js.utils')

const router = express.Router()

router
  .get('/', (req, res) => {
    const { username, password } = req.query
    if ((RegExpHelper.USERNAME(username) || RegExpHelper.EMAIL(username)) && password?.length % 32 === 0) {
      const sql = `
        SELECT username, oid, email, usertype FROM t_account
          WHERE password = '${password.toUpperCase()}' AND
                (username = '${username}' OR email = '${username}')
      `
      pgSql.exec(sql).then(result => {
        if (result.rowCount === 1) {
          const taken = guid()
          // res.json(new SuccessModel({ taken, ...result.rows[0] }))
          const { username, oid } = result.rows[0]
          mongodbHelper.useCollection('session').update({
            type: 'login',
            username,
          }, {
            oid,
            taken,
            exp: new Date().getTime() + 1000 * 60 * 5
          }).then(() => res.json(new SuccessModel({ taken, ...result.rows[0] })))
        } else {
          res.json(new ErrorModel('LOGIN_FAIL', `查询结果：【${result.rowCount}】`))
        }
      }).catch(err => {
        res.json(new ErrorModel('CONNECT_ERROR', err))
      })
    } else {
      res.json(new ErrorModel('INPUT_ERROR', `输入 → 账户:【${username}】；暗文【${password}】`))
    }
  })
  .get('/check', (req, res) => {
    const { taken, oid } = req.query
    mongodbHelper.useCollection('session').query({ taken, oid }).then(result => {
      const nowTime = new Date().getTime()
      const expTime = result?.[0]?.exp
      if (nowTime < expTime) {
        res.json(new SuccessModel(true))
        mongodbHelper.update({ type: 'login', taken, oid }, { exp: new Date().getTime() + 1000 * 60 * 30 })
      } else {
        res.json(new ErrorModel('WRONG', '登录过期'))
      }
    }).catch(err => {
      res.json(new ErrorModel('CONNECT_ERROR', err))
    })
  })

module.exports = router
