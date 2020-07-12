const template = `
<template lang="pug">
	.l-content.p-edit
		.l-content-title
			el-breadcrumb
				router-link(:to="'/demo3'")
					el-breadcrumb-item 一级菜单
					el-breadcrumb-item $pageName$
			.display-block
				h1.header-title {{qid ? '编辑' : '创建'}}页
		.display-block
				el-form(
					:inline="true"
					label-position="left"
					:model="form"
					:rules="rules"
					ref="form"
				)
					.filter-block
						el-form-item(label="数据缩写:" prop="brief")
							el-input(
								v-model="form.brief"
								size="small"
								style="width: 480px"
								placeholder="请输入数据缩写"
							)
					.filter-block
						el-form-item(label="数据全称:" prop="full")
							el-input(
								v-model="form.full"
								size="small"
								style="width: 480px"
								placeholder="请输入数据全称"
							)
					.filter-block
						el-form-item(label="数据含义:" prop="mean")
							el-input(
								v-model="form.mean"
								size="small"
								style="width: 480px"
								placeholder="请输入数据含义"
							)
					.filter-block
						el-form-item(label="数据备注:" prop="tips")
							el-input(
								v-model="form.tips"
								size="small"
								placeholder="请输入数据备注"
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 100}"
							)
					el-button(
						type="primary"
						size="large"
						plain
						@click="check('form')"
					) 提交
					el-button(
						type="danger"
						plain
						@click="clear"
					) 清空

</template>

<script>
import $search from '@/components/list/search'
import $filter from '@/components/list/filter'
import $date from '@/util/date'
import $api from '@/model/api'

export default {
	components: {
			'v-search': $search,
			'v-filter': $filter,
	},
	computed: {},
	data() {
			return {
					type: '',
					qid: '',
					list: {},
					showUpload: false,
					form: {
							brief: '',
							full: '',
							mean: '',
							tips: ''
					},
					rules: {
							brief: [
									{ required: true, message: '请输入数据缩写', trigger: 'blur' },
									{ min: 1, message: '长度不少于1个汉字', trigger: 'blur' },
									{ max: 50, message: '长度不超过50个汉字', trigger: 'blur' }
							],
							full: [
									{ required: true, message: '请输入数据全称', trigger: 'blur' },
									{ min: 1, message: '长度不少于1个汉字', trigger: 'blur' },
									{ max: 50, message: '长度不超过50个汉字', trigger: 'blur' }
							],
							mean: [
									{ required: true, message: '请输入数据含义', trigger: 'blur' },
									{ min: 1, message: '长度不少于1个汉字', trigger: 'blur' },
									{ max: 200, message: '长度不超过200个汉字', trigger: 'blur' }
							],
							tips: [
									{ required: true, message: '请输入数据备注', trigger: 'blur' },
									{ min: 1, message: '长度不少于1个汉字', trigger: 'blur' },
									{ max: 200, message: '长度不超过200个汉字', trigger: 'blur' }
							]
					}
			}
	},
	methods: {
			dateFormat(time) {
					return $date.formatSec(time)
			},
			// 根据id查询
			searchId(id) {
					return this.$get($api.getDetail, { id })
			},
			// 新增词条
			addInfo(para) {
					return this.$post($api.add, para)
			},
			// 更新词条
		 updateInfo(para) {
				return  this.$post($api.update, para)
			},
			// 数据获取
			async getList() {
					this.id = this.qid
					const { data } = await this.searchId(this.id)
					if (data) {
							this.form = Object.assign(this.form, data)
							this.form.brief = data.brief
							this.form.full = data.full
							this.form.mean = data.mean
							this.form.tips = data.tips
					}
			},
			async submitForm() {
					const para = Object.assign({}, this.form)
					if (this.qid) {
							para.id = this.qid
							const rs = await this.updateInfo(para)
							if (rs) {
									this.$router.push({ path: '/demo3' })
							}
					} else {
							const rs = await this.addInfo(para)
							if (rs) {
									this.$router.push({ path: '/demo3' })
							}
					}
			},
			// 提交
			check(formName) {
					this.$refs[formName].validate(valid => {
							// 数据外表单项验证通过
							if (valid) {
									this.confirm('确认提交？', this.submitForm)
									return true
							}
							return false
					})
			},
			// 清空输入，包括拖拽空间
			clear() {
					// 重置表单数据
					this.$refs.form.resetFields()
			},
			// 弹窗提示
			confirm(confirmText, operation) {
					this.$confirm(confirmText, '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
					}).then(() => {
							operation()
					}).catch(() => {
					})
			},
			init() {
					// 从列表页进入已创建的数据，路由带id
					this.qid = this.$route.query.id
					this.showUpload = !this.qid
					if (this.qid) {
							this.getList()
					}
			}
	},
	mounted() {
			this.init()
	}
}
</script>

<style lang="less">
	.p-edit {
		.el-form-item__label {
			min-width: 120px;
			text-align: right;
			padding-right: 30px;
		}

		.header-button {
			display: flex;
		}
		.display-block {
			display: flex;
			justify-content: flex-start;
			margin-bottom: 20px;
		}
	}
</style>
`;

module.exports = template;
