<template lang="pug">
el-menu.p-navSide(
	:default-active="activeIndex"
	:unique-opened="true"
	text-color="#ffffff"
	background-color="#334654"
	active-text-color="#1bbc9c"
	router
)
	template(v-for="menuItem in menuList")
		el-submenu(
			v-if="!menuItem.hidden && menuItem.submenu"
			:index="menuItem.menuId"
		)
			template(slot="title")
				svg-icon(:name="menuItem.icon")
				span.title {{menuItem.title}}
			template(
				v-for="submenuItem in menuItem.submenu"
			)
				el-submenu(
					v-if="submenuItem.submenu"
					:index="submenuItem.menuId"
				)
					template(slot="title")
						svg-icon(:name="submenuItem.icon")
						span.title {{submenuItem.title}}
					el-menu-item(
						v-for="item in submenuItem.submenu"
						:key="item.url"
						:index="item.url"
					)
						span.title(slot="title") {{item.title}}
				el-menu-item(
					v-else
					:key="submenuItem.url"
					:index="submenuItem.url"
				)
					span.title(slot="title") {{submenuItem.title}}
		el-menu-item(
			v-if="!menuItem.hidden && !menuItem.submenu"
			:index="menuItem.url"
		)
			template(slot="title")
				svg-icon(:name="menuItem.icon")
				span.title {{menuItem.title}}
</template>

<script>
import { mapState } from 'vuex';
import menus from '../../model/menu';

// 只支持二级列表
// 二级列表的汇总菜单不携带链接
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapState('menu', ['menuList']),
    activeIndex() {
      const arr = [];
      menus.forEach((menu) => {
        this.getKeyWords('url', menu, arr);
      });
      // list 页面路由作为命名空间，按照我们的设计规范，下属的编辑/详情页等页面路由，均在此命名空间下定义。如: /menu1、/menu1/edit
      return arr.filter((item) => this.$route.path.indexOf(item) > -1)[0];
    },
  },
  watch: {
    menuList(val) {
      // 异步请求回 menuList 信息后，进行格式化，为每个 menu 添加 menuId。用于父菜单的 :index 匹配
      this.getFormatMenuList(val);
    },
  },
  methods: {
    // 获取所有，菜单对应页面的路由集合（即所有list页的路由集合 => arr）
    getKeyWords(keyType, menuItem, arr) {
      if (menuItem[keyType]) {
        arr.push(menuItem[keyType]);
      } else if (menuItem.submenu) {
        menuItem.submenu.forEach((item) => {
          this.getKeyWords(keyType, item, arr);
        });
      }
    },
    // 为每个菜单添加唯一的 menuId
    getFormatMenuList(menuList, parentId) {
      menuList.forEach((menu, index) => {
        if (parentId) {
          menu.menuId = `${parentId}_${index}`;
        } else {
          // 统一使用字符串类型作为 menuId
          menu.menuId = index + '';
        }
        if (menu.submenu) {
          this.getFormatMenuList(menu.submenu, menu.menuId);
        }
      });
    },
  },
  created() {
    this.getFormatMenuList(this.menuList);
  },
};
</script>

<style lang="less">
#app .p-navSide {
  border-right: none;
}
</style>
