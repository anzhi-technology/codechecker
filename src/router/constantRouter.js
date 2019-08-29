import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);


export const constantRouterMap = [
  {
    path: '/login',
    hideInMenu: true,
    meta: { title: '登录'},
    alias: '/',
    component: () => import(/* webpackChunkName: "login" */ '@/views/user/login')
  },
];

export const buttonRouter = [
  {
    path: '/system/button/',
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "layouts" */ '@/layouts/BasicLayout'),
    children: [
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
        name: 'sourceCodeSummary',
        hideInMenu: true,
        meta: {title: '项目统计'},
        component: () => import(/* webpackChunkName: "sourceCode" */ '@/views/sourceCode/summary')
      },
      {
        path: '/dependence/summary/:parameter',
        name: 'dependenceSummary',
        hideInMenu: true,
        meta: {title: '依赖统计'},
        component: () => import(/* webpackChunkName: "sourceCode" */ '@/views/dependence/summary')
      },
      {
        path: '/system/user/add',
        name: 'addUser',
        meta: {
          title: '用户添加'
        },
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/user/components/Add')
      },
      {
        path: '/system/user/edit/:parameter',
        name: 'editUser',
        meta: {
          title: '用户编辑'
        },
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/user/components/Edit')
      },
      {
        path: '/system/allocate-users/:parameter',
        name: '分配用户',
        meta: {title: '分配用户'},
        component: () => import('@/views/system/role/components/allocateUsers')
      },
      {
        path: '/system/dictData/:parameter',
        name: '字典数据',
        meta: {title: '字典数据'},
        component: () => import('@/views/system/dict/components/dictData')
      }
    ]
  },
];

export const createRouter = () => new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRouterMap.concat(buttonRouter)
});






