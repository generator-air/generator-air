<template lang="pug">
#app
	//- 已登录、有权限用户（如使用第三方登录，可删除 && !user.unLogin 判断）
	.login(v-if="user && !user.unAuth && !user.unLogin")
		.l-left
			v-logo(title="平台logo")
			v-side
		.l-right
			v-head.l-header(title="后台管理系统")
			.l-body
				.body-content
					.l-bread
						el-breadcrumb(
							separator="/"
							v-if="$route.meta.breadcrumb"
						)
							el-breadcrumb-item(
								v-for="bread in $route.meta.breadcrumb"
								:key="bread"
								:to="{ name: bread }"
							) {{bread}}
						h3 {{$route.name}}
					router-view.l-route
	//- 已登录、无权限用户
	.un-auth(v-else-if="user")
		router-view
</template>

<script>
import { mapState } from 'vuex';
import navHead from '@/components/nav/navHead';
import navSide from '@/components/nav/navSide';
import logo from '@/components/global/logo';

export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  components: {
    'v-head': navHead,
    'v-side': navSide,
    'v-logo': logo,
  },
  computed: {
    ...mapState('user', ['userInfo']),
  },
  watch: {
    userInfo(val) {
      this.user = val;
    },
  },
  data() {
    return {
      user: false,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
  mounted() {
    // 全局注册 notify 响应事件
    this.$bus.on('notify', (options) => {
      let para = Object.assign({}, options);
      this.$notify(para);
    });
  },
};
</script>

<style lang="less">
@import '~css/color';

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  margin-right: 6px;
}

#app {
  position: relative;
  width: 100%;
  height: 100vh;
  min-width: 1200px;
  overflow: hidden;
}
.l-left {
  width: 200px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: auto;
  background: @menu-bg;
}
.logo {
  width: 200px;
  height: 119px;
  background-color: @menu-bg;
}
.left-side {
  height: calc(100% - 203px);
  overflow-y: auto;
  // 隐藏滚动条
  // IE 10+
  -ms-overflow-style: none;
  // Firefox
  overflow: -moz-scrollbars-none;
  // chrome 和 Safari
  &::-webkit-scrollbar {
    display: none;
  }
}
.l-right {
  position: relative;
  height: 100%;
  margin-left: 200px;
}
.l-header {
  position: absolute;
  top: 0;
  height: 60px;
  width: 100%;
}
.l-body {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  border-top: 60px solid transparent;
  position: relative;
  padding: 0 20px;
}
.body-content {
  position: relative;
  width: 100%;
  min-height: calc(100% - 200px);
  overflow: auto;
  box-sizing: border-box;
}
.l-bread {
  background-color: #fff;
  padding: 20px 20px 15px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-bottom: 20px;
  h3 {
    margin: 10px 0 0;
  }
}
.l-route {
  border-radius: 10px;
  padding: 30px 20px;
  background-color: #fff;
  overflow: auto;
}
</style>
