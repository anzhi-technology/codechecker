import BasicLayout from "@/layouts/BasicLayout";


/**
 * 将菜单与动态的路由做匹配
 * */
export const filterAsyncRouter = (menuData) => {
  return transData(menuData);
};

//递归数据
const transData = (data) => {
  let routers = [];
  data.forEach(obj => {
    let object = {};
    if (obj.parentId === 0) {
      object = {
        name: obj.menuName,
        path: obj.url,
        index: obj.menuId,
        component: BasicLayout,
        meta: {icon: obj.icon, title: obj.menuName},
        children: []
      }
    } else {
      if (obj.children.length === 0) {
        object = {
          name: obj.menuName,
          path: obj.url,
          index: obj.menuId,
          component: () => import(`@/views${obj.url}`),
          meta: {title: obj.menuName},
          children: []
        }
      } else {
        object = {
          name: obj.menuName,
          path: obj.url,
          index: obj.menuId,
          component: () => import('@/layouts/contentLayout'),
          meta: {title: obj.menuName},
          children: []
        }
      }
    }
    if (obj.children) object.children = transData(obj.children);
    routers.push(object);
  });
  return routers;
};
