const express = require('express')
const router = express.Router()

const { numberPattern } = WXZ.Pattern
const { SuccessModel, ErrorModel } = WXZ.Model.Response
const { eval } = WXZ.SQL.PostgreSQL

//#region 逻辑代码

const addBlog = async ({ title, desc, content, sides }) => {
  let sides_str = '{'
  for (let i = 0; i < sides.length; i++) {
    sides_str = `${sides_str}"${sides[i]}"${i == sides.length - 1 ? '}' : ','}`
  }
  const sql = `INSERT INTO tb_blog (title, description, content, sides, create_time)
    VALUES ('${escape(title)}', '${escape(desc)}', '${escape(content)}', '${sides_str}', ${new Date().getTime()});`
  const result = await eval(sql)
  if (result.rowCount == 1) {
    return Promise.resolve({
      command: result.command,
      rowCount: result.rowCount,
    })
  }
  return Promise.reject(result)
}

const getBlogList = async () => {
  const sql = `SELECT id, title, description, sides, create_time, modify_time, view_count, good_count, visible
    FROM tb_blog ORDER BY create_time DESC;`
  const result = await eval(sql)
  console.log(result.rows)
  return Promise.resolve(result.rows.map(item => {
    item.create_time = Number(item.create_time)
    item.modify_time = item.modify_time ? Number(item.modify_time) : item.create_time
    return item
  }))
}

const getBlogById = async ({ id }) => {
  if (!numberPattern.test(id)) {
    return Promise.reject('输入信息格式错误')
  }
  const sql = `SELECT * FROM tb_blog WHERE id = ${id};`
  const result = await eval(sql)
  if (result.rowCount != 1) {
    return Promise.reject(result);
  }
  result.rows[0].title = unescape(result.rows[0].title)
  result.rows[0].content = unescape(result.rows[0].content)
  result.rows[0].description = unescape(result.rows[0].description)
  result.rows[0].create_time = Number(result.rows[0].create_time)
  result.rows[0].modify_time = result.rows[0].modify_time ? Number(result.rows[0].modify_time) : result.rows[0].create_time
  return Promise.resolve(result.rows[0])
}

const plueBlogInfo = async ({ id, type }) => {
  if (!numberPattern.test(id)) {
    return Promise.reject('输入信息格式错误')
  }
  const sql = `UPDATE tb_blog SET ${type}=${type}+1 WHERE id = ${id};`
  await eval(sql)
  return Promise.resolve('已更新')
}

const setVisible = async ({ visible, id }) => {
  if (typeof visible != 'boolean' || !numberPattern.test(id)) {
    return Promise.reject('输入信息格式错误')
  }
  const sql = `UPDATE tb_blog SET visible=${visible} WHERE id=${id};`
  await eval(sql)
  return Promise.resolve('更新成功')
}

//#endregion

router.post('/add', (req, res, next) => {
  addBlog(req.body)
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.get('/list', (req, res, next) => {
  getBlogList()
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.get('/get', (req, res, next) => {
  getBlogById(req.query)
    .then(plueBlogInfo({...req.query, type: 'view_count'}))
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.post('/viewed', (req, res, next) => {
  plueBlogInfo({ ...req.body, type: 'view_count' })
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.post('/good', (req, res, next) => {
  plueBlogInfo({ ...req.body, type: 'good_count' })
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.post('/set-visible', (req, res, next) => {
  setVisible(req.body)
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

module.exports = router