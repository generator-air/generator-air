const pages_log_index = () => import('pages/log/index.vue');

const routerList = [
  {
    path: '/log',
    component: pages_log_index,
  },
];

export default routerList;
