"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppManager = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const response_model_1 = require("./models/response-model");
const express_1 = require("express");
class AppManager {
    constructor() {
        this.app = require('express')();
    }
    useCrossDomain() {
        this.app.use('*', (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Content-Length,Authorization,Accept,yourHeaderFeild');
            res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
            res.header('X-Powered-By', ' 3.2.1');
            res.header('Content-Type', 'application/json;charset=utf-8');
            next();
        });
        return this;
    }
    useExtension() {
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.json());
        this.app.use(express_1.urlencoded({ extended: false }));
        this.app.use(cookie_parser_1.default());
        return this;
    }
    useRouter(path, routerObj) {
        this.app.use(path, routerObj.router);
        return this;
    }
    useLastRouter() {
        this.app.use((req, res, next) => {
            res.json(new response_model_1.ErrorModel('404'));
        });
        this.app.use((err, req, res, next) => {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        return this;
    }
}
exports.AppManager = AppManager;
