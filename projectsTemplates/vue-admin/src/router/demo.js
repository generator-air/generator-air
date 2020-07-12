const pages_demo_detail = () => import('pages/demo/detail.vue');
const pages_demo_edit = () => import('pages/demo/edit.vue');
const pages_demo_index = () => import('pages/demo/index.vue');

const routerList = [
  {
    path: '/demo/detail',
    component: pages_demo_detail,
  },
  {
    path: '/demo/edit',
    component: pages_demo_edit,
  },
  {
    path: '/demo',
    component: pages_demo_index,
  },
];

export default routerList;
