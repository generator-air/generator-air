<template lang="pug">
	.p-list
		.l-content-title
			el-breadcrumb
				el-breadcrumb-item 组件示例
				el-breadcrumb-item 数据管理
			.display-block
				h1.header-title 数据列表
		.display-block
			v-search(
				ref="search"
				label="数据编号："
				name="search"
				placeholder="请输入"
				:value="searchValue"
			)
			v-filter(
				ref="filter"
			)
				template(v-slot="{ query, change }")
					el-form-item(label="状态：")
						el-select(
							v-model="query.state"
							size="small"
							placeholder="请选择"
							style="width: 120px"
							@change="change"
						)
							el-option(
								v-for="item in stateOptions"
								:label="item.label"
								:key="item.label"
								:value="item.id"
							)
			.header-aside
				el-button.u-button(
					type="primary"
					size="large"
					@click="search"
				) 查询
				el-button.u-button.btn-filter(
					size="large"
					@click="reset"
				) 重置
		.u-button-group
			el-button.u-button(
				type="primary"
				icon="el-icon-plus"
				size="large"
				@click="create()"
			) 新建
			el-dropdown(@command="batchHandler" trigger="click")
				el-button( type="primary" :disabled="operations.length === 0 ? true : false") 批量操作
					i.el-icon-arrow-down.el-icon--right
				el-dropdown-menu(slot="dropdown")
					el-dropdown-item(v-for="operation in operations" :command="operation.method" :key="operation.id") {{operation.label}}
		.u-tip
			span.tip-item 已选择 {{this.selectCount}} 项
			span.tip-item  总计：{{this.total}} 条
		v-table(
			:api="api"
			ref="list"
			@change="onListChange"
			:onSelectionChange="selectionChangeHandler"
		)
			el-table-column(
				type="selection"
				width="55"
			)
			el-table-column(
				prop="id"
				label="名词编号"
				width="100"
				sortable
			)
			el-table-column(
				prop="brief"
				label="缩写"
				width="100"
				sortable
			)
			el-table-column(
				prop="full"
				label="全称"
				min-width="55"
			)
			el-table-column(
				prop="mean"
				label="含义"
				min-width="55"
			)
			el-table-column(
				prop="tips"
				label="备注"
				min-width="200"
			)
			el-table-column(
				label="操作"
				width="180"
			)
				template(v-slot="{ row }")
					el-button.op-button(
						type="success"
						size="small"
						@click="edit(row)"
					) 编辑
					el-button.op-button(
						type="primary"
						size="small"
						@click="detail(row)"
					) 详情

		v-pagination
</template>

<script>
import { mapState } from 'vuex';
import $search from '@/components/list/search';
import $filter from '@/components/list/filter';
import $pagination from '@/components/list/pagination';
import $table from '@/components/list/table';
import $api from '@/model/api';

