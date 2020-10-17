import { Response, Router, Request } from "express";
import { IRouterClass } from "..";
import { ErrorModel, SuccessModel } from "../../models/response-model";
import { evalSql } from "../../utils/pg-utils";
import { numberRegExp, unsignedIntegerRegExp } from "../../utils/reg-exp";

interface INavItem {
  name? : string
  url? : string
  type? : string
  id? : string | number
  visible? : boolean
}

export class NavRouter implements IRouterClass {

  public router: Router;

  constructor () {
    this.router = Router();
    this._initRouter();
  }

  private _initRouter () {
    this.router.get('/list', (req: Request, res: Response) => {
      this._getNavList(req.query as any)
        .then(result => res.json(new SuccessModel(result)))
        .catch((err: Error) => res.json(new ErrorModel(err.message)));
    });
    this.router.post('/update', (req: Request, res: Response) => {
      this._updateNav(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch((err: Error) => res.json(new ErrorModel(err.message)));
    });
    this.router.post('/add', (req: Request, res: Response) => {
      this._addNav(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch((err: Error) => res.json(new ErrorModel(err.message)));
    })
  }

  private async _getNavList ({ limit, offset, withVisible }
    : {
      limit: string | number
      offset: string | number
      withVisible: boolean
    }) : Promise<any> {
    let sql = `SELECT * FROM tb_nav ORDER BY id DESC`;
    if (withVisible) {
      sql += ' WHERE visible = true'
    }
    if ((unsignedIntegerRegExp.test(String(limit))
      && unsignedIntegerRegExp.test(String(offset)))) {
      sql = sql + ` LIMIT ${limit} OFFSET ${offset}`;
    }
    const result = await evalSql(sql);
    const items = result.rows.map((item : INavItem) => {
      item.name = unescape(item.name);
      item.type = unescape(item.type);
      item.url = unescape(item.url);
    })
    sql = `SELECT COUNT(id) FROM tb_nav`
    const { count } = (await evalSql(sql)).rows[0]
    return Promise.resolve({ items: result.rows, total: Number(count) })
  }

  private async _updateNav ({ name, type, url, visible, id }
    : INavItem) : Promise<void> {
    if (!numberRegExp.test(String(id)) || typeof visible != 'boolean') {
      return Promise.reject(new Error('error input'));
    }
    const sql = `UPDATE tb_nav
      SET name='${escape(name)}', type='${escape(type)}', url='${escape(url)}', visible=${visible}
      WHERE id=${id}
    `;
    await evalSql(sql);
    return Promise.resolve();
  }

  private async _addNav ({ name, type, url } : INavItem) : Promise<void> {
    const sql : string = `INSERT INTO tb_nav (name, type, url)
      VALUES ('${name}', '${type}', '${url}')
    `;
    await evalSql(sql);
    return Promise.resolve();
  }

}