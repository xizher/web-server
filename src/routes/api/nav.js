"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavRouter = void 0;
const express_1 = require("express");
const response_model_1 = require("../../models/response-model");
const pg_utils_1 = require("../../utils/pg-utils");
const reg_exp_1 = require("../../utils/reg-exp");
class NavRouter {
    constructor() {
        this.router = express_1.Router();
        this._initRouter();
    }
    _initRouter() {
        this.router.get('/list', (req, res) => {
            this._getNavList(req.query)
                .then(result => res.json(new response_model_1.SuccessModel(result)))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
        this.router.post('/update', (req, res) => {
            this._updateNav(req.body)
                .then(() => res.json(new response_model_1.SuccessModel(true)))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
        this.router.post('/add', (req, res) => {
            this._addNav(req.body)
                .then(() => res.json(new response_model_1.SuccessModel(true)))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
    }
    _getNavList({ limit, offset, withVisible }) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `SELECT * FROM tb_nav ORDER BY id DESC`;
            if (withVisible) {
                sql += ' WHERE visible = true';
            }
            if ((reg_exp_1.unsignedIntegerRegExp.test(String(limit))
                && reg_exp_1.unsignedIntegerRegExp.test(String(offset)))) {
                sql = sql + ` LIMIT ${limit} OFFSET ${offset}`;
            }
            const result = yield pg_utils_1.evalSql(sql);
            const items = result.rows.map((item) => {
                item.name = unescape(item.name);
                item.type = unescape(item.type);
                item.url = unescape(item.url);
            });
            sql = `SELECT COUNT(id) FROM tb_nav`;
            const { count } = (yield pg_utils_1.evalSql(sql)).rows[0];
            return Promise.resolve({ items: result.rows, total: Number(count) });
        });
    }
    _updateNav({ name, type, url, visible, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reg_exp_1.numberRegExp.test(String(id)) || typeof visible != 'boolean') {
                return Promise.reject(new Error('error input'));
            }
            const sql = `UPDATE tb_nav
      SET name='${escape(name)}', type='${escape(type)}', url='${escape(url)}', visible=${visible}
      WHERE id=${id}
    `;
            yield pg_utils_1.evalSql(sql);
            return Promise.resolve();
        });
    }
    _addNav({ name, type, url }) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `INSERT INTO tb_nav (name, type, url)
      VALUES ('${name}', '${type}', '${url}')
    `;
            yield pg_utils_1.evalSql(sql);
            return Promise.resolve();
        });
    }
}
exports.NavRouter = NavRouter;
