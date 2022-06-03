import { getListCustomerService } from '@/services/account.service'
import { caculateDiscount, caculateRevene, getChartDataService, getDataBbestSelling, getTotalData } from '@/services/dashboard.service'
import { Effect, Reducer } from 'umi'

export interface VisitDataItem {
  x: string
  y: number
}

export interface SearchDataItem {
  index: number
  keyword: string
  count: number
  range: number
  status: number
}

export interface RadarDataItem {
  name: string
  label: string
  value: number
}

export interface totalData {
  totalOrderNew: number,
  totalOrderDelivering: number,
  totalOrderProcessing: number,
  totalOrderDone: number,
  totalOrderReject: number,
  totalOrder: number,
  totalProduct: number,
  totalCategory: number,
}


export interface DashboardModelState {
  visitData: VisitDataItem[],
  visitData2: VisitDataItem[],
  salesData: VisitDataItem[],
  searchData: SearchDataItem[],
  salesTypeData: VisitDataItem[],
  salesTypeDataOnline: VisitDataItem[],
  salesTypeDataOffline: VisitDataItem[],
  radarData: RadarDataItem[],
  totalData: totalData,
  listBestSelling: [],
  listCustomer: [],
  
}

export interface ModelType {
  namespace: string
  state: DashboardModelState
  effects: {
    getTotalDataModel: Effect
    getBestSelling: Effect
    getListCustomer: Effect
  }
  reducers: {
    // save: Reducer<DashboardModelState>
    // clear: Reducer<DashboardModelState>
    setTotalData: Reducer<DashboardModelState>
    bestSelling: Reducer<DashboardModelState>
    setListCustomer: Reducer<DashboardModelState>
  }
}

const initState = {
  visitData: [],
  visitData2: [],
  salesData: [],
  searchData: [],
  salesTypeData: [],
  salesTypeDataOffline: [],
  salesTypeDataOnline: [],
  radarData: [],
  totalData: {}, 
  listBestSelling: [],
  listCustomer: [],
}

const Model: ModelType = {
  namespace: 'dashboard',
  state: initState,
  effects: {
    *getTotalDataModel({ payload }, { call, put }) {
      const response = yield call(getTotalData, payload)
      yield put({
        type: 'setTotalData',
        payload: response,
      })
    },
    *getBestSelling({ payload }, { call, put }) {
       const response = yield call(getDataBbestSelling, payload)
      yield put({
        type: 'bestSelling',
        payload: response,
      })
    },
    *getListCustomer({ payload }, { call, put }) {
        const response = yield call(getListCustomerService, payload)
      yield put({
        type: 'setListCustomer',
        payload: response.data || []
      })
    }

  },
  reducers: {
    setTotalData(state, { payload }): any {
     return{
        ...state,
      totalData : payload
     }
    },
   
    bestSelling(state, { payload }): any {
      return{
        ...state,
        listBestSelling: payload
      }
    },
    setListCustomer(state, { payload }): any {
      return{
        ...state,
        listCustomer: payload
      }
    }
  },
}

export default Model
