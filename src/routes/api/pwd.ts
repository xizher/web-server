import { Request, Response, Router } from "express";
import { IRouterClass } from "..";
import { ErrorModel, SuccessModel } from "../../models/response-model";
import { evalSql } from "../../utils/pg-utils";
import { numberRegExp, unsignedIntegerRegExp } from "../../utils/reg-exp";

interface IPwdItem {
  name: string
  pwd: string
  bz: string
  id?: string | number
}

export class PwdRouter implements IRouterClass {

  public router: Router

  constructor () {
    this.router = Router()
    this._initRouter()
  }

  private _initRouter () {
    this.router.post('/add', (req: Request, res: Response) => {
      this._addPwd(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch((err: Error) => res.json(new ErrorModel(err.message)))
    })
    this.router.get('/list', (req: Request, res: Response) => {
      this._getPwdList(req.query as any)
        .then(result => res.json(new SuccessModel(result)))
        .catch((err: Error) => res.json(new ErrorModel(err.message)))
    })
    this.router.post('/update', (req: Request, res: Response) => {
      this._updatePwd(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch((err: Error) => res.json(new ErrorModel(err.message)))
    })
    this.router.post('/del', (req: Request, res: Response) => {
      this._delPwd(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch((err: Error) => res.json(new ErrorModel(err.message)))
    })
  }

  private async _addPwd ({ name, pwd, bz = '' }: IPwdItem) : Promise<void> {
    if (pwd.length % 32 !== 0) {
      return Promise.reject(new Error('error input'))
    }
    const sql = `INSERT INTO tb_pwd (name, pwd, bz)
      VALUES ('${escape(name)}', '${escape(pwd)}', '${escape(bz)}')
    `
    await evalSql(sql)
    return Promise.resolve()
  }

  private async _getPwdList ({ limit, offset }
    : {
      limit: string | number
      offset: string | number
    }) : Promise<any> {
    let sql = `SELECT * FROM tb_pwd ORDER BY id DESC`
    if ((unsignedIntegerRegExp.test(String(limit))
      && unsignedIntegerRegExp.test(String(offset)))) {
      sql = sql + ` LIMIT ${limit} OFFSET ${offset}`
    }
    const result = await evalSql(sql)
    const items = result.rows.map((item : IPwdItem) => {
      item.name = unescape(item.name)
      item.pwd = unescape(item.pwd)
      item.bz = unescape(item.bz)
      return item
    })
    sql = `SELECT COUNT(id) FROM tb_pwd`
    const { count } = (await evalSql(sql)).rows[0]
    return Promise.resolve({ items, total: Number(count) })
  }

  private async _updatePwd ({ name, pwd, bz, id }: IPwdItem) : Promise<void> {
    if (!numberRegExp.test(String(id)) || pwd.length % 32 !== 0) {
      return Promise.reject(new Error('error input'))
    }
    const sql = `UPDATE tb_pwd
      SET name='${name}', pwd='${pwd}', bz='${bz}'
      WHERE id=${id}
    `
    await evalSql(sql)
    return Promise.resolve()
  }

  private async _delPwd ({ id }) :Promise<void> {
    if (!numberRegExp.test(String(id))) {
      return Promise.reject(new Error('error input'))
    }
    const sql = `DELETE FROM tb_pwd WHERE id=${id}`
    await evalSql(sql)
    return Promise.resolve()
  }

}