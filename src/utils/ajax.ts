export default function ({
  url = '',
  method = 'GET',
  dataType = 'json',
  async = true,
  data = {},
  headers = {},
  timeout = 10000
} = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', event => {
      const status = xhr.status;
      if ((status >= 200 && status < 300) || status === 304) {
        let result;
        if (xhr.responseType === 'text') {
          result = xhr.responseText;
        } else if (xhr.responseType === 'document') {
          result = xhr.responseXML;
        } else {
          result = xhr.response;
        }
        // 注意:状态码200表示请求发送/接受成功,不表示业务处理成功
        resolve({ result, status, xhr });
      } else {
        reject({ xhr, status, event });
      }
    })
    // 请求出错
    xhr.addEventListener('error', e => {
      reject({ xhr, status: xhr.status, e });
    });
    // 请求超时
    xhr.addEventListener('timeout', e => {
      reject({ xhr, status: 408, e });
    });
    let useUrlParam = false;
    let sType = method.toUpperCase();
    // 如果是"简单"请求,则把data参数组装在url上
    if (sType === 'GET' || sType === 'DELETE') {
      useUrlParam = true;
      url += getUrlParam(url, data);
    }
    // 初始化请求
    xhr.open(method, url, async);
    // 设置期望的返回数据类型
    xhr.responseType = dataType as XMLHttpRequestResponseType;
    // 设置请求头
    for (const key of Object.keys(headers)) {
      xhr.setRequestHeader(key, headers[key]);
    }
    // 设置超时时间
    if (async && timeout) {
      xhr.timeout = timeout;
    }
    // 发送请求.如果是简单请求,请求参数应为null.否则,请求参数类型需要和请求头Content-Type对应
    xhr.send(useUrlParam ? null : getQueryData(data));
  })
}

 // 把参数data转为url查询参数
function getUrlParam (url, data) {
  if (!data) {
    return '';
  }
  let paramsStr = data instanceof Object ? getQueryString(data) : data;
  return (url.indexOf('?') !== -1) ? paramsStr : '?' + paramsStr;
}
// 获取ajax请求参数
function getQueryData (data) {
  if (!data) {
    return null;
  }
  if (typeof data === 'string') {
    return data;
  }
  if (data instanceof FormData) {
    return data;
  }
  return getQueryString(data);
}
// 把对象转为查询字符串
function getQueryString (data) {
  let paramsArr = [];
  if (data instanceof Object) {
    Object.keys(data).forEach(key => {
      let val = data[key];
      // todo 参数Date类型需要根据后台api酌情处理
      if (val instanceof Date) {
        // val = dateFormat(val, 'yyyy-MM-dd hh:mm:ss');
      }
      paramsArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    });
  }
  return paramsArr.join('&');
}