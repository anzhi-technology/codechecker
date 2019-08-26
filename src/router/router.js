import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import NotFound from '@/views/errorPage/404';

Vue.use(Router);
Vue.use(NProgress);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      hideInMenu: true,
      alias:"/",
      meta: { title: '登录'},
      component: () => import(/* webpackChunkName: "login" */ '@/views/user/login')
    },
    {
      path: '/sourceCode',
      component: () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout'),
      children: [

        {
          path: '/sourceCode',
          redirect: '/sourceCode/overview'
        },
        {
          path: '/sourceCode',
          name: 'sourceCode',
          index: '1',
          meta: {
            icon: 'sliders',
            affix: true,
            title: '缺陷检测'
          },
          component: {
            render: h => h('router-view')
          },
          children: [
            {
              path: '/sourceCode/overview',
              name: 'overview',
              index: '1-1',
              meta: {title: '项目概览'},
              component: () => import(/* webpackChunkName: "sourceCode" */ '@/views/sourceCode/overview')
            },
            {
              path: '/sourceCode/list',
              name: 'list',
              index: '1-2',
              meta: {title: '项目列表'},
              component: () => import(/* webpackChunkName: "sourceCode" */ '@/views/sourceCode/list')
            },
            {
              path: '/sourceCode/analyzeCode/:parameter',
              name: 'analyzeCode',
              hideInMenu: true,
              meta: {title: '缺陷详情'},
              component: () => import(/* webpackChunkName: "sourceCode" */ '@/views/sourceCode/analyzeCode')
            },
            {
              path: '/sourceCode/add',
              name: 'add',
              hideInMenu: true,
              meta: {title: '添加项目'},
              component: () => import(/* webpackChunkName: "sourceCode" */ '@/views/sourceCode/components/listForm/form')
            },
            {
              path: '/sourceCode/edit/:parameter',
              name: 'edit',
              hideInMenu: true,
              meta: {title: '编辑项目'},
              component: () => import(/* webpackChunkName: "sourceCode" */ '@/views/sourceCode/components/listForm/form')
            },
            {
              path: '/sourceCode/summary/:parameter',
              name: 'summary',
              hideInMenu: true,
              meta: {title: '项目统计'},
              component: () => import(/* webpackChunkName: "sourceCode" */ '@/views/sourceCode/summary')
            },
          ]
        }
      ]
    },
    {
      path: '/system',
      component: () => import(/* webpackChunkName: "layouts" */ '@/layouts/BasicLayout'),
      children: [
        // system
        {
          path: '/system',
          redirect: '/system/user-management'
        },
        {
          path: '/system',
          name: 'system',
          index: '4',
          meta: {
            icon: 'setting',
            title: '系统管理'
          },
          component: {
            render: h => h('router-view')
          },
          children: [
            {
              path: '/system/user-management',
              name: 'userManagement',
              index: '4-1',
              meta: {
                title: '用户管理'
              },
              component: () => import(/* webpackChunkName: "system" */ '@/views/system/user/index')
            },
            {
              path: '/system/role-management',
              name: 'roleManagement',
              index: '4-2',
              meta: {
                title: '角色管理'
              },
              component: () => import(/* webpackChunkName: "system" */ '@/views/system/role/index'),
            },
            {
              path: '/system/menu-management',
              name: 'menuManagement',
              index: '4-3',
              meta: {
                title: '菜单管理'
              },
              component: () => import(/* webpackChunkName: "system" */ '@/views/system/menu/index')
            },
            {
              path: '/system/department-management',
              name: 'departmentManagement',
              index: '4-4',
              meta: {
                title: '部门管理'
              },
              component: () => import(/* webpackChunkName: "system" */ '@/views/system/department/index')
            },
            {
              path: '/system/post-management',
              name: 'postManagement',
              index: '4-5',
              meta: {
                title: '岗位管理'
              },
              component: () => import('@/views/system/post/index')
            },
          ]
        }
      ]
    },
    {
      path: '*',
      name: '404',
      hideInMenu: true,
      component: NotFound
    },
  ]
});

router.beforeEach((to, form, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
