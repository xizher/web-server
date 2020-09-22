const express = require('express');
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../../model/resModel');
const { eval } = require('../..//utils/pgUtils');
const { numberPattern } = require('../../config/pattern');

router.post('/add', (req, res, next) => {
  (async () => {
    const { name, type, from, url } = req.body;
    if(!numberPattern.test(from)) {
      return Promise.reject('输入信息格式错误');
    }
    const result = await eval(`INSERT INTO tb_navigation (name, type, "FROM", url) VALUES ('${escape(name)}', '${escape(type)}', ${escape(from)}, '${escape(url)}');`);
    if(result.rowCount == 1) {
      return '提交成功'
    }else {
      return '网络异常';
    }
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)));
});

router.get('/list', (req, res, next) => {
  (async () => {
    const result = await eval(`SELECT id, name, url, type FROM tb_navigation WHERE status = 'v'`);
    return result.rows;
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)));
});

router.get('/list-all', (req, res, next) => {
  (async () => {
    const result = await eval(`
      SELECT
        tb_navigation.id id,
        tb_navigation.name,
        type,
        url,
        status,
        tb_navigation."FROM" from_id,
        tb_account.name from_name
          FROM tb_navigation
            INNER JOIN tb_account ON tb_navigation."FROM" = tb_account.id order by id desc;
    `);
    return result.rows;
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)));
});

router.post('/check', (req, res, next) => {
  (async () => {
    const { agree, id } = req.body;
    if(typeof agree != 'boolean' || !numberPattern.test(id)) {
      return Promise.reject('输入信息格式错误');
    }
    const result = await eval(`UPDATE tb_navigation SET status='${agree?'v':'x'}' WHERE id=${id}`);
    return '更新成功';
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)));
})

module.exports = router;