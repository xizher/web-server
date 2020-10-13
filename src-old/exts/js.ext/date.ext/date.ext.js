/**
 * 日期格式化
 * @param {String} format - 格式化字符串
 * @returns {String} 格式化的日期字符串
 */
Date.prototype.format = function (format) {
  var options = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (var k in options)
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ?
          (options[k]) :
          (("00" + options[k]).substr(("" + options[k]).length)));
      }
  return format
}

/**
 * 获得真实月份
 * @returns {Number} 真实的月份
 */
Date.prototype.getTrueMonth = function () {
  return this.getMonth() + 1
}

console.log(new Date().getTrueMonth())
console.log(new Date().format('yyyy-MM-dd hh:mm:ss'))
