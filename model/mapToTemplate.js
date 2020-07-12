const dictionary = {
  pc_vue: 'vue-admin',
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
  component_react: '',
};

function mapToTemplate(answers) {
  const { type, framework } = answers;
  return dictionary[`${type}_${framework}`];
}

module.exports = mapToTemplate;
