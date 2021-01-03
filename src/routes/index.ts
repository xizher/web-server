import { Context } from "koa";
import routes from "koa-route";
export * from './route.translate/route.translate'

export default routes.get('', (ctx: Context) => {
  ctx.response.type = 'json'
  const { query, querystring } = ctx
  ctx.response.body = {
    'test': { query, querystring }
  }
})
