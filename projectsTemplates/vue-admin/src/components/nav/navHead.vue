<template lang="pug">
nav.p-navHead
	el-col.header-left(:span="16")
		.left-tit {{title}}
			span.left-label v0.0.1
	el-col.header-right(:span="8" v-if="userInfo")
		el-dropdown.logout
			span.el-dropdown-link 欢迎您 {{userInfo.name}}
				i.el-icon-arrow-down.el-icon--right
			el-dropdown-menu(slot="dropdown")
				el-dropdown-item
					span.logout(@click="logout") 退出
</template>

<script>
import { mapState } from 'vuex';
import $api from '@/model/api';
import $store from '../../vuex/index';

export default {
  props: ['title'],
  data() {
    return {};
  },
  computed: {
    ...mapState('user', ['userInfo']),
  },
  methods: {
    async logout() {
      const rs = await this.$post($api.logout);
      if (rs) {
        // 删除全局的用户信息
        $store.commit('user/setUserInfo', null);
        // 跳转去登录页
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style lang="less">
@import '~css/color';

#app .p-navHead {
  z-index: 1000;
  text-align: left;
  overflow: hidden;
  line-height: 60px;
  background-color: @menu-bg;

  .header-left {
    font-size: 20px;
    font-weight: bold;
    color: white;
    .logo-link {
      display: inline-block;
      text-decoration: none;
      cursor: pointer;
    }
    .logo-link:visited {
      color: white;
    }
    .icon-svg {
      margin-right: 10px;
      width: 40px;
      height: 40px;
      color: @theme-color;
    }
  }

  .header-right {
    text-align: right;
    color: white;
    .info {
      margin-right: 10px;
      cursor: pointer;
    }
    .logout {
      cursor: pointer;
    }
    .el-dropdown {
      color: white;
    }
  }

  .left-tit {
    font-size: 16px;
    font-weight: 600;
  }

  .left-label {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
    width: 43px;
    height: 18px;
    background-color: #203442;
    border-radius: 9px;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
  }
}

.el-dropdown-menu {
  width: 250px;
  color: white;
  font-size: 14px;

  .el-dropdown-menu__item {
    span {
      display: block;
    }
  }
}
</style>
