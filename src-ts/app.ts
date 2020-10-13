import * as express from 'express';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import logger from 'morgan';
import { ErrorModel } from './models/response-model'
import IndexRouter from './routes/index'
import BlogRouter from './routes/api/blog'

function useRoutes (app : express.Application) {
  app.use('/', IndexRouter)
  app.use('/api/blog', BlogRouter)

  
  app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {
    res.json(new ErrorModel('404'))
  });
  app.use((err, req : express.Request, res : express.Response, next : express.NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });
}

export const app : express.Application = require('express')();

// 跨域
app.use('*', (req : express.Request, res : express.Response, next : express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Content-Length,Authorization,Accept,yourHeaderFeild');
  res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By',' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

useRoutes(app)

