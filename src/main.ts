import { AppManager } from './app';
import { BlogRouter, NavRouter, PwdRouter, TestRouter, MoneyRouter } from './routes';
import { Server } from './server';

import './extensions'

const { app } = new AppManager()
  // .useCrossDomain()
  .useExtension()
  .useRouter('/', new TestRouter())
  .useRouter('/api/blog', new BlogRouter())
  .useRouter('/api/nav', new NavRouter())
  .useRouter('/api/pwd', new PwdRouter())
  .useRouter('/api/money', new MoneyRouter())
  .useLastRouter();

new Server(app, 3000);