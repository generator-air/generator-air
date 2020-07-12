import axios from 'axios';
import errorDict from '../model/errorDict';
import $notify from '@/util/notify';

/**
 * 我们默认处理的字段，假定服务器返回数据结构形如：
 * {
 * 	code: 0,
 * 	msg: '成功',
 * 	data: xxx
 * }
 * 这里，code、msg字段名称，开发者可根据实际项目的约定，自行修改。
 * 具体需要修改的位置，见以下【自定义】标注
 */
function useDict(status, code) {
  let dictMatch = errorDict[status];
  // 判断错误字典匹配值类型
  const statusType = dictMatch && typeof dictMatch;
  // 如果是object，说明存在对指定code错误码的响应行为定义。拿到这个响应，赋值给 dictMatch
  if (statusType === 'object') {
    dictMatch = errorDict[status][code];
  }
  // 再次判断赋值后的 dictMatch 类型
  const sType = typeof dictMatch;
  // string类型，直接弹窗，提示给用户
  if (sType === 'string') {
    return dictMatch;
  }
  // function类型，执行 funciton
  if (sType === 'function') {
    // 方法执行可能有返回值。无返回值时，直接执行处理函数。如需弹窗提示，在处理函数中添加
    return dictMatch() || true;
  }
}

function getErrorMsg(httpCode, resData) {
  // 【自定义】resData.code、resData.msg 的 code、msg 字段名称，根据项目约定，自行定义
  const errMsg = useDict(httpCode, resData.code) || resData.msg;
  return Promise.reject(errMsg);
}

axios.interceptors.response.use(
  ({ data, status }) => {
    // 【自定义】code字段名称，根据项目约定，自行定义
    if (data.code === 0) {
      // 没有错误的理想情况直接返回数据
      return data;
    }
    return getErrorMsg(status, data);
  },
  (err) => {
    // httpCode非200情况
    if (err.response) {
      const { status, data } = err.response;
      return getErrorMsg(status, data);
    }
    return Promise.reject('网络错误');
  }
);

function $request(options) {
  return axios({
    ...options,
    headers: {
      // ajax 请求标识，部分服务器会区别对待 ajax 请求和普通请求
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
    // 跨域携带cookie
    // withCredentials: true
  }).catch((err) => {
    // 如果有errMsg，弹窗提示。如果没有，静默处理
    if (typeof err === 'string') {
      $notify.error(err);
    }
    // 返回reject，防止进入页面调用处的.then
    return Promise.reject(err);
  });
}

const exportObj = {
  $get: (url, params) =>
    $request({
      url,
      params,
      method: 'get',
    }),
  $post: (url, data) =>
    $request({
      url,
      data,
      method: 'post',
    }),
  $put: (url, data) =>
    $request({
      url,
      data,
      method: 'put',
    }),
  $delete: (url, data) =>
    $request({
      url,
      data,
      method: 'delete',
    }),
};

const install = (Vue) => {
  // 插件安装
  Object.keys(exportObj).forEach((method) => {
    Vue.prototype[method] = exportObj[method];
  });
};

export default {
  install,
  $request,
  ...exportObj,
};
