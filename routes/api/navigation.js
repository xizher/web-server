const express = require('express')
const router = express.Router()

const { numberPattern } = WXZ.Pattern
const { SuccessModel, ErrorModel } = WXZ.Model.Response
const { eval } = WXZ.SQL.PostgreSQL

//#region 逻辑代码

const addNav = async ({ name, type, from, url }) => {
  if (!numberPattern.test(from)) {
    return Promise.reject('输入信息格式错误')
  }
  const sql = `INSERT INTO tb_navigation (name, type, "FROM", url) 
    VALUES ('${escape(name)}', '${escape(type)}', ${escape(from)}, '${escape(url)}');`
  const result = await eval(sql)
  if (result.rowCount == 1) {
    return Promise.resolve({
      command: result.command,
      rowCount: result.rowCount,
    })
  }
  return Promise.reject(result)
}

const showNavList = async (isAll = true) => {
  const sql = isAll ? 
    `SELECT tb_navigation.id id, tb_navigation.name, type, url, status, tb_navigation."FROM" from_id, tb_account.name from_name
          FROM tb_navigation
            INNER JOIN tb_account ON tb_navigation."FROM" = tb_account.id order by id desc;` :
    `SELECT id, name, url, type FROM tb_navigation WHERE status = 'v';`
  const result = await eval(sql)
  return result.rows
}

const checkNav = async ({agree, id}) => {
  if (typeof agree != 'boolean' || !numberPattern.test(id)) {
    return Promise.reject('输入信息格式错误')
  }
  const sql = `UPDATE tb_navigation SET status='${agree?'v':'x'}' WHERE id=${id};`
  await eval(sql)
  return Promise.resolve('更新成功')
}

//#endregion

router.post('/add', (req, res, next) => {
  addNav(req.body)
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.get('/list', (req, res, next) => {
  showNavList(false)
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.get('/list-all', (req, res, next) => {
  showNavList()
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.post('/check', (req, res, next) => {
  checkNav(req.body)
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

module.exports = router