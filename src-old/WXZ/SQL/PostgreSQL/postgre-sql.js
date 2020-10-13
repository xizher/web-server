const { PostgreSQL_CONF } = require('../../../config/db')
const { Pool } = require('pg')

WXZ.Namespace.reg('WXZ.SQL.PostgreSQL')

WXZ.SQL.PostgreSQL = {
  eval(sql) {
    return new Promise((resolve, reject) => {
      const pool = new Pool(PostgreSQL_CONF);
      pool.query(sql, (err, res) => {
        pool.end();
        if(err) {
          reject(err)
        }else{
          resolve(res)
        }
      })
    })
  }
}
