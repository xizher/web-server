import { NextFunction, Router, Request, Response } from 'express'
import { evalSql } from '../utils/pg-utils'
import { ISqlInsertParams, ISqlSelectParams, ISqlUpdateParams, paraseInsertSql, parseSelectSql, parseUpdateSql } from './sql-model'

export interface IRouterModel {
  router: Router
}

type ActionType = 'use' | 'get' | 'post' | 'put' | 'delete'

export class RouterModel implements IRouterModel {
  
  public router: Router
  public baseTable: string

  constructor () {
    this.router = Router()
  }

  public async add (params: ISqlInsertParams) : Promise<void> {
    const sql = paraseInsertSql(this.baseTable, params)
    await evalSql(sql)
  }

  public async del ({ id }: { id: number }) {
    const sql = `DELETE FROM tb_pwd WHERE id=${id}`
    await evalSql(sql)
  }

  public async update (params: ISqlUpdateParams) {
    const sql = parseUpdateSql(this.baseTable, params)
    await evalSql(sql)
  }

  public async query (params: ISqlSelectParams) : Promise<{ items: any[], total: number }> {
    let sql = parseSelectSql(this.baseTable, params)
    const result = await evalSql(sql)
    const items = result.rows.map(item => {
      for (const key in item) {
        item[key] = typeof item[key] === 'string'
          ? item[key] = unescape(item[key])
          : item[key]
      }
      return item
    })
    sql = `SELECT COUNT(id) FROM ${this.baseTable}`
    const { count } = (await evalSql(sql)).rows[0]
    return Promise.resolve({ items, total: Number(count) })
  }

}