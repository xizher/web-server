import { Request } from "express";
import { RouterModel } from "../../models/router-model";

export class MoneyRouter extends RouterModel {
 
  constructor () {
    super()
    this.baseTable = 'tb_money'
    this.insertFields = ['value', 'type', 'time', 'lonlat', 'remark']
    this.updateFields = ['value', 'type', 'time', 'lonlat', 'remark']
  }

  
  public checkLegitimate ({ query, body, params, headers, method }: Request) : boolean {
    const { limit, offset } = query as any
    let {
      id, value, time
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
    // 标识符格式
    if (id && isNaN(id)) {
      return false
    }
    // 标识符格式
    if (value && isNaN(value)) {
      return false
    }
    // 标识符格式
    if (time && isNaN(time)) {
      return false
    }
    // 更新或删除操作没有传入id
    if (method.contain(['PUT', 'DELETE']) && !id) {
      return false
    }
    return true
  }

}