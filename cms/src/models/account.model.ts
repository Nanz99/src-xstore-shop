import { Reducer, Effect } from 'umi'
import { getListAccountService } from '@/services/account.service'

export interface AccountItem {
  id: number
  email: string
  status: number
  role: string
  type: number
  lastLogin: Date
  fullName: string
  description: string
  phone: string
  address: string
  city: string
  country: string
  avatarUrl: string
  taxCode: string
  industry: string
  contactPerson: string
  position: string
  verify: boolean
  total: number
}

export interface AccountModelState {
  listAccount?: AccountItem[]
  total: number
}

interface AccountModelType {
  namespace: string
  state: AccountModelState
  effects: {
    getListAccountModel: Effect
  }
  reducers: {
    setAccount: Reducer<AccountModelState>
  }
}
const AccountModel: AccountModelType = {
  namespace: 'account',
  state: {
    listAccount: [],
    total: 0,
  },
  effects: {
    *getListAccountModel({ payload }, { call, put }) {
      const result = yield call(getListAccountService, payload)
      if (result && result.data) {
        yield put({
          type: 'setAccount',
          payload: result || [],
        })
      }
    },
  },
  reducers: {
    setAccount(state, { payload }): AccountModelState {
      return {
        ...state,
        listAccount: payload.data,
        total: payload.total,
      }
    },
  },
}
export default AccountModel
