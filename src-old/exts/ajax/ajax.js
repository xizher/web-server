const axios = require('axios')

class Ajax {
  constructor () {

  }

  static get (url, options) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: {
          options
        }
      }).then(res => resolve(res.data)).catch(err => reject(err))
    })
  }
}

module.exports = Ajax
