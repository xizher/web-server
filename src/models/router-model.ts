import { NextFunction, Router, Request, Response } from 'express'
import { evalSql } from '../utils/pg-utils'
import { ErrorModel, SuccessModel } from './response-model'
import { ISqlInsertParams, ISqlSelectParams, ISqlUpdateParams, paraseInsertSql, parseSelectSql, parseUpdateSql } from './sql-model'

export interface IRouterModel {
  router: Router
}

export class RouterModel implements IRouterModel {
  
  public router: Router
  public baseTable: string
  public insertFields: string[] = []
  public updateFields: string[] = []

  constructor () {
    this.router = Router()
    this._initRouter()
  }

  public checkLegitimate (params: Request) :boolean {
    return true
  }

  private _initRouter () : void {
    
    this.router
    // 参数验证
    .use('/', (req, res, next) => {
      if (this.checkLegitimate(req)) {
        next()
      } else {
        res.json(new ErrorModel('error input'))
      }
    })
    // 查询
    .get('/', (req, res, next) => {
      this.query(req.query)
        .then(result => res.json(new SuccessModel(result)))
        .catch(err => res.json(new ErrorModel(err.message)))
    })
    // 增加
    .post('/', (req, res, next) => {
      this.insert(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch(err => res.json(new ErrorModel(err.message)))
    })
    // 更新
    .put('/', (req, res, next) => {
      this.update(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch(err => res.json(new ErrorModel(err.message)))
    })
    // 删除
    .delete('/', (req, res, next) => {
      this.delete(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch(err => res.json(new ErrorModel(err.message)))
    })
  }

  public async insert (params: any) : Promise<void> {
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
    await evalSql(sql)
  }

  public async delete ({ id }: { id: number }) {
    const sql = `DELETE FROM ${this.baseTable} WHERE id=${id}`
    await evalSql(sql)
  }

  public async update (params: any) {
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
    let sql = parseSelectSql(this.baseTable, params)
    const result = await evalSql(sql)
    let items = result.rows.map(item => {
      for (const key in item) {
        item[key] = typeof item[key] === 'string'
          ? item[key] = unescape(item[key])
          : item[key]
      }
      return item
    })
    items = this.parseQueryData(items)
    sql = `SELECT COUNT(id) FROM ${this.baseTable}`
    const { count } = (await evalSql(sql)).rows[0]
    return Promise.resolve({ items, total: Number(count) })
  }

  public parseQueryData (data: any): any {
    return data
  }

}