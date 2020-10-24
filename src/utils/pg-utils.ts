import { Pool, QueryResult } from 'pg';
import { POSTGRESQL_CONF } from '../config/db.conf';

export function evalSql (sql : string) : Promise<QueryResult<any>> {
  return new Promise((resolve : Function, reject : Function) => {
    const pool : Pool = new Pool(POSTGRESQL_CONF);
    pool.query(sql, (err : Error,  result : QueryResult<any>) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
      pool.end();
    });
  });
}