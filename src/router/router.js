//import router from '@/router/constantRouter'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {filterAsyncRouter} from '@/router/asyncRouter'
import {getRoleMenu} from '@/api/system/menu';
import {setObjArr, getObjArr,removeObjArr} from '@/utils/auth'

NProgress.configure({showSpinner: false});// NProgress Configuration

import Vue from 'vue'
import Router from 'vue-router'
import {createRouter} from '@/router/constantRouter'

Vue.use(Router);

let router = createRouter();


let asyncRouterMaps = [];//用来获取后台拿到的路由
/**
 * 导航守卫
 * */
router.beforeEach((to, form, next) => {
  NProgress.start();
  if(!getObjArr('router')) {
    asyncRouterMaps = [];
  }
  if (asyncRouterMaps.length === 0) {//不加这个判断，路由会陷入死循环
    if (to.path === '/login'|| to.path === '/') { //不加这个判断，退出登录后 在输入地址会死循环
      removeObjArr();
      next();
    } else {
      if (!getObjArr('router')) {
        getRoleMenu().then(res => {
          asyncRouterMaps = res;//后台拿到路由
          setObjArr('router', asyncRouterMaps); //存储路由到localStorage
          addMenus(to, next)//执行路由跳转方法
        })
      } else {//从localStorage拿到了路由
        asyncRouterMaps = getObjArr('router');//拿到路由
        addMenus(to, next)
      }
    }
  } else {
    next();
  }
});

/**
 * 动态加载路由
 * */
export const addMenus = (to, next) => {
  asyncRouterMaps = filterAsyncRouter(asyncRouterMaps);
  asyncRouterMaps.forEach((route) => {
    router.options.routes.push(route)
  });
  router.addRoutes(asyncRouterMaps);
  next({...to, replace: true});// hack方法 确保addRoutes已完成
};




router.afterEach(() => {
  NProgress.done() // finish progress bar
});

export default router;