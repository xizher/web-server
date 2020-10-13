/**
 * 字符串比较
 * @param {String} value - 比较的字符对象
 * @param {Object} [options] - 相关配置
 * @param {Boolean} [options.ignoreCase=false] - 是否不区分大小写
 * @returns {Boolean} 比较结果
 */
String.prototype.equal = function (value, { ignoreCase = false } = {}) {
  return ignoreCase ? 
    this.toLowerCase() === value.toLowerCase() :
    this.toString() === value.toString()
}

if (typeof String.prototype.replaceAll === 'undefined') {
  /**
   * 字符串替换移除（全部）
   * @param {String} searchValue - 被替换字符
   * @param {String} replaceValue - 替换字符
   * @param {String} 替换完成后的字符
   */
  String.prototype.replaceAll = function (searchValue, replaceValue) {
    return this.replace(new RegExp(searchValue, 'gm'), replaceValue)
  }
}

if (typeof String.prototype.replaceMany === 'undefined') {
  /**
   * 字符串替换移除（多个）
   * @param {Array<String>} searchValues - 被替换的字符集
   * @param {String} replaceValue - 替换字符
   * @param {Object} [options] - 相关配置
   * @param {Boolean} [options.isReplaceAll=true] - 是否全部替换
   */
  String.prototype.replaceMany = function (searchValues, replaceValue, { isReplaceAll = true } = {}) {
    const newStr = ''
    isReplaceAll ?
      searchValues.map(item => newStr = this.replaceAll(item, replaceValue)) :
      searchValues.map(item => newStr = this.replace(item, replaceValue))
    return newStr
  }
}

/**
 * 判断是否是或包含数组中的某个值
 * @param {String} searchValues 字符数组
 * @param {Object} [options] 相关配置
 * @param {Boolean} [options.isCongruent=true] 是否全等
 */
String.prototype.contain = function (searchValues, { isCongruent = true } = {}) {
  const runStr = isCongruent ?
    'this.toString() === searchValues[i].toString()' :
    'this.indexOf(searchValues[i]) !== -1'
  for (let i = 0; i < searchValues.length; i++) {
    if (eval(runStr)) return true
  }
  return false
}
