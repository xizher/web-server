import { Request } from "express";
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

  
  public checkLegitimate ({ query, body, params, headers, method }: Request) : boolean {
    const { limit, offset, order } = query as any
    let {
      pwd, id
    } = body
    if (!id) {
      id = query.id
      if (id) {
        body.id = id
      }
    }
    const {} = params
    const {} = headers
    // 分页查询情况
    if (limit && offset && !(!isNaN(limit) && !isNaN(offset) && Number(limit) > -1 && Number(offset) > -1)) {
      return false
    }
    // 口令格式
    if (pwd && (typeof pwd !== 'string' || pwd.length % 32 !== 0)) {
      return false
    }
    // 标识符格式
    if (id && isNaN(id)) {
      return false
    }
    // 更新或删除操作没有传入id
    if (method.contain(['PUT', 'DELETE']) && !id) {
      return false
    }
    // 排序配置
    if (order && order.length > 0) {
      query.order = order.map(item => JSON.parse(item))
    } else {
      query.order = null
    }
    return true
  }

}