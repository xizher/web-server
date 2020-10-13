import { NextFunction, Request, Response, Router } from 'express';

const router : Router = Router();

router.get('/', (req : Request, res : Response, next: NextFunction) => {
  res.json({
    t: 'test-ts'
  })
})

export default router;