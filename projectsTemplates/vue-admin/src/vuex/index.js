import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';
import menu from './menu';

Vue.use(Vuex);

const modules = {
  user,
  menu,
};

// 遍历modules对象，为每个子对象添加namespaced属性
Object.keys(modules).forEach((obj) => {
  modules[obj].namespaced = true;
});

export default new Vuex.Store({
  modules,
});
