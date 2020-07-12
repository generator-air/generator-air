// 当多个角色具有部分完全相同的权限，统一定义
const commonAuth = [
  {
    path: '/demo1',
    operations: ['create', 'edit', 'delete'],
  },
  {
    path: '/demo2',
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
      path: '/demo3',
      operations: ['create', 'edit', 'delete'],
    },
    {
      path: '/demo3/edit',
      operations: ['create', 'edit'],
    },
    {
      path: '/demo3/detail',
      operations: ['delete'],
    },
  ],
  102: commonAuth,
  103: [
    ...commonAuth,
    {
      path: '/demo3',
      operations: ['edit'],
    },
  ],
};

export default dictionary;
