/**
 * @description 系统全局配置
 */
export default {
  /*api url 前缀*/
  adminPrefix:"/admin",

  /*分页器的配置*/
  pagination: {
    pageSize: 10,// 默认每页显示数量
    showSizeChanger: true,// 显示可改变每页数量
    pageSizeOptions: ['5', '10', '20', '30', '50'],
    showTotal: total => `总共 ${total} 条记录`,
    showSizeChange: (current, pageSize) => this.pageSize = pageSize, // 改变每页数量时更新显示
  },
}