const express = require('express');
const router = express.Router();
const { SuccessModel, ErrorModel } = require('../../model/resModel');
const { eval } = require('../..//utils/pgUtils');
const { namePattern, pwdPattern, emailPattern } = require('../../config/pattern');

router.post('/add', (req, res, next) => {
  (async () => {
    const { name, pwd, email } = req.body;
    if(!namePattern.test(name) || !pwdPattern.test(pwd) || !emailPattern.test(email)) {
      return Promise.reject('输入信息格式错误');
    }
    const count = (await eval(`SELECT COUNT(name) FROM tb_account WHERE name = '${name}'`)).rows[0].count;
    if(count == 0) {
      const result = await eval(`INSERT INTO tb_account (name, pwd, create_time, email) VALUES ('${name}', '${pwd}', ${new Date().getTime()},'${email}')`);
      if(result.rowCount == 1) {
        return '注册成功'
      }else {
        console.log(result);
        return Promise.reject('网络异常');
      }
    }else{
      return Promise.reject('用户名已存在');
    }
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)))
});

router.get('/get', (req, res, next) => {
  (async () => {
    const { name, pwd } = req.query;
    if(!namePattern.test(name) || !pwdPattern.test(pwd)) {
      return Promise.reject('输入信息格式错误');
    }
    const result = await eval(`SELECT id, name, create_time, email, is_admin FROM tb_account WHERE name = '${name}' AND pwd = '${pwd}'`);
    if(result.rowCount == 0) {
      return Promise.reject('用户名不存在或密码错误');
    }
    let tb_account_info = result.rows[0];
    tb_account_info.create_time = parseInt(tb_account_info.create_time);
    return tb_account_info;
  })().then(result => res.json(new SuccessModel(result))).catch(err => res.json(new ErrorModel(err)))
})

module.exports = router;