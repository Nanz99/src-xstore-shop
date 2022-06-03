import { Reducer, Effect } from 'umi'
import { getListCustomerService } from '@/services/account.service'

export interface CustomerItem {
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

export interface CustomerModelState {
  listCustomers?: CustomerItem[]
  total: number
}

interface CustomerModelType {
  namespace: string
  state: CustomerModelState
  effects: {
    getListCustomerModel: Effect
  }
  reducers: {
    setCustomer: Reducer<CustomerModelState>
  }
}

const CustomerModel: CustomerModelType = {
  namespace: 'customer',
  state: {
    listCustomers: [],
    total: 0,
  },
  effects: {
    *getListCustomerModel({ payload }, { call, put }) {
      const result = yield call(getListCustomerService, payload)
      if (result && result.data) {
        yield put({
          type: 'setCustomer',
          payload: result || [],
        })
      }
    },
  },
  reducers: {
    setCustomer(state, { payload }): CustomerModelState {
      return {
        ...state,
        listCustomers: payload.data,
        total: payload.total,
      }
    },
  },
}
export default CustomerModel
