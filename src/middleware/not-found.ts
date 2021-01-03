import { Context, Next } from 'koa'

export default async function (ctx: Context, next: Next) {
  await next()
  if (ctx.status === 404) {
    ctx.response.type = 'html'
    ctx.response.body = '404<a href="/">back</a>'
  }
}
