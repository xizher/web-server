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
exports.BlogRouter = void 0;
const express_1 = require("express");
const response_model_1 = require("../../models/response-model");
const pg_utils_1 = require("../../utils/pg-utils");
const reg_exp_1 = require("../../utils/reg-exp");
class BlogRouter {
    constructor() {
        this.router = express_1.Router();
        this._initRouter();
    }
    _initRouter() {
        this.router.get('/list', (req, res) => {
            this._getBlogList(req.query)
                .then(result => res.json(new response_model_1.SuccessModel(result)))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
        this.router.post('/set-visible', (req, res) => {
            this._setVisible(req.body)
                .then(() => res.json(new response_model_1.SuccessModel(true)))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
        this.router.post('/update', (req, res) => {
            this._updateBlog(req.body)
                .then(() => res.json(new response_model_1.SuccessModel(true)))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
        this.router.post('/viewed', (req, res) => {
            this._plueBlogInfo(Object.assign(Object.assign({}, req.body), { type: 'view_count' }))
                .then(() => res.json(new response_model_1.SuccessModel(true)))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
        this.router.post('/good', (req, res) => {
            this._plueBlogInfo(Object.assign(Object.assign({}, req.body), { type: 'good_count' }))
                .then(() => res.json(new response_model_1.SuccessModel(true)))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
        this.router.get('/get', (req, res) => {
            this._getBlogById(req.query)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                yield this._plueBlogInfo(Object.assign(Object.assign({}, req.query), { type: 'view_count' }));
                res.json(new response_model_1.SuccessModel(result));
            }))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
        this.router.post('/add', (req, res) => {
            this._addBlog(req.body)
                .then(() => res.json(new response_model_1.SuccessModel(true)))
                .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
        });
    }
    _getBlogList({ limit, offset }) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `SELECT id, title, description, sides, create_time,
                modify_time, view_count, good_count, visible, content
      FROM tb_blog
      ORDER BY create_time
      DESC
    `;
            if ((reg_exp_1.unsignedIntegerRegExp.test(String(limit))
                && reg_exp_1.unsignedIntegerRegExp.test(String(offset)))) {
                sql = sql + ` LIMIT ${limit} OFFSET ${offset}`;
            }
            const result = yield pg_utils_1.evalSql(sql);
            const items = result.rows.map((item) => {
                item.title = unescape(item.title);
                item.content = unescape(item.content);
                item.description = unescape(item.description);
                item.create_time = Number(item.create_time);
                item.modify_time = item.modify_time
                    ? Number(item.modify_time)
                    : item.create_time;
                return item;
            });
            sql = 'SELECT COUNT(id) FROM tb_blog';
            const { count } = (yield pg_utils_1.evalSql(sql)).rows[0];
            return Promise.resolve({ items, total: Number(count) });
        });
    }
    _setVisible({ visible, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reg_exp_1.numberRegExp.test(String(id))) {
                return Promise.reject(new Error('error input'));
            }
            const sql = `UPDATE tb_blog SET visible=${visible} WHERE id=${id}`;
            yield pg_utils_1.evalSql(sql);
            return Promise.resolve();
        });
    }
    ;
    _updateBlog({ title, description, content, sides, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reg_exp_1.numberRegExp.test(String(id))) {
                return Promise.reject(new Error('error input'));
            }
            let sides_str = '{';
            for (let i = 0; i < sides.length; i++) {
                sides_str = `${sides_str}"${sides[i]}"${i == sides.length - 1 ? '}' : ','}`;
            }
            const sql = `UPDATE tb_blog 
      SET title='${escape(title)}', description='${escape(description)}', content='${escape(content)}', sides='${sides_str}', modify_time=${new Date().getTime()}
      WHERE id=${id}
    `;
            yield pg_utils_1.evalSql(sql);
            return Promise.resolve();
        });
    }
    _plueBlogInfo({ id, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reg_exp_1.numberRegExp.test(String(id))) {
                return Promise.reject(new Error('error input'));
            }
            const sql = `UPDATE tb_blog 
      SET ${type}=${type}+1 
      WHERE id = ${id}
    `;
            yield pg_utils_1.evalSql(sql);
            return Promise.resolve();
        });
    }
    _getBlogById({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reg_exp_1.numberRegExp.test(String(id))) {
                return Promise.reject(new Error('error input'));
            }
            const sql = `SELECT * FROM tb_blog WHERE id = ${id}`;
            const result = yield pg_utils_1.evalSql(sql);
            if (result.rowCount != 1) {
                return Promise.reject(new Error('error sql update'));
            }
            result.rows[0].title = unescape(result.rows[0].title);
            result.rows[0].content = unescape(result.rows[0].content);
            result.rows[0].description = unescape(result.rows[0].description);
            result.rows[0].create_time = Number(result.rows[0].create_time);
            result.rows[0].modify_time = result.rows[0].modify_time
                ? Number(result.rows[0].modify_time)
                : result.rows[0].create_time;
            return Promise.resolve(result.rows[0]);
        });
    }
    _addBlog({ title, desc, content, sides }) {
        return __awaiter(this, void 0, void 0, function* () {
            let sides_str = '{';
            for (let i = 0; i < sides.length; i++) {
                sides_str = `${sides_str}"${sides[i]}"${i == sides.length - 1 ? '}' : ','}`;
            }
            const sql = `INSERT INTO tb_blog (title, description, content, sides, create_time)
      VALUES ('${escape(title)}', '${escape(desc)}', '${escape(content)}', '${sides_str}', ${new Date().getTime()})
    `;
            const result = yield pg_utils_1.evalSql(sql);
            if (result.rowCount == 1) {
                return Promise.resolve();
            }
            else {
                return Promise.reject(new Error('error blog insert'));
            }
        });
    }
}
exports.BlogRouter = BlogRouter;
