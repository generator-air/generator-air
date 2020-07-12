const template = `
<template lang="pug">
	.l-content.p-detail
		.l-content-title
			el-breadcrumb
				router-link(:to="'/demo3'")
					el-breadcrumb-item 一级菜单
					el-breadcrumb-item $pageName$
			.display-block
				h1.header-title $pageName$
			.p-demo-info
				mixin detailRow (title, content)
					.detail-row
						.detail-title #{title}：
						if block
							block
				.p-demo-info-head
					h3 数据信息
				.p-demo-info-content
					+detailRow('简称')
						.detail-content {{form.brief}}
					+detailRow('全称')
						.detail-content {{form.full}}
					+detailRow('含义')
						.detail-content {{form.mean}}
					+detailRow('备注')
						.detail-content {{form.tips}}

</template>

<script>
import $api from '@/model/api'

export default {
	components: {},
	computed: {},
	data() {
			return {
					qid: '',
					form: {
							brief: '',
							full: '',
							mean: '',
							tips: ''
					}
			}
	},
	methods: {
			// 根据id查询
			searchId(id) {
					return this.$get($api.getDetail, { id })
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
			init() {
					// 从列表页进入已创建的数据，路由带id
					this.qid = this.$route.query.id
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
	.p-detail{
		.display-block {
			display: flex;
			justify-content: flex-start;
			margin-bottom: 20px;
		}
		.p-demo-info{
			background-color: #fff;
			.p-demo-info-head{
				margin-bottom: 30px;
				display: flex;
				height: 50px;
				justify-content: space-between;
				align-items: center;
				h3{
					margin: 0;
				}
			}
			.p-demo-info-content{
				font-size: 14px;
				color: #333;
				.detail-row{
					margin-bottom: 15px;
					margin-left: 0;
					display: flex;
				}
				.detail-title{
					flex-shrink: 0;
					width: 150px;
					text-align: right;
				}
				.detail-content{
					a{
						margin-left: 10px;
					}
				}
			}
		}
	}
</style>
`;

module.exports = template;
