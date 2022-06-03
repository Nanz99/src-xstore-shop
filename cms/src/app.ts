import { getStateFromStore } from './utils/utils'
import { ConnectState } from './models/connect'
import { getSettingClient } from './services/settings.service'
import './index.less'




export async function getInitialState() {
  const result = await getSettingClient()
  const state: Partial<ConnectState> = {
    isLogin: 0,
    user: {
      accessToken: getStateFromStore('accessToken'),
      currentUser: getStateFromStore('currentUser'),
    },
    settingClient: result,
  }

  return state
}
