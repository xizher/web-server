import { NextFunction, Router, Request, Response } from 'express'
import { evalSql } from '../utils/pg-utils'
import { ErrorModel, ErrorType, SuccessModel, WxzError } from './response-model'
import { ISqlInsertParams, ISqlSelectParams, ISqlUpdateParams, paraseInsertSql, parseSelectSql, parseUpdateSql } from './sql-model'

export interface IRouterModel {
  router: Router
}

export class RouterModel implements IRouterModel {
  
  public router: Router
  public baseTable: string
  public insertFields: string[] = []
  public updateFields: string[] = []
  public selectFields: string = '*'

  constructor () {
    this.router = Router()
    this._initRouter()
  }

  private _initRouter () : void {
    
    this.router
    // 参数验证
    .use('/', (req, res, next) => {
      const result = this.beforeUse(req)
      if (result === true) { // only return true
        next()
      } else {
        res.json(new ErrorModel(result))
      }
    })
    // 查询
    .get('/', (req, res, next) => {
      this.query(req.query)
        .then(result => res.json(new SuccessModel(result)))
        .catch(err => res.json(new ErrorModel(err)))
    })
    // 增加
    .post('/', (req, res, next) => {
      this.insert(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch(err => res.json(new ErrorModel(err)))
    })
    // 更新
    .put('/', (req, res, next) => {
      this.update(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch(err => res.json(new ErrorModel(err)))
    })
    // 删除
    .delete('/', (req, res, next) => {
      this.delete({ ...req.body, ...req.query })
        .then(() => res.json(new SuccessModel(true)))
        .catch(err => res.json(new ErrorModel(err)))
    })
  }

  public async insert (params: any) : Promise<void> {
    const safety = this.beforeInsert(params)
    if (safety !== true) { // when is ErrorType
      return Promise.reject(safety)
    }
    const insertParams: ISqlInsertParams = {
      keys: [], values: []
    }
    for (const key in params) {
      if (key.contain(this.insertFields)) {
        insertParams.keys.push(key)
        insertParams.values.push(params[key])
      }
    }
    const sql = paraseInsertSql(this.baseTable, insertParams)
    console.log(sql)
    await evalSql(sql)
  }

  public async delete ({ id }: { id: number }) {
    const safety = this.beforeDelete(id)
    if (safety !== true) { // when is ErrorType
      return Promise.reject(safety)
    }
    if (isNaN(id)) {
      return Promise.reject(new WxzError(ErrorType.INPUT_ERROR, `非法的唯一标识符【${id}】`))
    }
    const sql = `DELETE FROM ${this.baseTable} WHERE id=${id}`
    await evalSql(sql)
  }

  public async update (params: any) {
    const safety = this.beforeUpdate(params)
    if (safety !== true) { // when is ErrorType
      Promise.reject(safety)
    }
    if (isNaN(params.id)) {
      return new WxzError(ErrorType.INPUT_ERROR, `非法的唯一标识符【${params.id}】`)
    }
    const updateParams: ISqlUpdateParams = {
      keys: [], values: [], id: params.id
    }
    for (const key in params) {
      if (key.contain(this.updateFields)) {
        updateParams.keys.push(key)
        updateParams.values.push(params[key])
      }
    }
    const sql = parseUpdateSql(this.baseTable, updateParams)
    await evalSql(sql)
  }

  public async query (params: ISqlSelectParams) : Promise<{ items: any[], total: number }> {
    const safety = this.beforeQuery(params)
    if (safety !== true) { // when is ErrorType
      Promise.reject(safety)
    }
    const { limit, offset, order } = params
    // 排序配置
    if (order && order.length > 0) {
      params.order = order.map(item => JSON.parse(item as any))
    } else {
      params.order = null
    }
    if (limit && offset && !(!isNaN(limit) && !isNaN(offset) && Number(limit) > -1 && Number(offset) > -1)) {
      return Promise.reject(new WxzError(ErrorType.INPUT_ERROR, `非法`))
    }
    let sql = parseSelectSql(this.baseTable, params, this.selectFields)
    const result = await evalSql(sql)
    let items = result.rows.map(item => {
      for (const key in item) {
        item[key] = typeof item[key] === 'string'
          ? item[key] = unescape(item[key])
          : item[key]
      }
      return item
    })
    sql = `SELECT COUNT(id) FROM ${this.baseTable}`
    const { count } = (await evalSql(sql)).rows[0]
    this.afterQuery(items)
    return Promise.resolve({ items, total: Number(count) })
  }

  public beforeUse (params: Request) : true | Error | ErrorType | WxzError {
    return true
  }
  public beforeInsert (data: any) : WxzError | true { return true }
  public beforeDelete (id: any) : WxzError | true { return true }
  public beforeUpdate (data: any) : WxzError | true { return true }
  public beforeQuery (data: any) : WxzError | true { return true }

  
  // public afterInsert (data: any) : void {}
  // public afterDelete (data: any) : void {}
  // public afterUpdate (data: any) : void {}
  public afterQuery (data: any): void {}

}