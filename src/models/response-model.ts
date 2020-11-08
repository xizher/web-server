interface IResponseModel {
  data : any
  infos : {
    msg?: string
    detial?: string
  }
  code : string
}

export enum ErrorType {
  INPUT_ERROR = '0x400,存在异常输入',
  AUTH_ERROR = '0x403,接口权限不足',
  NOFOUND_ERROR = '0x404,无资源地址',
}

export class WxzError {
  public code : string = '0x0'
  public message : string = ''
  public detail : string = ''
  constructor (errorType: ErrorType, detail: string = '') {
    const [code, msg] = errorType.split(',')
    this.message = msg
    this.code = code
    this.detail = detail
  }
}

export class ResponseModel implements IResponseModel {
  public code : string = ''
  public data : any = null
  public infos : {
    message?: string
    detial?: string
  } = {}

  constructor () {}
}

export class SuccessModel extends ResponseModel {

  constructor (data : any, message? : string) {
    super()
    this.data = data
    this.infos.message = message
    this.code = '0x200'
  }
}

export class ErrorModel extends ResponseModel {

  constructor (error: WxzError | ErrorType | Error) {
    super()
    if (error instanceof WxzError) {
      this.infos.message = error.message
      this.infos.detial = error.detail
      this.code = error.code
    } else if (error instanceof Error) {
      this.infos.message = '系统异常'
      this.infos.detial = error.message
      this.code = '0x000000'
    } else {
      const err = new WxzError(error)
      this.infos.message = err.message
      this.infos.detial = err.detail
      this.code = err.code
    }
  }
}
