import {LOGIN, GET_CODE,ROLE_LIST, GET_INFO,PRINCE_USER_LIST,CREATE_PRINCE_USER,UPDATE_PRINCE_USER,DELETE_PRINCE_USER,UPDATE_PASSWORD,DEPT_TREE,LOGOUT} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
async function login( username, password,code,uuid) {
  return request(LOGIN, METHOD.POST, {
    username: username,
    password: password,
    code: code,
    uuid: uuid,
  })
}


async function createprinceuser(object) {
    return request(CREATE_PRINCE_USER, METHOD.POST, object
    )
}

async function updateprinceuser(object) {
    return request(`${UPDATE_PRINCE_USER}`, METHOD.PUT,
        object
    )
}

async function deleteprinceuser(object) {
    return request(`${DELETE_PRINCE_USER}/${object.userId}`, METHOD.DELETE,
        object
    )
}

async function getcode(id, data) {
    return request(GET_CODE, METHOD.GET, {
        id: id,
        data: data,
    })
}

async function getinfo(data) {
    return request(GET_INFO, METHOD.GET, {
        data: data,
    })
}

async function princeuserlist(pageIndex,pageSize,userName,phone,status,) {
    return request(PRINCE_USER_LIST, METHOD.GET, {
        pageIndex,
        pageSize,
        userName,
        phone,
        status,

    })
}

async function deptTree(data) {
    return request(DEPT_TREE, METHOD.GET, {
        data:data
    })
}
async function rolelist(pageIndex,pageSize,roleName,roleKey,status) {
    return request(ROLE_LIST, METHOD.GET, {
        pageIndex,
        pageSize,
        roleName,
        roleKey,
        status
    })
}



async function updatepwd(object) {
    return request(`${UPDATE_PASSWORD}`, METHOD.PUT,
        object
    )
}
async function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
  return request(LOGOUT, METHOD.POST)
}

export {login,getcode,getinfo,princeuserlist,deptTree,rolelist,createprinceuser,updateprinceuser,deleteprinceuser,updatepwd,logout}
