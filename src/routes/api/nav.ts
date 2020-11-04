import { Response, Router, Request } from "express";
import { IRouterClass } from "..";
import { ErrorModel, SuccessModel } from "../../models/response-model";
import { RouterModel } from "../../models/router-model";
import { evalSql } from "../../utils/pg-utils";
import { numberRegExp, unsignedIntegerRegExp } from "../../utils/reg-exp";

export class NavRouter extends RouterModel {

  public router: Router;

  constructor () {
    super()
    this.baseTable = 'tb_nav'
    this.insertFields = ['name', 'type', 'url']
    this.updateFields = ['name', 'type', 'url', 'visible']
  }

  public checkLegitimate ({ query, body, params, headers, method }: Request) : boolean {
    
    const { limit, offset, visible } = query as any
    let {
      id
    } = body
    if (!id) {
      id = query.id
      if (id) {
        body.id = id
      }
    }
    const {} = params
    const {} = headers
    if (visible && typeof visible !== 'boolean') {
      return false
    }
    // 分页查询情况
    if (limit && offset && !(!isNaN(limit) && !isNaN(offset) && Number(limit) > -1 && Number(offset) > -1)) {
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
    return true
  }
}