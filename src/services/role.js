import {METHOD, request} from "@/utils/request";
import {
    CREATE_PRINCE_ROLE,
    DELETE_PRINCE_ROLE,
    MENU_LIST,
    DEPT_LIST,
    CREATE_PRINCE_DEPT,
    UPDATE_PRINCE_ROLE,
    GET_MENUID,
    PRINCE_ROLE
} from "@/services/api";


async function createprincerole(object) {
    return request(CREATE_PRINCE_ROLE, METHOD.POST, object
    )
}
async function getmenuid(object) {
    return request(GET_MENUID, METHOD.GET,object
    )
}

async function createprincedept(object) {
    return request(CREATE_PRINCE_DEPT, METHOD.POST, object
    )
}
async function princemenulist(menuName,status) {
    return request(MENU_LIST, METHOD.GET, {
        menuName,
        status
    })
}
async function princedeptlist(deptName,status) {
    return request(DEPT_LIST, METHOD.GET, {
        deptName,
        status
    })
}
async function updateprincerole(object) {
    return request(`${UPDATE_PRINCE_ROLE}`, METHOD.PUT,
        object
    )
}

async function deleteprincerole(object) {
    return request(`${DELETE_PRINCE_ROLE}/${object.roleId}`, METHOD.DELETE,
        object
    )
}

async function geteprincerole(object) {
    return request(`${PRINCE_ROLE}/${object.roleId}`, METHOD.GET,
        object
    )
}

export {createprincerole,updateprincerole,princemenulist,deleteprincerole,princedeptlist,createprincedept,getmenuid,geteprincerole}