// import { NextFunction, Request, Response, Router } from 'express';

// type ActionType = 'use' | 'get' | 'post'

// export function routerAction (router: Router, action: ActionType, path: string)
//   : Promise<{
//     req: Request
//     res: Response
//     next: NextFunction
//   }> {
//   return new Promise(resolve => {
//     router[action](path, (req: Request, res: Response, next: NextFunction) => {
//       resolve({ req, res, next })
//     })
//   })
// }