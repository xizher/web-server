const express = require('express');
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../../model/resModel');
const { eval } = require('../..//utils/pgUtils');
const { numberPattern } = require('../../config/pattern');

router.post('/add', (req, res, next) => {
  const { title, desc, content, sides } = req.body;
  let sides_str = '{';
  for (let i = 0; i < sides.length; i++) {
    const item = sides[i];
    if(i == sides.length - 1) {
      sides_str = `${sides_str}"${item}"}`
    }else {
      sides_str = `${sides_str}"${item}",`
    }
  }
  eval(`INSERT INTO tb_blog (title, description, content, sides, create_time) VALUES ('${title}', '${desc}', '${escape(content)}', '${sides_str}', ${new Date().getTime()});`)
    .then(_ => res.json(new SuccessModel('博客更新成功')))
    .catch(err => {
      console.log(err);
      res.json(new ErrorModel('网络异常'));
    });
});

router.get('/list', (req, res, next) => {
  eval(`SELECT id, title, description, sides, create_time, modify_time, view_count, good_count FROM tb_blog;`)
    .then(result => res.json(new SuccessModel(result.rows)))
    .catch(err => {
      console.log(err);
      res.json(new ErrorModel('网络异常'));
    });
});

router.get('/get', (req, res, next) => {
  (async () => {
    const { id } = req.query;
    if(!numberPattern.test(id)) {
      return Promise.reject('输入信息格式错误')
    }
    const result = await eval(`SELECT content FROM tb_blog WHERE id = ${id};`);
    if(result.rowCount != 1) {
      return Promise.reject('博客内容获取失败');
    }
    return {
      id, content: unescape(result.rows[0].content)
    };
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)));
});

router.post('/viewed', (req, res, next) => {
  (async () => {
    const { id } = req.body;
    if(!numberPattern.test(id)) {
      return Promise.reject('输入信息格式错误')
    }
    const result = await eval(`UPDATE tb_blog SET view_count=view_count+1 WHERE id = ${id};`);
    return {
      id, result: result.rowCount == 1
    };
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)));
});

router.post('/good', (req, res, next) => {
  (async () => {
    const { id } = req.body;
    if(!numberPattern.test(id)) {
      return Promise.reject('输入信息格式错误')
    }
    const result = await eval(`UPDATE tb_blog SET good_count=good_count+1 WHERE id = ${id};`);
    return {
      id, result: result.rowCount == 1
    };
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)));
});

module.exports = router;