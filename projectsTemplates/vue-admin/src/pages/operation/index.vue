<template lang="pug">
	.p-page
		.title 页面操作过滤demo
		.buttons
			//- 这里读取的字段，取决于 authDict.js 内的定义
			el-button(v-if="operations.includes('create')") 创建
			el-button(v-if="operations.includes('edit')") 编辑
			el-button(v-if="operations.includes('delete')") 删除
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['auth']),
  },
  data() {
    return {
      operations: [],
    };
  },
  methods: {},
  mounted() {
    this.operations = this.auth.getPageOperations(this.$route.path);
  },
};
</script>

<style lang="less">
.p-page {
  .title {
    margin-bottom: 20px;
  }
}
</style>
