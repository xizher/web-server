import { Request, Response, Router } from "express";
import { ErrorModel, SuccessModel } from "../../models/response-model";
import { evalSql } from "../../utils/pg-utils";
import { numberRegExp, unsignedIntegerRegExp } from "../../utils/reg-exp";
import { IRouterClass } from "..";

interface IBlogItem {
  title: string
  description: string
  sides: string[]
  content: string
  create_time: number | string | null
  modify_time: number | string | null
}

interface IPomiseGetBlogList {
  items: Array<IBlogItem>
  total: number
}

type BlogInfo = 'view_count' | 'good_count';

export class BlogRouter implements IRouterClass {

  public router : Router;

  constructor () {
    this.router = Router();
    this._initRouter();
  }

  private _initRouter () {
    this.router.get('/list', (req: Request, res: Response) => {
      this._getBlogList(req.query as any)
        .then(result => res.json(new SuccessModel(result)))
        .catch((err : Error) => res.json(new ErrorModel(err.message)));
    });
    this.router.post('/set-visible', (req: Request, res: Response) => {
      this._setVisible(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch((err : Error) => res.json(new ErrorModel(err.message)));
    });
    this.router.post('/update', (req: Request, res: Response) => {
      this._updateBlog(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch((err : Error) => res.json(new ErrorModel(err.message)));
    });
    this.router.post('/viewed', (req: Request, res: Response) => {
      this._plueBlogInfo({ ...req.body, type: 'view_count' })
        .then(() => res.json(new SuccessModel(true)))
        .catch((err : Error) => res.json(new ErrorModel(err.message)));
    });
    this.router.post('/good', (req: Request, res: Response) => {
      this._plueBlogInfo({ ...req.body, type: 'good_count' })
        .then(() => res.json(new SuccessModel(true)))
        .catch((err : Error) => res.json(new ErrorModel(err.message)));
    });
    this.router.get('/get', (req: Request, res: Response) => {
      this._getBlogById(req.query as any)
        .then(async result => {
          await this._plueBlogInfo({...(req.query as any), type: 'view_count'})
          res.json(new SuccessModel(result))
        })
        .catch((err: Error) => res.json(new ErrorModel(err.message)))
    });
    this.router.post('/add', (req: Request, res: Response) => {
      this._addBlog(req.body)
        .then(() => res.json(new SuccessModel(true)))
        .catch((err : Error) => res.json(new ErrorModel(err.message)));
    })
  }

  private async _getBlogList ({ limit, offset }
    : {
      limit: string | number
      offset: string | number
    }) : Promise<IPomiseGetBlogList> {
    let sql : string = `SELECT id, title, description, sides, create_time,
                modify_time, view_count, good_count, visible, content
      FROM tb_blog
      ORDER BY create_time
      DESC
    `;
    if ((unsignedIntegerRegExp.test(String(limit)) 
      && unsignedIntegerRegExp.test(String(offset)))) {
      sql = sql + ` LIMIT ${limit} OFFSET ${offset}`;
    }
    const result = await evalSql(sql);
    const items = result.rows.map((item : IBlogItem) : IBlogItem => {
      item.title = unescape(item.title);
      item.content = unescape(item.content);
      item.description = unescape(item.description);
      item.create_time = Number(item.create_time);
      item.modify_time = item.modify_time
        ? Number(item.modify_time)
        : item.create_time;
      return item;
    });
    sql = 'SELECT COUNT(id) FROM tb_blog';
    const { count } = (await evalSql(sql)).rows[0];
    return Promise.resolve({ items, total: Number(count) })
  }

  private async _setVisible ({ visible, id }
    : { visible : boolean, id : number | string }) 
    : Promise<void> {
    if (!numberRegExp.test(String(id))) {
      return Promise.reject(new Error('error input'));
    }
    const sql = `UPDATE tb_blog SET visible=${visible} WHERE id=${id}`;
    await evalSql(sql);
    return Promise.resolve();
  };

  private async _updateBlog ({ title, description, content, sides, id }
    : {
      title: string
      description: string
      content: string
      sides: string[]
      id: string | number
    }) : Promise<void> {
    if (!numberRegExp.test(String(id))) {
      return Promise.reject(new Error('error input'));
    }
    let sides_str = '{';
    for (let i = 0; i < sides.length; i++) {
      sides_str = `${sides_str}"${sides[i]}"${i == sides.length - 1 ? '}' : ','}`
    }
    const sql = `UPDATE tb_blog 
      SET title='${escape(title)}', description='${escape(description)}', content='${escape(content)}', sides='${sides_str}', modify_time=${new Date().getTime()}
      WHERE id=${id}
    `;
    await evalSql(sql);
    return Promise.resolve();
  }

  private async _plueBlogInfo ({ id, type }
    : { id: string | number, type: BlogInfo }) : Promise<void> {
    if (!numberRegExp.test(String(id))) {
      return Promise.reject(new Error('error input'));
    }
    const sql = `UPDATE tb_blog 
      SET ${type}=${type}+1 
      WHERE id = ${id}
    `;
    await evalSql(sql);
    return Promise.resolve();
  }

  private async _getBlogById ({ id }: { id: number | string }) : Promise<IBlogItem> {
    if (!numberRegExp.test(String(id))) {
      return Promise.reject(new Error('error input'));
    }
    const sql = `SELECT * FROM tb_blog WHERE id = ${id}`;
    const result = await evalSql(sql);
    if (result.rowCount != 1) {
      return Promise.reject(new Error('error sql update'));
    }
    result.rows[0].title = unescape(result.rows[0].title);
    result.rows[0].content = unescape(result.rows[0].content);
    result.rows[0].description = unescape(result.rows[0].description);
    result.rows[0].create_time = Number(result.rows[0].create_time);
    result.rows[0].modify_time = result.rows[0].modify_time
      ? Number(result.rows[0].modify_time) 
      : result.rows[0].create_time;
    return Promise.resolve(result.rows[0])
  }

  private async _addBlog ({ title, desc, content, sides }
    : {
      title: string
      desc: string
      content: string
      sides: string[]
    }) : Promise<void> {
    let sides_str : string = '{'
    for (let i = 0; i < sides.length; i++) {
      sides_str = `${sides_str}"${sides[i]}"${i == sides.length - 1 ? '}' : ','}`
    }
    const sql : string = `INSERT INTO tb_blog (title, description, content, sides, create_time)
      VALUES ('${escape(title)}', '${escape(desc)}', '${escape(content)}', '${sides_str}', ${new Date().getTime()})
    `;
    const result = await evalSql(sql);
    if (result.rowCount == 1) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('error blog insert'));
    }
  }

}
