import request from '@/utils/request'
import { tokenName } from '@/config'
import { loginRSA } from '@/config'

export async function codeURL(data) {
  return request({
      url: '/api/session/kaptcha',
      method: 'get',
      data,
  })
}

export async function login(data) {
  // 是否开启RSA加密 默认FALSE
  if (loginRSA) {
      data = await encryptedData(data)
  }
  return request({
      url: '/api/session/login',
      method: 'post',
      data,
  })
}

export function getUserData() {
  return request({
      url: '/api/session/userInfo',
      method: 'get',
      
  })
}




export async function socialLogin(data) {
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}

// export function getUserInfo(accessToken) {
//   //此处为了兼容mock.js使用data传递accessToken，如果使用mock可以走headers
//   return request({
//     url: '/userInfo',
//     method: 'post',
//     data: {
//       [tokenName]: accessToken,
//     },
//   })
// }

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
