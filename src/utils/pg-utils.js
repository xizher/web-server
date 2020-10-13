"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalSql = void 0;
const pg_1 = require("pg");
const db_conf_1 = require("../config/db.conf");
function evalSql(sql) {
    return new Promise((resolve, reject) => {
        const pool = new pg_1.Pool(db_conf_1.POSTGRESQL_CONF);
        pool.query(sql, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
            pool.end();
        });
    });
}
exports.evalSql = evalSql;
