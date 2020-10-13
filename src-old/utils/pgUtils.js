const { Pool, Client } = require('pg')
const { PostgreSQL_CONF } = require('../config/db')



module.exports = {
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