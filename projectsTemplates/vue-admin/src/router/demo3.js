const pages_demo3_detail = () => import('pages/demo3/detail.vue');
const pages_demo3_edit = () => import('pages/demo3/edit.vue');
const pages_demo3_list = () => import('pages/demo3/list.vue');

const routerList = [
  {
    path: '/demo3/detail',
    component: pages_demo3_detail,
  },
  {
    path: '/demo3/edit',
    component: pages_demo3_edit,
  },
  {
    path: '/demo3',
    component: pages_demo3_list,
  },
];

export default routerList;
