import $notify from '@/util/notify';

const dictionary = {
  404: '啊哦，404了',
  200: {
    // 构造无权访问情况，返回的用户信息
    3007: () => ({ unAuth: true }),
  },
};

// 多个错误码，对应相同响应的处理demo
const toLogin = [3000, 3001, 3002, 3003];
const authError = [8000, 8001, 8002];
const errDict = {
  // 未登录情况处理demo
  [toLogin]: () => {
    $notify.error('身份验证失败，请重新登录');
    setTimeout(() => {
      // 【自定义】跳转到第三方登录，地址自定义
      location.href =
        'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=APPID&agentid=AGENTID&redirect_uri=REDIRECT_URI';
    }, 2000);
  },
  [authError]: '权限错误~',
};

Object.keys(errDict).forEach((arrString) => {
  arrString.split(',').forEach((key) => {
    dictionary[200][key] = errDict[arrString];
  });
});

export default dictionary;
