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

}