import { Effect, Reducer } from 'umi'
import { CategoryItem } from './category.model'
import { omit } from 'lodash'
import { getAllServices, getListOrderServices } from '@/services/service.service'

// Create interface ten ...Item chua du lieu
export interface ServiceItem {
  id: number
  name: string
  imageUrl: string,
  introduction: string,
  vnIntroduction: string,
  description: string,
  vnDescription: string,
  status: number
  createdAt: Date
  updatedAt: Date,
  galleries: []
}

export interface OrderServiceItem {
  id: number,
  name: string,
  phone: string,
  email: string,
  date: string,
  quantity: number,
  status: number,
  createdAt: Date
  updatedAt: Date,

}

// Create interface Mod elState chua Item
export interface ServicesModelState {
  listServices?: ServiceItem[] | [],
  listOrderServices?: OrderServiceItem[] | [],
  totalService: 0,
  totalOrderService: 0
}

//Create ModelType (set thuoc tinh cho Model)
interface ServicesModelType {
  namespace: string
  state: ServicesModelState
  effects: {
    getAllServicesModel: Effect,
    getOrderServicesModel: Effect,
  }
  reducers: {
    setAllServices: Reducer<ServicesModelState>
    setAllOrderServices: Reducer<ServicesModelState>
    setTotalServices: Reducer<ServicesModelState>
    setTotalOrderServices: Reducer<ServicesModelState>
  }
}

const ServicesModel: ServicesModelType = {
  namespace: 'services',
  state: {
    listServices: [],
    listOrderServices: [],
    totalService: 0,
    totalOrderService: 0
  },
  effects: {
    *getAllServicesModel({ payload }, { call, put }) {
      const result = yield call(getAllServices, payload)
      if (result) {
        yield put({
          type: 'setAllServices',
          payload: result?.data?.services || [],
        })
        yield put({
          type: 'setTotalServices',
          payload: result?.total,
        })
      }
    },
    *getOrderServicesModel({ payload }, { call, put }) {
      const result = yield call(getListOrderServices, payload)
      if (result) {
        yield put({
          type: 'setAllOrderServices',
          payload: result?.data?.services || [],
        })
        yield put({
          type: 'setTotalOrderServices',
          payload: result?.total,
        })
      }
    }
  },
  reducers: {
    setAllServices(state, { payload }): ServicesModelState {
      return {
        totalService: 0,
        totalOrderService: 0,
        ...state,
        listServices: payload,
      }
    },
    setAllOrderServices(state, { payload }): ServicesModelState {
      return {
        totalService: 0,
        totalOrderService: 0,
        ...state,
        listOrderServices: payload,
      }
    },
    setTotalServices(state, { payload }) : any{
      return {
        ...state,
        totalService: payload,
      }
    },
    setTotalOrderServices(state, { payload }) :any{
      return {
        ...state,
        totalOrderService: payload,
      }
    },
  }
}

export default ServicesModel
