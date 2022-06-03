import { Form } from 'antd'
import { method } from 'lodash'
import { fetchAuth } from '@/utils/request'

const routes = {
  getListAccount: 'user',
  getListCustomer: 'customer',
  getListOperator: 'operator',
  getDetailAccount: id => `user/${id}`,
  getCustomerOrder: id => `order/customer-order/${id}`,
  postCreateAccount: 'auth/register-operator',
  putUserProfile: 'user/profile',
  putUserChangePassword: 'user/change-password',
  putAuthDeactivate: 'user/status',
}

export function getListAccountService(params) {
  return fetchAuth({
    url: routes.getListAccount,
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export function getListCustomerService(params) {
  return fetchAuth({
    url: routes.getListCustomer,
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export function getListOperatorService(params) {
  return fetchAuth({
    url: routes.getListOperator,
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export function getDetailAccount(id) {
  return fetchAuth({
    url: routes.getDetailAccount(id),
    method: 'GET',
  })
}

export function postCreateAccount(data) {
  return fetchAuth({
    url: routes.postCreateAccount,
    method: 'POST',
    data: data,
  })
}

export function putUserProfileService(data) {
  const form = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      form.append(key, '')
    }
    form.append(key, data[key])
  })
  return fetchAuth({
    url: routes.putUserProfile,
    method: 'PUT',
    data: form,
  })
}

export function putUserChangePasswordService(data) {
  return fetchAuth({
    url: routes.putUserChangePassword,
    method: 'PUT',
    data: data,
  })
}

export function getCustomerOrder(id) {
  return fetchAuth({
    url: routes.getCustomerOrder(id),
    method: 'GET',
  })
}

export function deactiveAccountService(data) {
  return fetchAuth({
    url: routes.putAuthDeactivate,
    method: 'PUT',
    data,
  })
}
