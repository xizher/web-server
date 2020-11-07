/**
 * Order排序类型
 * @member DESC 降序
 * @member ASC 升序
 */
export type SqlOrderType = 'DESC' | 'ASC'
/**
 * Where过滤操作符
 * @member = 相等
 * @member LIKE 相似
 */
export type SqlOperator = '=' | 'LIKE'

/**
 * Order排序项
 * @member field 排序字段
 * @member type 排序方式
 */
export interface ISqlOrderItem {
  field: string
  type: SqlOrderType
}
/**
 * Where过滤项
 * @member field 过滤字段
 * @member operator 过滤操作符
 * @member value 过滤值
 */
export interface ISqlWhereItem {
  field: string
  operator: SqlOperator
  value: any
}

export interface ISqlSelectParams {
  limit?: number
  offset?: number
  order?: ISqlOrderItem[]
  where?: ISqlWhereItem[][]
}

export interface ISqlInsertParams {
  keys: string[]
  values: any[]
}

export interface ISqlUpdateParams extends ISqlInsertParams {
  id: number
}

export class SqlOrder {
  private _order: ISqlOrderItem[]
  constructor (order: ISqlOrderItem[]) {
    this._order = order
  }
  public format () : string {
    return this._order.map(item => `${item.field} ${item.type}`).join(',')
  }
}

export class SqlWhere {
  private _where: ISqlWhereItem[][]
  constructor (where: ISqlWhereItem[][]) {
    this._where = where
  }
  public format () : string {
    const whereStrArr = []
    for (let i = 0; i < this._where.length; i++) {
      const elem = this._where[i];
      whereStrArr.push(`(${elem.map(item => `${item.field} ${item.operator} ${typeof item.value === 'string' ? `'${item.operator === 'LIKE' ? `%${item.value}%` : item.value}'` : item.value}`).join(' OR ')})`)
    }
    return whereStrArr.join(' AND ')
  }
}

export function parseSelectSql (table: string, selectParams: ISqlSelectParams) : string {
  const { limit, offset, order, where } = selectParams
  return `SELECT * FROM ${table}
    ${ where && `WHERE ${new SqlWhere(where).format()}` || ''}
    ${ order && order.length > 0 && `ORDER BY ${new SqlOrder(order).format()}` || ''}
    ${ limit != null && offset != null && `LIMIT ${limit} OFFSET ${offset}` || ''}
  `
}

export function paraseInsertSql (table: string, insertParams: ISqlInsertParams) : string {
  const { keys, values } = insertParams
  for (let i = 0; i < values.length; i++) {
    values[i] = typeof values[i] === 'string'
      ? `'${values[i].indexOf('text[]') === 0 ? values[i].substring(6, values[i].length) : escape(values[i])}'`
      : values[i]
  }
  return `INSERT INTO ${table} (${keys.join(',')}) VALUES (${values.join(',')})`
}

export function parseUpdateSql (table: string, updateParams: ISqlUpdateParams) : string {
  const { keys, values, id } = updateParams
  let sql = `UPDATE ${table} SET`
  const updates = []
  for (let i = 0; i < values.length; i++) {
    updates.push(`${keys[i]}=${typeof values[i] === 'string' ? `'${values[i].indexOf('text[]') === 0 ? values[i].substring(6, values[i].length) : escape(values[i])}'` : values[i]}`)
  }
  return `${sql} ${updates.join(',')} WHERE id=${id}`
}

