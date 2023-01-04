import router from '@/router'
import path from 'path'
import { rolesControl } from '@/config'
import { isExternal } from '@/utils/validate'
import { hasPermission } from '@/utils/permission'
import { hasRole } from '@/utils/hasRole'

/**
 * @author kolento
 * @description all模式渲染后端返回路由
 * @param constantRoutes
 * @returns {*}
 */
export function convertRouter(constantRoutes) {
  return constantRoutes.map((route) => {
    if (route.component) {
      if (route.component === 'Layout') {
        const path = 'layouts'
        route.component = (resolve) => require([`@/${path}`], resolve)
      } else {
        let path = 'views/' + route.component
        if (
          new RegExp('^/views/.*$').test(route.component) ||
          new RegExp('^views/.*$').test(route.component)
        ) {
          path = route.component
        } else if (new RegExp('^/.*$').test(route.component)) {
          path = 'views' + route.component
        } else if (new RegExp('^@views/.*$').test(route.component)) {
          path = route.component.slice(1)
        } else {
          path = 'views/' + route.component
        }
        route.component = (resolve) => require([`@/${path}`], resolve)
      }
    }
    if (route.children && route.children.length)
      route.children = convertRouter(route.children)

    if (route.children && route.children.length === 0) delete route.children

    return route
  })
}

/**
 * @author kolento
 * @description 根据roles数组拦截路由
 * @param routes
 * @param baseUrl
 * @returns {[]}
 */
export function filterRoutes(routes, baseUrl = '/') {
  // 根据permission过滤菜单栏权限
  console.log('rolesControl',rolesControl);
  console.log('routesroutesroutes',routes);
  console.log('hasPermission',hasPermission);
  return routes
    .filter((route) =>
      rolesControl && route.meta && route.meta.permission
      ? hasPermission(route.meta.permission)
      : true
    )
    .map((route) => {
      console.log(121212121212,route)
      route = { ...route }
      route.path =
        route.path !== '*' && !isExternal(route.path)
          ? resolve(baseUrl, route.path)
          : route.path
      if (route.children) {
        route.children = filterRoutes(route.children, route.path)
        route.childrenNameList = route.children.flatMap(
          (_) => _.childrenNameList
        )
        if (!route.redirect)
          route.redirect = route.children[0].redirect
            ? route.children[0].redirect
            : route.children[0].path
      } else route.childrenNameList = [route.name]
      console.log('过滤后的route',route)
      return route
    })

    // 根据角色过滤菜单栏权限
    // .filter((route) => {
    //   if (route.meta && route.meta.roles)
    //     return !rolesControl || hasRole(route.meta.roles)
    //   else return true
    // })
    // .map((route) => {
    //   if (route.path !== '*' && !isExternal(route.path))
    //     route.path = path.resolve(baseUrl, route.path)
    //   route.fullPath = route.path
    //   if (route.children)
    //     route.children = filterRoutes(route.children, route.fullPath)
    //   return route
    // })
}

/**
 * 根据当前页面firstMenu
 * @returns {string}
 */
export function handleFirstMenu() {
  const firstMenu = router.currentRoute.matched[0].path
  if (firstMenu === '') return '/'
  return firstMenu
}
