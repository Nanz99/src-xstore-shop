import { Effect, Reducer } from 'umi';
import { getListStockinService } from '@/services/product.service';

// Create interface ten ...Item chua du lieu
export interface StockinItem {
  id: number;
  message: string;
  shippingPrice: string;
  buyPrice: number;
  discount: number;
  isQuantityDiscount: boolean;
  stockinStatus: number;
  createdAt: Date;
  updateAt: Date;
}

// Create interface Mod elState chua Item
export interface StockinModelState {
  listStockin?: StockinItem[];
  total: 0;
}

//Create ModelType (set thuoc tinh cho Model)
interface StockinModelType {
  namespace: string;
  state: StockinModelState;
  effects: {
    getListStockinModel: Effect;
  };
  reducers: {
    setListStockin: Reducer<StockinModelState>;
    setTotalStockin: Reducer<StockinModelState>;
  };
}

const StockinModel: StockinModelType = {
  namespace: 'stockin',
  state: {
    listStockin: [],
    total: 0,
  },
  effects: {
    *getListStockinModel({ payload }, { call, put }) {
      const result = yield call(getListStockinService, payload);
      if (result) {
        yield put({
          type: 'setListStockin',
          payload: result.data || [],
        });
        yield put({
          type: 'setTotalStockin',
          payload: result.total,
        });
      }
    },
  },
  reducers: {
    setListStockin(state, { payload }): StockinModelState {
      return {
        total: 0,
        ...state,
        listStockin: payload,
      };
    },
    setTotalStockin(state, { payload }) {
      return {
        listStockin: [],
        ...state,
        total: payload,
      };
    },
  },
};
export default StockinModel;
