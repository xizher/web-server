import { AppManager } from './app';
import { BlogRouter, NavRouter, TestRouter } from './routes';
import { Server } from './server';

const { app } = new AppManager()
  .useCrossDomain()
  .useExtension()
  .useRouter('/', new TestRouter())
  .useRouter('/api/blog', new BlogRouter())
  .useRouter('/api/nav', new NavRouter())
  .useLastRouter();

new Server(app, 3333);