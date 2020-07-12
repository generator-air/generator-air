// 当多个角色具有部分完全相同的权限，统一定义
const commonAuth = [
  {
    path: '/demo',
    operations: ['create', 'edit'],
  },
];

const dictionary = {
  /**
   * roleId : [{
   * 	path: '/xxx',
   * 	operations: ['aaa', 'bbb', 'ccc']
   * }]
   */
  101: [
    ...commonAuth,
    {
      path: '/demo',
      operations: ['create', 'edit', 'delete'],
    },
    {
      path: '/demo/edit',
      operations: ['create', 'edit'],
    },
    {
      path: '/demo/detail',
      operations: ['delete'],
    },
    {
      path: '/operation',
      operations: ['create', 'edit', 'delete'],
    },
  ],
  102: commonAuth,
};

export default dictionary;
