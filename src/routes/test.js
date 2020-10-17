"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRouter = void 0;
const express_1 = require("express");
class TestRouter {
    constructor() {
        this.router = express_1.Router();
        this._initRouter();
    }
    _initRouter() {
        this.router.get('/', (req, res, next) => {
            res.json({
                t: 'test-router'
            });
        });
    }
}
exports.TestRouter = TestRouter;
