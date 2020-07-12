/**
 * VueBus
 * @example
 * import $bus from '@/mixin/bus'
 *
 * // 首先要定义白名单
 * $bus.whiteList(['notify'])
 *
 * // 然后混合到Vue
 * Vue.use($bus)
 *
 * // 然后可以直接调用
 * $bus.emit('notify', {message: 'common text'})
 *
 * // 在组件里面直接传播或者绑定事件
 * // component.vue
 * export default {
 * 	created() {
 * 		this.$bus.on('notify', options => this.$notify(para)))
 * 		this.$bus.emit('notify', {message: 'component text'})
 * 	}
 * }
 */

let bus = null;
let whiteList = null;
const cacheList = [];

const VueBus = (Vue) => {
  if (!bus) {
    bus = new Vue();
  }
  bus.on = (...args) => {
    bus.$on(...args);
  };
  bus.once = bus.$once;
  bus.off = bus.$off;
  bus.emit = (...args) => {
    if (!whiteList || whiteList[args[0]]) {
      bus.$emit(...args);
    }
  };

  Vue.prototype.$bus = bus;

  while (cacheList.length > 0) {
    let cacheItem = cacheList.shift();
    bus[cacheItem.method](...cacheItem.args);
  }

  let list = [
    'notify',
    'user-ready',
    'user-signin',
    'user-signout',
    'require-signin',
    'require-signout',
    'progress-start',
    'progress-end',
    'progress-fail',
    'list-update',
    'list-changed',
    'set-router',
  ];
  if (!whiteList) {
    whiteList = {};
  }
  if (Array.isArray(list)) {
    list.forEach((name) => {
      whiteList[name] = true;
    });
  }
};

['on', 'once', 'off', 'emit'].forEach((method) => {
  VueBus[method] = (...args) => {
    if (!bus) {
      let cacheItem = {};
      cacheItem.method = method;
      cacheItem.args = args;
      cacheList.push(cacheItem);
    } else {
      bus[method](...args);
    }
  };
});

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueBus);
}

export default VueBus;
