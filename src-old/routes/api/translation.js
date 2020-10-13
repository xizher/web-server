const express = require('express')
const router = express.Router()
const translate = require('google-translate-api')

const { SuccessModel, ErrorModel } = WXZ.Model.Response

//#region 逻辑代码

const t = async ({ text }) => {
  if (typeof text != 'string') {
    return Promise.reject('输入信息格式错误')
  }
  const en = (await translate(text, { to: 'en' })).text
  const cn = (await translate(text, { from: 'en', to: 'zh-cn' })).text
  return Promise.resolve({ en, cn })
}

//#endregion

router.get('/', (req, res, next) => {
  t(req.query)
    .then(result => res.json(new SuccessModel(result)))
    .catch(err => res.json(new ErrorModel(err)))
})

module.exports = router