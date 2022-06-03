import { Reducer } from 'redux'
import { Effect } from 'dva'
import { NoticeIconData } from '@/components/NoticeIcon'

export interface NoticeItem extends NoticeIconData {
  id: string
  type: string
  status: string
}

export interface GlobalModelState {
  collapsed: boolean
  notices: NoticeItem[]
}

export interface GlobalModelType {
  namespace: 'global'
  state: GlobalModelState
  effects: {
    changeNoticeReadState: Effect
    clearNotices: Effect
  }
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>
    saveNotices: Reducer<GlobalModelState>
    saveClearedNotices: Reducer<GlobalModelState>
  }
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
  },
  effects: {
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select((state: any) =>
        state.global.notices.map((item: NoticeItem) => {
          const notice = { ...item }
          if (notice.id === payload) {
            notice.read = true
          }
          return notice
        }),
      )

      yield put({
        type: 'user/saveNotices',
        payload: notices,
      })

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      })
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'user/saveClearedNotices',
        payload,
      })
      const count: number = yield select(
        (state: any) => state.global.notices.length,
      )
      const unreadCount: number = yield select(
        (state: any) =>
          state.global.notices.filter((item: NoticeItem) => !item.read).length,
      )
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      })
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = { notices: [], collapsed: true },
      { payload },
    ): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      }
    },
    saveNotices(state, { payload }): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      }
    },
    saveClearedNotices(
      state = { notices: [], collapsed: true },
      { payload },
    ): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      }
    },
  },
}

export default GlobalModel
