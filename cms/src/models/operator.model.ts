import { Reducer, Effect } from 'umi'
import { getListOperatorService } from '@/services/account.service'

export interface OperatorItem {
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

export interface OperatorModelState {
  listOperators?: OperatorItem[]
  total: number
}

interface OperatorModelType {
  namespace: string
  state: OperatorModelState
  effects: {
    getListOperatorModel: Effect
  }
  reducers: {
    setOperator: Reducer<OperatorModelState>
  }
}

const OperatorModel: OperatorModelType = {
  namespace: 'operator',
  state: {
    listOperators: [],
    total: 0,
  },
  effects: {
    *getListOperatorModel({ payload }, { call, put }) {
      const result = yield call(getListOperatorService, payload)
      if (result && result.data) {
        yield put({
          type: 'setOperator',
          payload: result || [],
        })
      }
    },
  },
  reducers: {
    setOperator(state, { payload }): OperatorModelState {
      return {
        ...state,
        listOperators: payload.data,
        total: payload.total,
      }
    },
  },
}
export default OperatorModel
