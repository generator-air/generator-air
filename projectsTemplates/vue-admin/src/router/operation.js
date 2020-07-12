const pages_operation_index = () => import('pages/operation/index.vue');

const routerList = [
  {
    path: '/operation',
    component: pages_operation_index,
  },
];

export default routerList;
