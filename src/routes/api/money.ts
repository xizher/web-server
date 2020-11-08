import { Request } from "express";
import { RouterModel } from "../../models/router-model";

export class MoneyRouter extends RouterModel {
 
  constructor () {
    super()
    this.baseTable = 'tb_money'
    this.insertFields = ['value', 'type', 'time', 'lonlat', 'remark']
    this.updateFields = ['value', 'type', 'time', 'lonlat', 'remark']
  }

  public afterQuery(data) {
    data.forEach?.(item => {
      item.timeFormat = new Date(Number(item.time)).format('yyyy/MM/dd hh:mm')
    });
  }

}