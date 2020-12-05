class ResponseModel {

  constructor () {
    this.data = null
    this.code = ''
    this.err = false
    this.info = {
      msg: '',
      detial : ''
    }
  }

}

const erreyType = {
  INPUT_ERROR: '0x400,存在异常输入',
  LOGIN_FAIL: '0x400,用户名或密码错误',
  WRONG: '0x402,错误结果',
  AUTH_ERROR: '0x403,接口权限不足',
  NOFOUND_ERROR: '0x404,无响应',
  CONNECT_ERROR: '0x400,系统异常',
}

class SuccessModel extends ResponseModel {
  constructor (data, msg = '') {
    super()
    this.code = '0x200'
    this.data = data
    this.info.msg = msg
  }
}

class ErrorModel extends ResponseModel {
  constructor (err, detial = '') {
    super()
    this.err = true
    if (err instanceof Error) {
      this.info.msg = '系统异常'
      this.info.detial = err.message
      this.code = '0x000'
    } else {
      const [code, msg] = erreyType[err].split(',')
      this.info.msg = msg
      this.code = code
      this.info.detial = detial
    }
  }
}

module.exports = {
  SuccessModel, ErrorModel
}
