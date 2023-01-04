const state = () => ({
  admin: false,
  role: [],
  ability: [],
  permission: [],
})
const getters = {
  admin: (state) => state.admin,
  role: (state) => state.role,
  ability: (state) => state.ability,
  permission: (state) => state.permission,
}
const mutations = {
  setFull(state, admin) {
    state.admin = admin
  },
  setRole(state, role) {
    state.role = role
  },
  setAbility(state, ability) {
    state.ability = ability
  },
  setPermission(state, permission) {
    state.permission = permission
  },
}
const actions = {
  setFull({ commit }, admin) {
    commit('setFull', admin)
  },
  setRole({ commit }, role) {
    commit('setRole', role)
  },
  setAbility({ commit }, ability) {
    commit('setAbility', ability)
  },
  setPermission({ commit }, permission) {
    console.log('设置菜单栏目权限',permission)
    commit('setPermission', permission)
  },
}
export default { state, getters, mutations, actions }
