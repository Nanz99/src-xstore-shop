import { Effect, Reducer } from 'umi'
import {} from 'react'
import {
  getListOrderByIdService,
  getListOrderService,
} from '@/services/order.service'
import { NumberOutlined, SafetyCertificateFilled } from '@ant-design/icons'

export interface OrderItem {
  id: number //
  message: string
  shippingPrice: number //
  salePrice: number //
  discount: number //
  isQuantityDiscount: boolean
  orderStatus: number //
  stockoutStatus: number
  createAt: Date
  updateAt: Date
  total: number
}
export interface OrderModelState {
  listOrder?: OrderItem[]
  total: number
}

interface OrderModelType {
  namespace: string
  state: OrderModelState
  effects: {
    getListOrderModel: Effect
  }
  reducers: {
    setAllOrder: Reducer<OrderModelState>
    // setTotalOrder: Reducer<OrderModelState>;
  }
}

const OrderModel: OrderModelType = {
  namespace: 'order',
  state: {
    listOrder: [],
    total: 0,
  },
  effects: {
    *getListOrderModel({ payload }, { call, put }) {
      const result = yield call(getListOrderService, payload)

      if (result && result.success) {
        yield put({
          type: 'setAllOrder',
          payload: result || [],
        })
        // yield put({
        //   type: 'setTotalOrder',
        //   payload: result.total || 0,
        // });
      }
    },
  },
  reducers: {
    setAllOrder(state, { payload }): OrderModelState {
      return {
        ...state,
        listOrder: payload.data,
        total: payload.total,
      }
    },
    // setTotalOrder(state, { payload }) {
    //   return {
    //     ...state,
    //     total: payload,
    //   };
    // },
  },
}

export default OrderModel
