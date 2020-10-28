import { AppManager } from './app';
import { BlogRouter, NavRouter, PwdRouter, TestRouter } from './routes';
import { Server } from './server';

import './extensions'

const { app } = new AppManager()
  .useCrossDomain()
  .useExtension()
  .useRouter('/', new TestRouter())
  .useRouter('/api/blog', new BlogRouter())
  .useRouter('/api/nav', new NavRouter())
  .useRouter('/api/pwd', new PwdRouter())
  .useLastRouter();

new Server(app, 3333);