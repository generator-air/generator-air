const dictionary = {
	pc_vue: 'http://git.code.oa.com/fajg-fe/vue-admin-simple.git',
	// pc_vue_self: 'http://git.code.oa.com/fajg-fe/vue-admin-login.git',
	pc_react: '',
	h5_vue: '',
	h5_react: '',
	miniprogram_none: '',
	miniprogram_taro: '',
	miniprogram_wepy: '',
	node_koa: '',
	node_express: '',
	component_js: '',
	component_vue: '',
	component_react: ''
};

function mapToGit(answers) {
	const { type, framework } = answers;
	return dictionary[`${type}_${framework}`];
}

module.exports = mapToGit;
