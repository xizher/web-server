module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    // "plugin:@typescript-eslint/recommended"
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'globals': {
    'process': true
  },
  'plugins': [
    // '@typescript-eslint'
  ],
  'rules': {
    'semi': ['error', 'never'], // 行末不用分号
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }], // 字符串使用单引号
    'curly': 'error', // 块区域前后时刻保留大括号
    'default-case': 'error', // switch 语句中必须包含 default 分支
    'dot-location': ['error', 'property'], // 点操作符和属性放在同一行
    'eqeqeq': 'error', // === !==
    'no-empty-function': 'error', // 不出现空函数
    'no-multi-spaces': 'error', // 不出现多个空格
    'no-multi-str': 'error', // 不多行字符串
    'array-bracket-spacing': ['error', 'never'], // 数组格式
    'block-spacing': 'error', // 代码块大括号风格
    // 'brace-style': ['error', 'stroustrup', { 'allowSingleLine': true }], // 代码块大括号风格
    'camelcase': 'error', // 使用骆驼拼写法
    'comma-spacing': ['error', { 'before': false, 'after': true }], // 逗号前后的空格风格
    'eol-last': ['error', 'always'], // 文件末尾存在空行
    'indent': ['error', 2], // 缩进 2
    'keyword-spacing': ['error', { 'before': true, 'after': true }],
    'no-trailing-spaces': 'error', // 行末不出现空格
    // 'pace-before-function-paren': 'error', // 函数圆括号之前有一个空格
    'space-infix-ops': 'error', // 操作符周围有空格
    'no-var': 'error',
  }
}
