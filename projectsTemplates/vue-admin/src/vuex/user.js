export default {
  state: {
    userInfo: null,
    auth: null,
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = info;
    },
    setAuth(state, authObj) {
      state.auth = authObj;
    },
  },
};
