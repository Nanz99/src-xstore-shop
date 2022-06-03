import { getStateFromStore, getPageQuery } from '@/utils/utils'
import { Effect, Reducer, formatMessage, history } from 'umi'
import {
  login,
  getMe,
  sendEmailResetPassword,
  resetPassword,
  editResetPassword,
} from '@/services/users'
import { message, notification } from 'antd'
import { stringify } from 'querystring'
import useStore from 'store'
import { isEmpty } from 'lodash'

let store
let rememberMeFlag

export interface UserItem {
  id: number
  email: string
  password: string
  status: number
  role: string
  type: number
  lastLogin: Date
  created_at: Date
  updated_at: Date
  oauthGoogleId: string
  oauthFacebookId: string
  fullName: string
  firstName: string
  lastName: string
  description: string
  phone: string
  address: string
  city: string
  country: string
  avatarUrl: string
  contact_person: string
  position: string
  industry: string
  tax_code: string
  website: string
  employee_size: string
  provider_type: number
  subscribed_date: Date
  is_active_pricing_plan: Date
  is_super: number
  pricingPlanId: number
  temptLogined: number
  verify: number
}

export interface UserModelState {
  currentUser?: UserItem
  accessToken?: string
  rememberMe?: boolean
}

interface UserModelType {
  namespace: string
  state: UserModelState
  effects: {
    login: Effect
    logout: Effect
    getMe: Effect
    sendEmail: Effect
    resetPassword: Effect
  }
  reducers: {
    saveCurrentUser: Reducer<UserModelState>
    setAccessToken: Reducer<UserModelState>
  }
}

export interface LoginParamsType {
  email: string
  password: string
  rememberMe: boolean
}

const UsersModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: getStateFromStore('currentUser'),
    accessToken: getStateFromStore('accessToken'),
    rememberMe: getStateFromStore('rememberMe'),
  },
  effects: {
    *login({ payload }, { call, put }) {
      rememberMeFlag = payload.remember
      const { success, access_token: accessToken } = yield call(login, payload)
      if (success) {
        useStore.set('rememberMe', payload.remember)
        if (payload.remember === true) {
          const storages = [require('store/storages/localStorage')]
          store = useStore.createStore(storages)
          store.set('rememberMe', payload.remember)
        } else {
          const storages = [require('store/storages/sessionStorage')]
          store = useStore.createStore(storages)
          store.set('rememberMe', payload.remember)
        }
        yield put({
          type: 'setAccessToken',
          payload: accessToken,
        })
         history.push('/')
        // const res = yield call(getMe)
        // if (res.statusCode === 403) {
        //   notification.error({
        //     message: formatMessage({ id: 'login.permission' }),
        //   })
        // } else {
        //   notification.success({
        //     message: formatMessage({ id: 'login.success' }),
        //   })
        //   const urlParams = new URL(window.location.href)
        //   const params = getPageQuery()
        //   let { redirect } = params as { redirect: string }
        //   if (redirect) {
        //     const redirectUrlParams = new URL(redirect)
        //     if (redirectUrlParams.origin === urlParams.origin) {
        //       redirect = redirect.substr(urlParams.origin.length)
        //       if (redirect.match(/^\/.*#/)) {
        //         redirect = redirect.substr(redirect.indexOf('#') + 1)
        //       }
        //     } else {
        //       window.location.href = '/'
        //       return
        //     }
        //   }
        //   history.replace(redirect || '/')
        // }
      }
    },
    logout() {
      const { redirect } = getPageQuery()
      if (window.location.pathname !== '/login') {
        const storages_local = [require('store/storages/localStorage')]
        const localStore = useStore.createStore(storages_local)
        localStore.clearAll()

        const storages_session = [require('store/storages/sessionStorage')]
        const sessionStore = useStore.createStore(storages_session)
        sessionStore.clearAll()

        history.replace({
          pathname: '/login',
          search: stringify({
            redirect: redirect || window.location.href,
          }),
        })
      }
    },
    *getMe({}, { call, put }) {
      const { success, ...userInfo } = yield call(getMe)
      if (success) {
        yield put({
          type: 'saveCurrentUser',
          payload: userInfo.user,
        })
      }
    },
    *sendEmail({ payload }, { call, put }) {
      const res = yield call(sendEmailResetPassword, payload)
      if (!res) {
        message.success(formatMessage({ id: 'login.sendSuccess' }))
      } else {
        message.error(formatMessage({ id: 'login.sendError' }))
      }
    },
    *resetPassword({ payload }, { call, put }) {
      const { success } = yield call(editResetPassword, payload)
      if (success) {
        message.success(formatMessage({ id: 'login.resetSuccess' }))
        setTimeout(() => {
          history.push('/login')
        }, 5)
      } else {
        message.error(formatMessage({ id: 'login.resetError' }))
      }
    },
  },
  reducers: {
    saveCurrentUser(state, { payload }): UserModelState {
      if (rememberMeFlag === true) {
        const storages = [require('store/storages/localStorage')]
        store = useStore.createStore(storages)
        store.set('currentUser', payload)
      } else {
        const storages = [require('store/storages/sessionStorage')]
        store = useStore.createStore(storages)
        store.set('currentUser', payload)
      }
      return {
        ...state,
        currentUser: payload || {},
      }
    },
    setAccessToken(state, { payload }): UserModelState {
      if (rememberMeFlag === true) {
        const storages = [require('store/storages/localStorage')]
        store = useStore.createStore(storages)
        store.set('accessToken', payload)
      } else {
        const storages = [require('store/storages/sessionStorage')]
        store = useStore.createStore(storages)
        store.set('accessToken', payload)
      }
      store.set('accessToken', payload)
      return {
        ...state,
        accessToken: payload,
      }
    },
  },
}

export default UsersModel
