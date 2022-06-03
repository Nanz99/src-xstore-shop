import { CustomerModelState } from './customer.model'
import { OperatorModelState } from './operator.model'
import { Settings } from '@ant-design/pro-layout'
import { MenuDataItem } from '@ant-design/pro-layout'
import { GlobalModelState } from './global'
import { UserModelState } from './users'
import { DashboardModelState } from './dashboard.model'
import { AccountModelState } from './account.model'
import { ProductModelState } from './product.model'
import { CategoryModelState } from './category.model'
import { OrderModelState } from './order.model'
import { StockinModelState } from './stockin.model'
import { StockoutModelState } from './stockout.model'
import { SettingClientModelState } from './settings.model'
import { ServicesModelState } from './service.model'
import {ContactModelState} from './contact.model'

export {
  GlobalModelState,
  UserModelState,
  DashboardModelState,
  AccountModelState,
  ProductModelState,
  CategoryModelState,
  OrderModelState,
  StockinModelState,
  StockoutModelState,
  CustomerModelState,
  OperatorModelState,
  SettingClientModelState,
  ServicesModelState,
ContactModelState
}

export interface Loading {
  global: boolean
  effects: { [key: string]: boolean | undefined }
  models: {
    global?: boolean
    menu?: boolean
    user?: boolean
    setting?: boolean
    products?: boolean
    stockin?: boolean
    stockout?: boolean
    order?: boolean
    account?: boolean
    dashboard?: boolean
    customer?: boolean
    operator?: boolean
    settingClient?: boolean,
    services?: boolean,
    contact?: boolean
  }
}

export interface ConnectState {
  isLogin: Number
  global: GlobalModelState
  loading: Loading
  user: UserModelState
  settings: Settings
  products: ProductModelState
  category: CategoryModelState
  order: OrderModelState
  stockin: StockinModelState
  stockout: StockoutModelState
  account: AccountModelState
  dashboard: DashboardModelState
  customer: CustomerModelState
  operator: OperatorModelState
  settingClient: SettingClientModelState,
  services: ServicesModelState,
  contact: ContactModelState
}

export interface Route extends MenuDataItem {
  routes?: Route[]
}
