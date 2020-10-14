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
const express_1 = require("express");
const response_model_1 = require("../../models/response-model");
const pg_utils_1 = require("../../utils/pg-utils");
const reg_exp_1 = require("../../utils/reg-exp");
const router = express_1.Router();
const getBlogList = ({ limit, offset }) => __awaiter(void 0, void 0, void 0, function* () {
    let sql = `SELECT id, title, description, sides, create_time,
                  modify_time, view_count, good_count, visible, content
    FROM tb_blog
    ORDER BY create_time
    DESC
  `;
    if ((reg_exp_1.unsignedIntegerRegExp.test(limit.toString())
        && reg_exp_1.unsignedIntegerRegExp.test(offset.toString()))) {
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
    return Promise.resolve({ items: items, total: Number(count) });
});
const setVisible = ({ visible, id }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!reg_exp_1.numberRegExp.test(id.toString())) {
        return Promise.reject(new Error('error input'));
    }
    const sql = `UPDATE tb_blog SET visible=${visible} WHERE id=${id}`;
    yield pg_utils_1.evalSql(sql);
    return Promise.resolve();
});
const updateBlog = ({ title, description, content, sides, id }) => __awaiter(void 0, void 0, void 0, function* () {
});
router.get('/list', (req, res) => {
    getBlogList(req.query)
        .then(result => res.json(new response_model_1.SuccessModel(result)))
        .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
});
router.post('/set-visible', (req, res) => {
    setVisible(req.body)
        .then(() => res.json(new response_model_1.SuccessModel(true)))
        .catch((err) => res.json(new response_model_1.ErrorModel(err.message)));
});
exports.default = router;
