import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'workplace',
              name: '工作台',
              meta: {
                icon: 'aliwangwang'
              },
              component: () => import('@/pages/dashboard/workplace/WorkPlace'),
            },
          ]
        },
        {
          path: 'system',
          name: '系统管理',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [
            {
              path: 'users',
              name: '用户管理',
              meta: {
                icon: 'user'
              },
              component: () => import('@/pages/system/users/Users'),
            },
            {
              path: 'roles',
              name: '角色管理',
              meta: {
                 icon: 'team'
              },
              component: () => import('@/pages/system/roles/Roles'),
            },
            {
              path: 'dept',
              name: '部门管理',
              meta: {
                icon: 'apartment'
              },
              component: () => import('@/pages/system/depts/Dept'),
            },
            {
              path: 'menu',
              name: '菜单管理',
              meta: {
                icon: 'apartment'
              },
              component: () => import('@/pages/system/menus/Menu'),
            },
          ]
        },
        {
          path: 'logs',
          name: '日志管理',
          meta: {
            icon: 'file'
          },
          component: PageView,
          children: [
            {
              path: 'loglogin',
              name: '登录日志',
              meta: {
                icon: 'file-text'
              },
              component: () => import('@/pages/logs/loglogin/Loglogin'),
            },
          ]
        },
        {
          path: 'demo',
          name: '演示页',
          meta: {
            icon: 'file-ppt'
          },
          component: () => import('@/pages/demo')
        },
        {
          path: 'parent1',
          name: '父级路由1',
          meta: {
            icon: 'dashboard',
          },
          component: BlankView,
          children: [
            {
              path: 'demo1',
              name: '演示页面1',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'parent2',
          name: '父级路由2',
          meta: {
            icon: 'form'
          },
          component: PageView,
          children: [
            {
              path: 'demo2',
              name: '演示页面2',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'exception',
          name: '异常页',
          meta: {
            icon: 'warning',
          },
          component: BlankView,
          children: [
            {
              path: '404',
              name: '找不到页面',
              component: () => import('@/pages/exception/404')
            },
            {
              path: '403',
              name: 'Exp403',
              component: () => import('@/pages/exception/403')
            },
            {
              path: '500',
              name: 'Exp500',
              component: () => import('@/pages/exception/500')
            }
          ]
        },
        {
          name: '验权页面',
          path: 'auth/demo',
          meta: {
            icon: 'file-ppt',
            authority: {
              permission: 'form',
              role: 'manager'
            },
            component: () => import('@/pages/demo')
          }
        }
      ]
    }
  ]
}

export default options
