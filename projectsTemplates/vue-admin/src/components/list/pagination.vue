<template>
  <div class="u-style u-pagination v-pagination" v-if="total !== 0">
    <el-pagination
      layout="total, sizes, prev, pager, next"
      :current-page="page"
      :total="total"
      :page-size="size"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
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
      logger: 'components/list/pagination',
      query: {},
      page: 1,
      total: 0,
      size: 10,
    };
  },
  methods: {
    sizeChange(size) {
      this.$emit('size-change', size);
      this.setQuery({
        limit: size,
      });
    },
    pageChange(page) {
      this.$emit('current-change', page);
      this.setQuery({
        page,
      });
    },
    setQuery(query) {
      query = Object.assign({}, this.$route.query, query);
      this.$router.push({
        query,
      });
    },
    update(rs) {
      let path = this.$route.path;
      let channel = this.channel;
      // 校验列表一致性
      if (rs && path === rs.path && channel === rs.channel) {
        this.total = rs.total;
        this.page = rs.page;
        this.size = rs.size;
      }
    },
  },
  mounted() {
    this.$bus.on('list-changed', this.update);
  },
  destroyed() {
    this.$bus.off('list-changed', this.update);
  },
};
</script>
