const template = `
<template lang="pug">
	.p-$pageName$ $pageName$ 页面初始化
</template>

<script>

export default {
	data() {
		return {}
	},
	methods: {

	},
	mounted() {

	}
}
</script>

<style lang="less">
.p-$pageName$ {

}
</style>
`;

module.exports = template;
