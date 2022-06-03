import {
  createSettingClient,
  deleteBanner,
  deleteFooterImage,
  deleteSocial,
  getInforClient,
  getSettingClient,
  updateInfoClient,
  updateSetting,
} from '@/services/settings.service'
import { notification } from 'antd'
import { Effect, formatMessage, Reducer } from 'umi'

export interface FooterItem {
  id: number
  filename: string
  footerUrl: string
}

export interface SocialItem {
  id: number
  type: string
  socialURL: string
}

export interface SettingClientItem {
  id?: number
  concept?: string
  logo?: string
  slogan?: string
  page_name?: string
  website_name?: string
  company_name?: string
  referral?: string
  odoo?: string
  banners?: []
  footers?: FooterItem[]
  awards?: []
  socials?: SocialItem[]
}

export interface InfoClientItem {
  id?: number
  email?: string
  phone?: string
  bank_account?: string
  workingTime?: string
  address?: string
  status?: string
}

export interface SettingClientModelState {
  // listSettings?: SettingsItem]
  setting?: SettingClientItem
  infoClient?: InfoClientItem
}

interface SettingClientModelType {
  namespace: string
  state: SettingClientModelState
  effects: {
    getSettingClient: Effect
    createSettingClient: Effect
    updateSettingClient: Effect
    deleteBanner: Effect
    deleteFooterImage: Effect
    deleteSocial: Effect
    getInfoClient: Effect
    updateInfoClient: Effect
  }
  reducers: {
    setSettingClient: Reducer<SettingClientModelState>
    setInfoClient: Reducer<SettingClientModelState>
  }
}

const SettingClientModel: SettingClientModelType = {
  namespace: 'settingClient',
  state: {
    setting: {},
    infoClient: {},
  },
  effects: {
    *getSettingClient({ payload }, { call, put }) {
      const result = yield call(getSettingClient, payload)
      if (result.success) {
        return
      } else {
        yield put({
          type: 'setSettingClient',
          payload: result || {},
        })
      }
    },
    *createSettingClient({ payload }, { call, put }) {
      const result = yield call(createSettingClient, payload)
      if (result.success) {
        yield put({ type: 'getSettingClient' })
      }
      return result
    },
    *updateSettingClient({ payload }, { call, put }) {
      const result = yield call(updateSetting, payload)
      if (result.success) {
        yield put({ type: 'getSettingClient' })
        notification.success({
          message: formatMessage({ id: 'setting.updateSettingClientSucc' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'setting.updateSettingClientFailed' }),
        })
      }
      return result
    },
    *deleteBanner({ payload }, { call, put }) {
      const result = yield call(deleteBanner, payload)
      if (result.success) {
        yield put({
          type: 'getSettingClient',
          payload: result || {},
        })
        notification.success({
          message: formatMessage({ id: 'setting.deletedBannerSucc' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'setting.deletedBannerFailed' }),
        })
      }
      return result
    },
    *deleteFooterImage({ payload }, { call, put }) {
      const result = yield call(deleteFooterImage, payload)
      if (result.success) {
        yield put({
          type: 'getSettingClient',
          payload: result || {},
        })
        notification.success({
          message: formatMessage({ id: 'setting.deletedImageFooterSucc' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'setting.deletedImageFooterFailed' }),
        })
      }
      return result
    },
    *deleteSocial({ payload }, { call, put }) {
      const result = yield call(deleteSocial, payload)
      if (result.success) {
        yield put({
          type: 'getSettingClient',
          payload: result || {},
        })
        notification.success({
          message: formatMessage({ id: 'setting.deletedSocialSucc' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'setting.deletedSocialFailed' }),
        })
      }
      return result
    },
    *getInfoClient({ payload }, { call, put }) {
      const result = yield call(getInforClient)
      if (result) {
        yield put({
          type: 'setInfoClient',
          payload: result[0] || {},
        })
      }
    },
    *updateInfoClient({ payload }, { call, put }) {
      const result = yield call(updateInfoClient, payload)
      if (result.success) {
        yield put({ type: 'getInfoClient' })
        notification.success({
          message: formatMessage({ id: 'setting.updateInfoClientSucc' }),
        })
      } else {
        notification.error({
          message: formatMessage({ id: 'setting.updateInfoClientFailed' }),
        })
      }
      return result
    },
  },
  reducers: {
    setSettingClient(state, { payload }): SettingClientModelState {
      return {
        ...state,
        setting: payload,
      }
    },
    setInfoClient(state, { payload }): SettingClientModelState {
      return {
        ...state,
        infoClient: payload,
      }
    },
  },
}
export default SettingClientModel
