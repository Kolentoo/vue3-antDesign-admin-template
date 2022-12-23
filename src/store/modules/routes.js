/**
 * @author kolento
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes } from '@/router'
import { getRouterList } from '@/api/router'
import { convertRouter, filterRoutes } from '@/utils/routes'

const state = () => ({
  routes: [],
  partialRoutes: [],
})
const getters = {
  routes: (state) => {
    return state.routes
  },
  partialRoutes: (state) => state.partialRoutes,
}
const mutations = {
  setRoutes(state, routes) {
    state.routes = routes
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = routes
  },
}
const actions = {
  /**
   * @author kolento
   * @description intelligence模式设置路由
   * @param {*} { commit }
   * @returns
   */
  async setRoutes({ commit }) {
    console.log('设置路由菜单--setRoutes')
    // 整合所有的路由
    const finallyRoutes = filterRoutes([...constantRoutes, ...asyncRoutes])

    // 执行设置路由方法 提交路由参数
    commit('setRoutes', finallyRoutes)
    return [...asyncRoutes]
  },
  /**
   * @author kolento
   * @description all模式设置路由
   * @param {*} { commit }
   * @returns
   */
  async setAllRoutes({ commit }) {
    let { data } = await getRouterList()
    console.log('设置路由菜单',data);
    if (data[data.length - 1].path !== '*')
      data.push({ path: '*', redirect: '/404', hidden: true })
    const asyncRoutes = convertRouter(data)
    const finallyRoutes = filterRoutes([...constantRoutes, ...asyncRoutes])
    commit('setRoutes', finallyRoutes)
    return [...asyncRoutes]
  },
  /**
   * @author kolento
   * @description 画廊布局、综合布局设置路由
   * @param {*} { commit }
   * @param accessedRoutes 画廊布局、综合布局设置路由
   */
  setPartialRoutes({ commit }, accessedRoutes) {
    console.log('setPartialRoutes')
    commit('setPartialRoutes', accessedRoutes)
  },
}
export default { state, getters, mutations, actions }
