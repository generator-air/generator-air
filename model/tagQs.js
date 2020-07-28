const getTagQs = (tags) => [
  {
    type: 'list',
    name: 'version',
    message: '请选择您要使用的模板版本',
    choices: [
      {
        name: '最新版本',
        value: 'latest',
      },
      ...tags.reverse().map((tag) => ({
        name: tag,
        value: tag,
      })),
    ],
  },
];

module.exports = getTagQs;
