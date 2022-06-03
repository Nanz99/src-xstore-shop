import { PROCESS_ENV } from './constants'
import { locale } from 'antd/lib/date-picker/locale/en_US'
import { extend, RequestOptionsInit } from 'umi-request'
import { notification, Result } from 'antd'
import { history, formatMessage } from 'umi'
import useStore from 'store'
import { stringify } from 'querystring'

export const _apiPrefix = process.env.API_URL
//  const API_DEV = 'https://vnrobot-apidev.vndigitech.com';
//  const API_OLD = 'http://139.162.38.175:33001';
//  const LOCAL_DB = 'http://127.0.0.1:3500';

interface FetchOptions extends RequestOptionsInit {
  url: string
  autoPrefix?: boolean
}

interface FetchResponseType {
  statusCode: number
  result: object
  error: ErrorType
  message: ErrorType
  response: object
}

interface ErrorType {
  message: any
}

const errorHandler = (error: { response: Response; data: any }): Response => {
  const { response } = error
  if (!response) {
    notification.error({
      description:
        'Mạng của bạn không bình thường và không thể kết nối với máy chủ',
      message: 'Mạng bất thường',
    })
  }
  return error.data
}

const request = extend({
  errorHandler,
  timeout: 15000,
})

const generateUrl = (url: string, _autoPrefix = false) => {
  if (!_autoPrefix) return url
  return `${_apiPrefix}/${url}`
}

export const fetch = ({
  url,
  headers,
  autoPrefix = true,
  ...options
}: FetchOptions) => {
  return request(generateUrl(url, autoPrefix), {
    method: 'GET',
    headers: {
      // 'Content-Type': 'application/json',
      ...headers,
    },
    ...options,
  })
    .then(response => {
      if (response) {
        const { access_token, statusCode, message, success } = response
        if (access_token) {
          return { ...response, success: true }
        }
        if (message && !success) {
          notification.error({
            message: `Lỗi yêu cầu`,
            description: formatMessage({
              id: `error.${renderMessage(message)}`,
              // defaultMessage: renderMessage(message),
            }),
          })
          return { ...response, success: false }
        }
        return { ...response }
      }
    })
    .catch(error => {
      const { message, statusCode } = error
      notification.error(message)
      return false
    })
}

const renderMessage = (message: ErrorType) => {
  if (!message) return 'Error'
  if (typeof message === 'string') return message
  return message
}

export const fetchAuth = async ({
  url,
  headers,

  autoPrefix = true,
  ...options
}: FetchOptions) => {
  const rememberMe = useStore.get('rememberMe')
  let response: FetchResponseType
  if (rememberMe) {
    const storages = [require('store/storages/localStorage')]
    const store = useStore.createStore(storages)
    const accessToken = store.get('accessToken')
    if (!accessToken) {
      // notification.error({
      //   message: 'Xảy ra lỗi, 401',
      //   description: 'Bạn cần đăng nhập',
      // });
      history.replace(`/login`)
      return { success: false }
    }

    response = await request(generateUrl(url, autoPrefix), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
      ...options,
    })
  } else {
    const storages = [require('store/storages/sessionStorage')]
    const store = useStore.createStore(storages)
    const accessToken = store.get('accessToken')
    if (!accessToken) {
      // notification.error({
      //   message: 'Xảy ra lỗi, 401',
      //   description: 'Bạn cần đăng nhập',
      // });
      history.replace(`/login`)
      return { success: false }
    }

    response = await request(generateUrl(url, autoPrefix), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
      ...options,
    })
  }

  if (response) {
    return { success: true, ...response }
  } else {
    return { success: false }
  }
  // const { statusCode, result, message, error } = response;
  // if (statusCode !== 200) {
  //   if (statusCode === 401) {
  //     history.replace({
  //       pathname: '/login',
  //       search: stringify({
  //         redirect: window.location.href,
  //         logout: true,
  //       }),
  //     });
  //     return { success: false };
  //   } else {
  //     notification.error({
  //       message: `Lỗi yêu cầu ${statusCode}`,
  //       description: formatMessage({
  //         id: `error.${renderMessage(message)}`,
  //         defaultMessage: renderMessage(message),
  //       }),
  //     });
  //   }
  // }

  // return { success: statusCode === 200, ...result };
}

export const getFetchAuthOptions = ({
  url,
  headers,
  autoPrefix = true,
  ...options
}: FetchOptions) => {
  // const store = useStore();
  const accessToken = useStore.get('accessToken')
  if (!accessToken) {
    notification.error({
      message: `Lỗi xác thực`,
      description: 'Bạn cần phải đăng nhập',
    })
    history.replace(`/login`)
    return null
  }

  return {
    url: generateUrl(url, autoPrefix),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    },
    ...options,
  }
}

export const fetch_no_autoPrefix = ({
  url,
  headers,
  autoPrefix = true,
  ...options
}: FetchOptions) => {
  return request(url, {
    method: 'GET',
    headers: {
      // 'Content-Type': 'application/json',
      ...headers,
    },
    ...options,
  })
    .then(response => {
      if (response) {
        const { access_token, statusCode, message, success } = response
        if (access_token) {
          return { ...response, success: true }
        }
        if (message && !success) {
          notification.error({
            message: `Lỗi yêu cầu`,
            description: formatMessage({
              id: `error.${renderMessage(message)}`,
              // defaultMessage: renderMessage(message),
            }),
          })
          return { ...response, success: false }
        }
        return { ...response }
      }
    })
    .catch(error => {
      const { message, statusCode } = error
      notification.error(message)
      return false
    })
}

export default request
