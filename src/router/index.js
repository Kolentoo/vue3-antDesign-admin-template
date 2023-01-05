import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true,
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: {
      title: '首页',
      icon: 'home-4-line',
      affix: true,
      permission: '/agentManagement',
    },
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/index'),
        meta: {
          title: '首页',
          icon: 'home-4-line',
          affix: true,
          permission: '/agentManagement',
        },
      },
    ],
  },
  {
    path: '/vab',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '组件',
      icon: 'apps-line',
      permission: '/agentManagement',
    },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/vab/table'),
        meta: {
          title: '表格',
          icon: 'table-2',
          permission: '/agentManagement',
        },
      },
      {
        path: 'icon',
        name: 'Icon',
        component: () => import('@/views/vab/icon'),
        meta: {
          title: '图标',
          icon: 'remixicon-line',
          permission: '/agentManagement',
        },
      },
    ],
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/test',
    meta: {
      title: '动态路由测试',
      icon: 'test-tube-line',
      permission: '/agentManagement',
    },
    children: [
      {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/test'),
        meta: {
          title: '动态路由测试',
          icon: 'test-tube-line',
          permission: '/agentManagement',
        },
      },
      {
        path: '/test234',
        name: 'Test2',
        component: () => import('@/views/test'),
        meta: {
          title: '动态路由测试222',
          icon: 'test-tube-line',
          permission: '/agentMa111nagement',
        },
      },
    ],
  },
  {
    path: '/machineLearn',
    name: 'MachineLearn',
    component: Layout,
    meta: {
      title: '前端测试',
      icon: 'test-tube-line',
      permission: '/machineLearn',
    },
    children: [
      {
        path: '/views/machineLearn/columnManage',
        name: 'ColumnManage',
        meta: {
          title: '字段管理',
          icon: 'test-tube-line',
          permission: '/views/machineLearn/columnManage',
        },
        component: () => import('@/views/test'),
      },
      {
        path: '/views/machineLearn/importBatch',
        name: 'ImportBatch',
        meta: {
          title: '导入管理',
          icon: 'test-tube-line',
          permission: '/views/machineLearn/importBatch',
        },
        component: () => import('@/views/test'),
      }
    ],
  },
  {
    path: '/error',
    name: 'Error',
    component: Layout,
    redirect: '/error/403',
    meta: {
      title: '错误页',
      icon: 'error-warning-line',
    },
    children: [
      {
        path: '403',
        name: 'Error403',
        component: () => import('@/views/403'),
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/404'),
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
    ],
  },
  {
    path: '/*',
    redirect: '/404',
    hidden: true,
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export default router
