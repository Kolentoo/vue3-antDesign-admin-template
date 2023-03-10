/**
 * @author kolento
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */
import { getUserData, login, logout } from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import { title, tokenName } from '@/config'
import { message, notification } from 'ant-design-vue'

const state = () => ({
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
})
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
}
const mutations = {
  /**
   * @author kolento
   * @description 设置accessToken
   * @param {*} state
   * @param {*} accessToken
   */
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  /**
   * @author kolento
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state, username) {
    state.username = username
  },
  /**
   * @author kolento
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
}
const actions = {
  /**
   * @author kolento
   * @description 登录拦截放行时，设置虚拟角色
   * @param {*} { commit, dispatch }
   */
  setVirtualRoles({ commit, dispatch }) {
    dispatch('acl/setFull', true, { root: true })
    commit('setAvatar', 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif')
    commit('setUsername', 'admin(未开启登录拦截)')
  },
  /**
   * @author kolento
   * @description 登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async login({ commit }, userInfo) {
    console.log('调用登录接口')
    const { data } = await login(userInfo)
    const accessToken = data['token'];
    console.log('登录接口调用完成');
    if (accessToken) {
      commit('setAccessToken', accessToken)

      notification.open({
        message: `登录成功`,
        description: `欢迎使用${title}`,
      })
    } else {
      message.error(`登录接口异常，未正确返回${tokenName}...`)
    }
  },
  /**
   * @author kolento
   * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
   * @param {*} { commit, dispatch, state }
   * @returns
   */
  async getUserInfo({ commit, dispatch, state }) {
    const result = await getUserData(state.accessToken)
    console.log('resultresult',result);
    console.log('resultresult',result.data);
    if (!result.data) {
      message.error(`验证失败，请重新登录`)
      return false
    }
    let { username, avatar, roles, ability,currentCompany,currentUser,currentUserTag,permissions } = result.data
    console.log('roles',roles)
    if (username && roles && Array.isArray(roles)) {
      console.log('ceshi')
      dispatch('acl/setRole', roles, { root: true })
      if (ability && ability.length > 0){
        dispatch('acl/setAbility', ability, { root: true })
      }
        
      commit('setUsername', username)
      commit('setAvatar', avatar)

      if (permissions) {
        dispatch('acl/setPermission', permissions, {root: true})
      }
    } else {
      message.error('用户信息接口异常')
    }
  },

  /**
   * @author kolento
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch }) {
    await logout(state.accessToken)
    await dispatch('resetAll')
  },
  /**
   * @author kolento
   * @description 重置accessToken、roles、ability、router等
   * @param {*} { commit, dispatch }
   */
  async resetAll({ dispatch }) {
    await dispatch('setAccessToken', '')
    await dispatch('acl/setFull', false, { root: true })
    await dispatch('acl/setRole', [], { root: true })
    await dispatch('acl/setAbility', [], { root: true })
    removeAccessToken()
  },
  /**
   * @author kolento
   * @description 设置token
   */
  setAccessToken({ commit }, accessToken) {
    commit('setAccessToken', accessToken)
  },
}
export default { state, getters, mutations, actions }
