const express = require('express')
const router = express.Router()

const { namePattern, pwdPattern, emailPattern } = WXZ.Pattern
const { SuccessModel, ErrorModel } = WXZ.Model.Response
const { eval } = WXZ.SQL.PostgreSQL

//#region 逻辑代码
const addAccount = async ({ name, pwd, email }) => {
  if (!(namePattern.test(name) && pwdPattern.test(pwd) && emailPattern.test(email))) {
    return Promise.reject('输入信息格式错误')
  }
  let sql = `SELECT COUNT(name) FROM tb_account WHERE name = '${name}';`
  const count = (await eval(sql)).rows[0].count
  if (count != 0) {
    return Promise.reject('用户已存在')
  }
  sql = `INSERT INTO tb_account (name, pwd, create_time, email) 
    VALUES ('${name}', '${pwd}', ${new Date().getTime()},'${email}');`
  const result = await eval(sql)
  if (result.rowCount == 1) {
    return Promise.resolve({
      command: result.command,
      rowCount: result.rowCount,
    })
  }
  return Promise.reject(result)
}

const getAccount = async ({ name, pwd }) => {
  if (!(namePattern.test(name) && pwdPattern.test(pwd))) {
    return Promise.reject('输入信息格式错误');
  }
  const sql = `SELECT id, name, create_time, email, is_admin 
    FROM tb_account WHERE name = '${name}' AND pwd = '${pwd}';`
  const result = await eval(sql)
  if (result.rowCount == 0) {
    return Promise.reject('用户不存在或密码错误')
  }
  const info = result.rows[0]
  info.create_time = parseInt(info.create_time)
  return Promise.resolve(info)
}
//#endregion

router.post('/add', (req, res, next) => {
  addAccount(req.body)
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.get('/get', (req, res, next) => {
  getAccount(req.query)
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

module.exports = router