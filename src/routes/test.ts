import { NextFunction, Request, Response, Router } from "express";
import { IRouterClass } from '.';

export class TestRouter implements IRouterClass {

  public router : Router;

  constructor () {
    this.router = Router();

    this._initRouter ();
  }

  private _initRouter () : void {
    this.router.get('/', (req : Request, res : Response, next : NextFunction) => {
      res.json({
        t: 'test-router'
      });
    });
  }

}