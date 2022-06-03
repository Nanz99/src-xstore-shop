import { Effect, Reducer } from 'umi'
import { getAllColor, getAllProductsService, getAllSize } from '@/services/product.service'
import { CategoryItem } from './category.model'
import { omit } from 'lodash'

// Create interface ten ...Item chua du lieu
export interface ProductItem {
  id: number
  name: string
  imageUrl: string
  introduction: string
  description: string
  status: string //
  createdAt: Date
  updatedAt: Date
  purchasePrice: number //
  dealerPrice: number //
  retailPrice: number //
  providerName: string //
  // SKU: string
  screenshots: []
  categories: CategoryItem[] //
  condition: number
}

// Create interface Mod elState chua Item
export interface ProductModelState {
  listProducts?: ProductItem[]
  listSizes?: [],
  listColors?: [],
  total: 0
}

//Create ModelType (set thuoc tinh cho Model)
interface ProductModelType {
  namespace: string
  state: ProductModelState
  effects: {
    getAllProductsModel: Effect
    getAllSize: Effect
    getAllColor: Effect
  }
  reducers: {
    setAllProducts: Reducer<ProductModelState>
    setTotalProducts: Reducer<ProductModelState>
    setAllSize: Reducer<ProductModelState>
    setAllColor: Reducer<ProductModelState>
  }
}

const ProductsModel: ProductModelType = {
  namespace: 'products',
  state: {
    listProducts: [],
    listSizes: [],
    listColors: [],
    total: 0,
  },
  effects: {
    *getAllProductsModel({ payload }, { call, put }) {
      const result = yield call(getAllProductsService, payload)
      if (result) {
        yield put({
          type: 'setAllProducts',
          payload: result.data || [],
        })
        yield put({
          type: 'setTotalProducts',
          payload: result?.total,
        })
      }
    },
    *getAllSize({ payload }, { call, put }) {
      const result = yield call(getAllSize, payload)
      if (result) {
        yield put({
          type: 'setAllSize',
          payload: result?.data || [],
        })
      }
    },
    *getAllColor({ payload }, { call, put }) {
      const result = yield call(getAllColor, payload)
      if (result) {
        yield put({
          type: 'setAllColor',
          payload: result?.data || [],
        })
      }
    }
  },
  reducers: {
    setAllProducts(state, { payload }): ProductModelState {
      return {
        total: 0,
        ...state,
        listProducts: payload,
      }
    },
    setTotalProducts(state, { payload }) {
      return {
        listProducts: [],
        ...state,
        total: payload,
      }
    },
    setAllSize(state, { payload }): any {
      return {
        ...state,
        listSizes: payload,
      }
    },
    setAllColor(state, { payload }): any {
      return {
        ...state,
        listColors: payload,
      }
    }
  },
}
export default ProductsModel
