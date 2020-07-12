<template>
  <div class="u-style u-table-filter v-filter">
    <el-form :inline="true" label-position="left">
      <slot :query="query" :change="onChange" />
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    channel: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      logger: 'components/list/filter',
      query: {},
    };
  },
  watch: {
    $route() {
      this.update();
    },
  },
  methods: {
    update() {
      const query = this.$route.query;
      const keys = Object.keys(query);
      if (keys.length > 0) {
        keys.forEach((key) => {
          let val = query[key];
          this.$set(this.query, key, val);
        });
      }
    },
    onChange() {
      let query = Object.assign({}, this.query);
      query.page = 1;
      this.setQuery(query);
    },
    // 供外部使用，配置同步路由的过滤参数
    setFilter(key, val) {
      let query = Object.assign({}, this.query);
      query[key] = val;
      query.page = 1;
      this.setQuery(query);
    },
    setQuery(query) {
      query = Object.assign({}, this.$route.query, query);
      this.$router.push({
        query,
      });
    },
  },
};
</script>
