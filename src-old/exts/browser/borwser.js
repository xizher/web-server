class Cookie {
  constructor() {
    
  }


  /**
   * 删除Cookie
   * @param {String} key - Cookie名称
   */
  static $delCookie (key) {
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    const cval = Cookie.$getCookie(key);
    if (cval != null) {
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
  }

  /**
   * 
   * @param {String} key - Cookie名称
   * @param {String} value - Cookie值
   * @param {Object} [options] - 配置项
   * @param {Number} [options.d=0] - 过期天数
   * @param {Number} [options.h=0] - 过期时数
   * @param {Number} [options.m=5] - 过期分数
   */
  static $setCookie (key, value, { 
    d = 0, h = 0, m = 5
  } = {}) {
    const exp = new Date();
    const time = d * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000 + m * 60 * 1000
    exp.setTime(exp.getTime() + time);
    document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
  }

  /**
   * 获取Cookie
   * @param {String} key - Cookie名称
   * @returns {String} Cookie值
   */
  static $getCookie (key) {
    const arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
    if (arr != null) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }
}

export default {
  Cookie
}
