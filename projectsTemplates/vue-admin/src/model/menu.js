const menus = [
  {
    title: '操作过滤',
    icon: 'clock',
    url: '/demo1',
  },
  {
    title: '工具示例',
    icon: 'gear',
    submenu: [
      {
        title: '使用示例',
        url: '/demo2',
      },
    ],
  },
  {
    title: '组件示例',
    icon: 'clock',
    submenu: [
      {
        title: '数据管理',
        icon: 'clock',
        submenu: [
          {
            title: '数据列表',
            url: '/demo3',
          },
        ],
      },
    ],
  },
];

export default menus;
