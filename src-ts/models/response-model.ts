interface IResponseModel {
  data : any
  msg : string
  code : number
}

export class SuccessModel implements IResponseModel {
  
  public code : number = 0
  public data : any
  public msg : string

  constructor (data : any, msg : string = '') {
    this.data = data
    this.msg = msg
  }
}

export class ErrorModel implements IResponseModel {

  public code : number = -1
  public data : any = null
  public msg : string

  constructor (msg : string) {
    this.msg = msg
  }
}
