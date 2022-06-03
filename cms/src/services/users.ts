import { fetch, fetchAuth } from '@/utils/request'
import { LoginParamsType } from '@/models/users'

const routes = {
  login: 'api/users/signin',
  register: 'auth/register',
  resetPassword: 'auth/reset-password',
  getMe: 'user/cms-me',
}

export function login(data: LoginParamsType) {
  return fetch({
    url: routes.login,
    method: 'POST',
    data,
  })
}

export function register(data) {
  return fetchAuth({
    url: routes.register,
    method: 'POST',
    data,
  })
}

export function resetPassword(data) {
  return fetchAuth({
    url: routes.resetPassword,
    method: 'POST',
    data,
  })
}

export function getMe() {
  return fetchAuth({
    url: routes.getMe,
    method: 'GET',
  })
}

export function sendEmailResetPassword(data) {
  return fetch({
    url: routes.resetPassword + `?email=${data.email}`,
    method: 'GET',
  })
}

export function editResetPassword(data) {
  return fetch({
    url: routes.resetPassword,
    method: 'POST',
    data,
  })
}
