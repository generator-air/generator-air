const dictionary = {
  pc_vue: 'https://git.code.tencent.com/generator-air/vue-admin.git',
  pc_react: '',
  h5_vue: '',
  h5_react: '',
  miniprogram_none: '',
  miniprogram_taro: '',
  miniprogram_wepy: '',
  node_koa: '',
  node_express: '',
  component_js: 'https://git.code.tencent.com/generator-air/component-js.git',
  component_vue: '',
  component_react: '',
};

function mapToGit(answers) {
  const { type, framework } = answers;
  return dictionary[`${type}_${framework}`];
}

module.exports = mapToGit;
