"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const routes_1 = require("./routes");
const server_1 = require("./server");
const { app } = new app_1.AppManager()
    .useCrossDomain()
    .useExtension()
    .useRouter('/', new routes_1.TestRouter())
    .useRouter('/api/blog', new routes_1.BlogRouter())
    .useRouter('/api/nav', new routes_1.NavRouter())
    .useLastRouter();
new server_1.Server(app, 3333);
