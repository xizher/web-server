import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { ErrorModel } from './models/response-model'
import { Application, json, NextFunction, Request, Response, Router, urlencoded } from 'express';
import { IRouterClass } from './routes';

export class AppManager {

  public app : Application;

  constructor () {
    this.app = require('express')();
  }

  public useCrossDomain () : AppManager {
    this.app.use('*', (req : Request, res : Response, next : NextFunction) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Content-Length,Authorization,Accept,yourHeaderFeild');
      res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
      res.header('X-Powered-By',' 3.2.1');
      res.header('Content-Type', 'application/json;charset=utf-8');
      next();
    });
    return this;
  }

  public useExtension () : AppManager {
    this.app.use(logger('dev'));
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(cookieParser());
    return this;
  }

  public useRouter (path : string, routerObj: IRouterClass) : AppManager {
    this.app.use(path, routerObj.router);
    return this;
  }

  public useLastRouter () : AppManager {
    this.app.use((req : Request, res : Response, next : NextFunction) => {
      res.json(new ErrorModel('404'))
    });
    this.app.use((err, req : Request, res : Response, next : NextFunction) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    return this;
  }

}

