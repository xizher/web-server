import { NextFunction, Request, Response, Router } from "express";
import { ErrorModel, SuccessModel } from "../../models/response-model";
import { evalSql } from "../../utils/pg-utils";

const router = Router()


const getBlogList = async ({ limit = null, offset = null }) => {
  let sql : string = `SELECT id, title, description, sides, create_time, modify_time, view_count, good_count, visible, content
    FROM tb_blog
    ORDER BY create_time
    DESC`
  if (isNaN(limit) && isNaN(offset)) {
    sql = sql + ` LIMIT ${limit} OFFSET ${offset};`
  }
  const result = await evalSql(sql)
  const items = result.rows.map(item => {
    item.title = unescape(item.title)
    item.content = unescape(item.content)
    item.description = unescape(item.description)
    item.create_time = Number(item.create_time)
    item.modify_time = item.modify_time
      ? Number(item.modify_time)
      : item.create_time
    return item
  })
  sql = 'SELECT COUNT(id) FROM tb_blog;'
  const { count } = (await evalSql(sql)).rows[0]
  return Promise.resolve({ items, total: Number(count) })
}

router.get('/list', (req : Request, res : Response, next : NextFunction) => {
  getBlogList(req.query)
    .then(result => res.json(new SuccessModel(result)))
    .catch((err : Error) => {
      res.json(new ErrorModel(err.message))
    })
})

export default router
