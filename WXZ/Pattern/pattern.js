WXZ.Namespace.reg('WXZ.Pattern')

WXZ.Pattern = {
  namePattern: /^([a-zA-Z0-9_\u4e00-\u9fa5]{1,20})$/,
  pwdPattern: /^[a-zA-Z0-9_]+$/,
  emailPattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  numberPattern : /^[0-9]+$/
}