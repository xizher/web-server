import { Context, Next } from "koa";

export default function (ctx: Context, next: Next) {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  next()
}