export default {
  // 注入页面刷新功能（定义见layout）
  inject: ['reload'],
  components: {
    'v-search': $search,
    'v-filter': $filter,
    'v-table': $table,
    'v-pagination': $pagination,
  },
  watch: {
    $route() {
      this.init();
    },
  },
  computed: {
    ...mapState('user', {
      auth: (state) => state.auth,
    }),
  },
  data() {
    return {
      type: '',
      id: 1,
      selectCount: 0,
      selectRead: 0,
      api: $api.getList,
      stateOptions: [
        {
          id: '',
          label: '全部',
        },
        {
          id: '1',
          label: '待提交',
        },
        {
          id: '2',
          label: '已提交',
        },
      ],
      operations: [],
      tableSelections: [],
      searchValue: '',
      total: 0,
      page: 0,
      limit: 5,
    };
  },
  methods: {
    // 查询
    search() {
      this.$refs.search.search();
    },
    // 重置
    reset() {
      this.$refs.search.clear();
      this.$router.push({ path: this.$route.path });
    },
    // 新建
    create() {
      this.$router.push({ path: '/demo3/edit' });
    },
    // 编辑
    edit(row) {
      this.$router.push({ path: '/demo3/edit', query: { id: row.id } });
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/demo3/detail', query: { id: row.id } });
    },
    // 提交
    async submit(row) {
      this.operationHandler(row, 'submit');
      // 页面刷新 demo
      this.reload();
    },
    // 提交时触发
    operationHandler(row, operation) {
      let confirmText = '';
      let messageText = '';
      if (operation === 'submit') {
        confirmText = '确认要提交选中项？';
        messageText = '选中项已提交';
      }
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let rs = {};
        const para = {
          id: row.id,
        };
        if (operation === 'submit') {
          rs = await this.$post('/batch', para);
        }
        if (rs) {
          this.$message({
            type: 'success',
            message: messageText,
          });
          // 刷新列表
          this.$refs.list.update();
        } else {
          this.$message.error('提交失败');
        }
      });
    },
    // 全选提交
    batchHandler(command) {
      let operationName = '';
      let confirmText = '';
      let messageText = '';
      const ids = [];
      // 操作名称确认
      if (command.name.includes('submit')) {
        operationName = 'submit';
        confirmText = '确认要批量提交？';
        messageText = '已批量提交';
      }
      // 操作数据id整合
      this.tableSelections.forEach((item) => {
        ids.push(item.id);
      });
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let rs = {};
        const para = {
          operation: operationName,
          id_list: ids,
        };
        if (operationName === 'submit') {
          rs = await this.$post($api.batch, para).catch((err) => {
            console.error(err);
          });
        }
        if (rs) {
          this.$message({
            type: 'success',
            message: messageText,
          });
          // 刷新列表
          this.$refs.list.update();
        } else {
          this.$message.error('提交失败');
        }
      });
    },
    // 列表选中项变更
    selectionChangeHandler(val) {
      let countCommandOne = 0;
      this.selectCount = val.length;
      // 没有选中时清空一下数据
      let selectRead = 0;
      val.forEach((item) => {
        if (item.id) {
          // 操作命令
          ++countCommandOne;
        }
        selectRead += item.id;
      });
      if (val.length > 0) {
        if (countCommandOne === val.length) {
          this.operations = [
            { id: 'submit', method: this.submit, label: '批量提交' },
          ];
        } else {
          this.operations = [];
        }
      } else {
        this.operations = [];
      }
      this.tableSelections = val;
      this.selectRead = selectRead / 10000;
    },
    // 列表数据变更
    onListChange(rs) {
      if (rs) {
        this.total = rs.total;
      }
    },
    init() {
      // 搜索项回显
      this.searchValue = this.$route.query.search;
    },
  },
  // 当前list页面挂载前赋值this.api，保证table挂载时拿到指定的api
  created() {
    this.init();
  },
  mounted() {
    // 过滤项回显。mounted前无法通过 this.$refs 访问组件
    this.$refs.filter.update();
  },
};
</script>

<style lang="less" scoped>
.p-list {
  // 覆盖 el-ui 的默认样式（后面的元素会给一个 margin-left）
  tbody button.el-button {
    margin: 5px;
  }
  .u-button-group {
    line-height: 80px;

    .u-button {
      margin-right: 10px;
      height: 100%;
    }
  }

  .u-pagination {
    margin: 0 auto;
    text-align: center;
  }

  .u-table {
    margin: 30px 0;
  }

  .u-table-filter {
    .filter-block {
      overflow: hidden;
    }

    .el-form-item {
      margin-right: 30px;
      margin-bottom: 6px;
    }
  }

  .display-block {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;

    .header-title,
    .header-subtitle {
      flex: 0 0 auto;
      margin: 0 10px 0 0;
      padding: 0;
      line-height: 40px;
      font-size: 20px;
    }

    .header-aside {
      display: flex;
      flex: 1 0 auto;
      justify-content: flex-end;
    }
  }
}
</style>
