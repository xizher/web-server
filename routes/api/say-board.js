const express = require('express');
const router = express.Router();

const { SuccessModel, ErrorModel } = WXZ.Model.Response
const { numberPattern } = WXZ.Pattern
const { eval } = WXZ.SQL.PostgreSQL

//#region 逻辑代码

const addChat = async ({ toc, from_id, content }) => {
  if (!numberPattern.test(from_id)) {
    return Promise.reject('输入信息格式错误')
  }
  const sql = `INSERT INTO tb_sayboard (toc, from_id, content, create_time)
    VALUES ('${toc}', ${from_id}, '${escape(content)}', ${new Date().getTime()});`
  const result = await eval(sql)
  if (result.rowCount == 1) {
    return Promise.resolve({
      command: result.command,
      rowCount: result.rowCount,
    })
  }
  return Promise.reject(result)
}

const listChat = async () => {
  const data = []
  const sql = `SELECT tb_sayboard.id, from_id, tb_account.name from_name, toc, content, tb_sayboard.create_time
    FROM tb_sayboard 
    INNER JOIN tb_account ON tb_sayboard.from_id = tb_account.id 
    ORDER BY tb_sayboard.create_time;`
  const { rows } = await eval(sql)
  rows.forEach(item => {
    const ids = item.toc.split('-')
    const func = (parent, id_list) => {
      if (id_list.length == 1) {
        const result = { ...item, children: [], show_children: false, reply_txt: '' }
        result.content = unescape(result.content)
        parent.push(result)
        parent.sort(((obj1, obj2) => parseInt(obj2.create_time) - parseInt(obj1.create_time)))
        return
      }
      const id = id_list[0]
      id_list.shift()
      func(parent.filter(elem => id == elem.toc.split('-')[elem.toc.split('-').length-1])[0].children, id_list)
    }
    func(data, ids)
  })
  return Promise.resolve(data)
}

//#endregion

router.post('/add', (req, res, next) => {
  addChat(req.body)
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

router.get('/list', (req, res, next) => {
  listChat()
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

module.exports = router
