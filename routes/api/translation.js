const express = require('express');
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../../model/resModel');
const translate = require('google-translate-api');


router.get('/', (req, res, next) => {
  (async () => {
    const { text } = req.query;
    if(typeof text != 'string') {
      return Promise.reject('输入信息格式错误');
    }
    const en = (await translate(text, { to: 'en' })).text;
    const cn = (await translate(text, { from: 'en', to: 'zh-cn' })).text;
    return { en, cn }
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)));
});

module.exports = router;