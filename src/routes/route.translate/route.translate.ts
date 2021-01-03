import routes from "koa-route";
import { enToCn, cnToEn } from '../../controller/controller.translate'

export const translateRoute = routes.get('/translate', async ctx => {
  const { query, response } = ctx
  const { en, cn } = query
  response.type = 'json'
  const reuslt = await cnToEn(cn)
  response.body = {
    cn, en: reuslt
  }
  
})