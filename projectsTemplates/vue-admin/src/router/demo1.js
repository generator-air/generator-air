const pages_demo1_list = () => import('pages/demo1/list.vue');

const routerList = [
  {
    path: '/demo1',
    component: pages_demo1_list,
  },
];

export default routerList;
