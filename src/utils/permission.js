import store from '@/store'
import { isArray } from '@/utils/validate'

/**
 * 是否可以访问目标权限元素
 * @param target 目标(路由|按钮)要求权限
 * @returns {boolean} 满足访问条件
 */
export function hasPermission(target) {
  console.log('检测权限')
  if (store.getters['acl/admin']) {
    console.log('admin in')
    return true
  }

  if (isArray(target) && target.length > 0) {
    console.log('ceshi')
    console.log("store.getters['acl/role']",store.getters['acl/role'])
    console.log("store.getters['acl/permission']",store.getters['acl/permission'])
    
    let candata = can(
      [...store.getters['acl/role'], ...store.getters['acl/permission']],
      {
        permission: target,
        mode: 'oneOf',
      }
    )
    console.log('candata',candata)
    return candata
  }

  const { role, permission, mode = 'oneOf' } = target
  let result = true
  if (role) {
    console.log('role in')
    result =
      result && can(store.getters['acl/role'], { permission: role, mode })
  }

  if (result && permission) {
    console.log('pressssss')
    result = can(store.getters['acl/permission'], {
      permission,
      mode,
    })
  }
  console.log('result premission',result)
  return result
}

/**
 * 检查是否满足权限
 * @param roleOrPermission 当前用户权限
 * @param target 目标(路由|按钮)要求权限
 * @returns {boolean} 满足访问条件
 */
function can(roleOrPermission, target) {
  let hasRole = false
  const { permission, mode } = target
  if (mode === 'allOf') {
    hasRole = permission.every((item) => roleOrPermission.includes(item))
  }

  if (mode === 'oneOf') {
    hasRole = permission.some((item) => roleOrPermission.includes(item))
  }

  if (mode === 'except') {
    hasRole = !permission.some((item) => roleOrPermission.includes(item))
  }

  return hasRole
}
