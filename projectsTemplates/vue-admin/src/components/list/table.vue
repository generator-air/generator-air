<template>
  <div class="u-style u-table v-table">
    <el-table
      :data="list"
      :ref="withCheckbox ? 'multipleTable' : ''"
      :tooltip-effect="withCheckbox ? 'dark' : ''"
      style="width: 100%;"
      @data-format="dataFormat"
      @selection-change="onSelectionChange"
    >
      <slot />
    </el-table>
  </div>
</template>

<script>
import $lodash from 'lodash';

export default {
  props: {
    channel: {
      type: String,
      default: '',
    },
    api: {
      type: String,
      default: '',
    },
    withCheckbox: {
      type: Boolean,
      default: true,
    },
    onSelectionChange: {
      type: Function,
      default: () => true,
    },
    // 对数据进行格式化
    dataFormat: {
      type: Function,
      default: (value) => value,
    },
  },
  data() {
    return {
      logger: 'components/list/table',
      list: [],
    };
  },
  watch: {
    $route() {
      this.update();
    },
  },
  methods: {
    checkUpdate(info) {
      let path = this.$route.path;
      if (info && path === info.path && this.channel === info.channel) {
        this.update();
      }
    },
    getList() {
      return this.list;
    },
    find(fn) {
      return $lodash.find(this.list, fn);
    },
    // 填充数据
    fill(rs, path, channel) {
      if (rs) {
        rs = this.dataFormat(rs);
        let data = {};
        data.response = rs;
        data.list = rs.list;
        data.total = rs.total;
        data.page = rs.page;
        data.size = rs.limit;
        data.path = path;
        data.channel = channel;
        this.list = data.list;
        this.$emit('change', data);
        this.$bus.emit('list-changed', data);
      }
      return rs;
    },
    // 网络请求
    async update() {
      let api = this.api;
      let query = this.$route.query;
      let path = this.$route.path;
      let channel = this.channel;
      const rs = await this.$get(api, query);
      if (rs && rs.data) {
        this.fill(rs.data, path, channel);
      }
    },
  },
  mounted() {
    this.update();
    this.$bus.on('list-update', this.checkUpdate);
  },
  destroyed() {
    this.$bus.off('list-update', this.checkUpdate);
  },
};
</script>
