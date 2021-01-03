import Koa from 'koa'
import logger from './middleware/logger'
import notFount from './middleware/not-found'
import homeRoute, {
  translateRoute
} from './routes'

new Koa()
  .use(logger)
  .use(notFount)
  .use(homeRoute)
  .use(translateRoute)
  .on('error', err => {
    console.error(`error info: \n${err}`)
  })
  .listen(3000)
