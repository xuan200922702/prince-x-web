// const BASE_URL = 'http://localhost:8080' your service base url
//const BASE_URL = 'http://127.0.0.1:8000' // mock base url
//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GET_CODE: `${BASE_URL}/api/v1/getCaptcha`,
  LOGIN: `${BASE_URL}/login`,
  GET_INFO: `${BASE_URL}/api/v1/getinfo`,
  //根据角色获取菜单id
  GET_MENUID: `${BASE_URL}/api/v1/menuids`,
  LOGOUT: `${BASE_URL}/api/v1/logout`,
  //princeUserList获取用户列表
  PRINCE_USER_LIST: `${BASE_URL}/api/v1/princeUserList`,
  //新建用户
  CREATE_PRINCE_USER: `${BASE_URL}/api/v1/princeUser`,
  //更新用户
  UPDATE_PRINCE_USER: `${BASE_URL}/api/v1/princeUser`,
  //删除用户
  DELETE_PRINCE_USER: `${BASE_URL}/api/v1/princeUser`,
  //更新密码
  UPDATE_PASSWORD:`${BASE_URL}/api/v1/user/pwd`,
  //rolelist 获取角色列表
  ROLE_LIST: `${BASE_URL}/api/v1/rolelist`,
  //获取角色数据 /princeRole
  PRINCE_ROLE: `${BASE_URL}/api/v1/princeRole`,
  //新建角色
  CREATE_PRINCE_ROLE: `${BASE_URL}/api/v1/princeRole`,
  //修改角色
  UPDATE_PRINCE_ROLE: `${BASE_URL}/api/v1/princeRole`,
  //删除角色
  DELETE_PRINCE_ROLE: `${BASE_URL}/api/v1/princeRole`,
  //创建部门
  CREATE_PRINCE_DEPT: `${BASE_URL}/api/v1/dept`,
  //deptTree 获取部门列表
  DEPT_TREE: `${BASE_URL}/api/v1/deptTree`,
  //menulist 获取菜单列表
  MENU_LIST: `${BASE_URL}/api/v1/menulist`,
  //deptList 获取部门列表
  DEPT_LIST: `${BASE_URL}/api/v1/deptList`
}
