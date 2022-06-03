import { Effect, Reducer } from 'umi';
import { getStockoutService } from '@/services/product.service';

// Create interface ten ...Item chua du lieu
export interface StockoutItem {
  id: number;
  message: string;
  shippingPrice: string;
  grandTotal: number;
  subTotal: number;
  discount: number;
  createdAt: Date;
  updateAt: Date;
}

// Create interface Mod elState chua Item
export interface StockoutModelState {
  listStockout?: StockoutItem[];
  total: 0;
}

//Create ModelType (set thuoc tinh cho Model)
interface StockoutModelType {
  namespace: string;
  state: StockoutModelState;
  effects: {
    getListStockoutModel: Effect;
  };
  reducers: {
    setListStockout: Reducer<StockoutModelState>;
    setTotalStockout: Reducer<StockoutModelState>;
  };
}

const StockoutModel: StockoutModelType = {
  namespace: 'stockout',
  state: {
    listStockout: [],
    total: 0,
  },
  effects: {
    *getListStockoutModel({ payload }, { call, put }) {
      const result = yield call(getStockoutService, payload);
      if (result) {
        yield put({
          type: 'setListStockout',
          payload: result.data || [],
        });
        yield put({
          type: 'setTotalStockout',
          payload: result.total,
        });
      }
    },
  },
  reducers: {
    setListStockout(state, { payload }): StockoutModelState {
      return {
        total: 0,
        ...state,
        listStockout: payload,
      };
    },
    setTotalStockout(state, { payload }) {
      return {
        listStockout: [],
        ...state,
        total: payload,
      };
    },
  },
};
export default StockoutModel;
