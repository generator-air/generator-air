const menus = [
  {
    title: '页面示例',
    icon: 'gear',
    submenu: [
      {
        title: '列表页',
        url: '/demo',
      },
    ],
  },
  {
    title: '日志示例',
    icon: 'clock',
    submenu: [
      {
        title: '日志管理',
        icon: 'clock',
        submenu: [
          {
            title: '日志页',
            url: '/log',
          },
        ],
      },
    ],
  },
  {
    title: '操作过滤',
    icon: 'clock',
    url: '/operation',
  },
];

export default menus;
