import { Effect, Reducer } from 'umi'
import { getAllCategory } from '@/services/categories.service'
import { useAccess, Access } from 'umi'

// Create Item
export interface CategoryItem {
  id: string
  enName: string
  vnName: string
  slug: string
  description: string
  imageUrl: string
  active: string
  createdAt: Date
  updatedAt: Date
}

export interface CategoryModelState {
  listCategory?: CategoryItem[]
  total: 0
}
interface CategoryModelType {
  namespace: string
  state: CategoryModelState
  effects: {
    getAllCategoryModel: Effect
  }
  reducers: {
    setAllCategory: Reducer<CategoryModelState>
    setTotalCategory: Reducer<CategoryModelState>
  }
}

const CategoryModel: CategoryModelType = {
  namespace: 'category',
  state: {
    listCategory: [],
    total: 0,
  },
  effects: {
    *getAllCategoryModel({ payload }, { call, put }) {
      const result = yield call(getAllCategory, payload)
      if (result) {
        yield put({
          type: 'setAllCategory',
          payload: result.data || [],
        })
        yield put({
          type: 'setTotalCategory',
          payload: result.total || 0,
        })
      }
    },
  },
  reducers: {
    setAllCategory(state, { payload }): CategoryModelState {
      return {
        ...state,
        listCategory: payload,
        total: 0,
      }
    },
    setTotalCategory(state, { payload }) {
      return {
        listProducts: [],
        ...state,
        total: payload,
      }
    },
  },
}
export default CategoryModel
