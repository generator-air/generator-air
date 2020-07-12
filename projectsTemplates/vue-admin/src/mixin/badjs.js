import badjs from 'badjs-report';

// 日志监控模块注入
const install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $bjReport: {
      get() {
        let bjReport = {};
        bjReport = badjs.init({
          id: 1, // 上报 id, 不指定 id 将不上报
          delay: 1000, // 延迟多少毫秒，合并缓冲区中的上报（默认）
          url: '//xxx.xxx.xxx.xxx/badjs', // 【自定义】指定上报地址
          ignore: [/Script error/i], // 忽略某个错误
          random: 1, // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
          repeat: 5, // 重复上报次数(对于同一个错误超过多少次不上报)
          onReport: function (id, errObj) {
            console.log(id, errObj);
          }, // 当上报的时候回调。 id: 上报的 id, errObj: 错误的对象
          submit: null, // 覆盖原来的上报方式，可以自行修改为 post 上报等
          ext: {}, // 扩展属性，后端做扩展处理属性。例如：存在 msid 就会分发到 monitor,
          offlineLog: false, // 是否启离线日志 [默认 false]
          offlineLogExp: 5, // 离线有效时间，默认最近5天
        });
        return {
          /* 上报普通日志 */
          logI: (msg, opened) => {
            if (opened && bjReport) {
              bjReport.info(msg);
            }
          },
          /* 可以结合实时上报，跟踪问题; 不存入存储*/
          logD: (msg, opened) => {
            if (opened && bjReport) {
              bjReport.debug(msg);
            }
          },
          /* 主动上报错误日志*/
          report: (msg, opened) => {
            if (opened && bjReport) {
              bjReport.report(msg);
            }
          },
          /* 记录离线日志*/
          offline: (msg, opened) => {
            if (opened && bjReport) {
              bjReport.offlineLog(msg);
            }
          },
        };
      },
    },
  });
};

export default {
  install,
};
