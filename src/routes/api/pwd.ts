import { Request } from "express";
import { ErrorType, WxzError } from "../../models/response-model";
import { RouterModel } from "../../models/router-model";

interface IPwdItem {
  name: string
  pwd: string
  bz: string
  id?: string | number
}

export class PwdRouter extends RouterModel {
 
  constructor () {
    super()
    this.baseTable = 'tb_pwd'
    this.insertFields = ['name', 'pwd', 'bz']
    this.updateFields = ['name', 'pwd', 'bz']
  }

  public beforeUpdate (data: any) : WxzError | true {
    const { pwd } = data
    if (pwd && (typeof pwd !== 'string' || pwd.length % 32 !== 0)) {
      return new WxzError(ErrorType.INPUT_ERROR, '口令编码格式错误')
    }
    return true
  }

  public beforeInsert (data: any) : WxzError | true {
    const { pwd } = data
    if (pwd && (typeof pwd !== 'string' || pwd.length % 32 !== 0)) {
      return new WxzError(ErrorType.INPUT_ERROR, '口令编码格式错误')
    }
    return true
  }

}