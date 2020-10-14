import { NextFunction, Request, Response, Router } from "express";
import { ErrorModel, SuccessModel } from "../../models/response-model";
import { evalSql } from "../../utils/pg-utils";
import { numberRegExp, unsignedIntegerRegExp } from "../../utils/reg-exp";

const router = Router();

interface IBlogItem {
  title : string
  description : string
  sides : string[]
  content : string
  create_time : number | string | null
  modify_time : number | string | null
}
interface IPomiseGetBlogList {
  items: Array<IBlogItem>
  total: number
}
const getBlogList = async ({ limit, offset }
  : { limit: string | number, offset: string | number })
  : Promise<IPomiseGetBlogList> => {
  let sql : string = `SELECT id, title, description, sides, create_time,
                  modify_time, view_count, good_count, visible, content
    FROM tb_blog
    ORDER BY create_time
    DESC
  `;
  if ((unsignedIntegerRegExp.test(limit.toString()) 
    && unsignedIntegerRegExp.test(offset.toString()))) {
    sql = sql + ` LIMIT ${limit} OFFSET ${offset}`;
  }
  const result = await evalSql(sql);
  const items = result. rows.map((item : IBlogItem) : IBlogItem => {
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
  return Promise.resolve({ items: items, total: Number(count) })
};

const setVisible = async ({ visible, id }
  : { visible : boolean, id : number | string }) 
  : Promise<void> => {
  if (!numberRegExp.test(id.toString())) {
    return Promise.reject(new Error('error input'));
  }
  const sql = `UPDATE tb_blog SET visible=${visible} WHERE id=${id}`;
  await evalSql(sql);
  return Promise.resolve();
};

const updateBlog = async ({ title, description, content, sides, id }
  : { title : string
      description : string
      content : string
      sides : Array<string>
      id : string | number 
    })
  : Promise<void> => {
    
}

router.get('/list', (req : Request, res : Response) => {
  getBlogList(req.query as any)
    .then(result => res.json(new SuccessModel(result)))
    .catch((err : Error) => res.json(new ErrorModel(err.message)));
});

router.post('/set-visible', (req: Request, res : Response) => {
  setVisible(req.body)
    .then(() => res.json(new SuccessModel(true)))
    .catch((err : Error) => res.json(new ErrorModel(err.message)));
});




export default router
