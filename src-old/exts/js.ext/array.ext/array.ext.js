/**
 * 在数组指定位置插入对象
 * @param {Number} index - 位置索引
 * @param {any} insertItem - 插入数据
 */
Array.prototype.insert = function (index, insertItem) {
  this.splice(index, 0, insertItem)
}

/**
 * 删除数组指定位置数据
 * @param {Number} index - 指定位置
 */
Array.prototype.remove = function (index) {
  this.splice(index, 1)
}

/**
 * 清空数据
 */
Array.prototype.clear = function () {
  this.splice(0, this.length)
}

/**
 * 数组去重
 * @returns {Array} 返回去重后的数组
 */
Array.prototype.unique = function () {
  return [...new Set(this)]
}