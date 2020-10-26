import { Router } from 'express'

export interface IRouterModel {
  router: Router
}
export type OrderType = 'DESC' | 'ASC'
export class Order {
  private _orderField: string
  private _orderType: OrderType
  constructor (field, type) {
    this._orderField = field
    this._orderType = type
  }
  public format () : string {
    return `${this._orderField} ${this._orderType}`
  }
}
export interface ISearchParams {
  limil: number
  offset: number
  sort: Array<Order>
}

export class RouterModel implements IRouterModel {
  
  public router: Router
  public baseTable: string

  constructor (baseTable: string) {
    this.router = Router()
    this.baseTable = baseTable
  }

  public async get () {

  }

}