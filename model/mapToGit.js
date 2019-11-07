const dictionary = {
	pc_vue: 'http://git.code.oa.com/fajg-fe/vue-admin.git',
	pc_react: '',
	h5_vue: '',
	h5_react: '',
	miniprogram_none: '',
	miniprogram_taro: '',
	miniprogram_wepy: ''
};

function mapToGit(projectType, framework) {
	return dictionary[`${projectType}_${framework}`];
}

module.exports = mapToGit;
