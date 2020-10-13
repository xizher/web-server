/**
 * 命名空间管理
 * @namespace
 */
const namespace = {
  /**
   * 注册命名空间
   * @param {String} s 命名空间字符串，如config.admin.module.color
   * @returns {Object} 注册的命名空间对象
   * @example
     namespace.reg('config.admin.module.color');
     // 添加功能
     config.admin.module.color.changeBgColor = function (color) {
         document.body.style.background = color;
     };
     // 调用功能
     config.admin.module.color.changeBgColor('#F30');
   */
  reg: function (s) {
    const arr = s.split('.');
    let namespace = global;

    for (let i = 0, k = arr.length; i < k; i++) {
      if (typeof namespace[arr[i]] == 'undefined') {
        namespace[arr[i]] = {};
      }

      namespace = namespace[arr[i]];
    }

    return namespace;
  },
  /**
   * 删除命名空间
   * @param {String} s 命名空间字符串，如config.admin.module.color
   * @example
     namespace.del('config.admin.module.color');
   */
  del: function (s) {
      /// <summary>删除命名空间</summary>
      /// <param name="s" type="string" optional="false">命名空间字符串，如config.admin.module.color</param>
    const arr = s.split('.');
    const namespace = window;

    for (let i = 0, k = arr.length; i < k; i++) {
      if (typeof namespace[arr[i]] == 'undefined') {
        return;
      } else if (k == i + 1) {
        delete namespace[arr[i]];
        return;
      } else {
        namespace = namespace[arr[i]];
      }
    }
  }
};

namespace.reg('WXZ.Namespace')
WXZ.Namespace = {
  reg: namespace.reg,
  del: namespace.del
}
