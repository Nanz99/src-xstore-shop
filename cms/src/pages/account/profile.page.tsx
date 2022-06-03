import React, { useState, useEffect, useMemo } from 'react'
import {
  Dispatch,
  useIntl,
  useLocation,
  connect,
  history,
  useRouteMatch,
} from 'umi'
import { Menu } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import styles from './style.less'
import InfoView from './info.view'
import PasswordView from './password.view'
import { ConnectState } from '@/models/connect'
import { UserItem } from '@/models/users'

const { Item } = Menu

interface UserProps {
  currentUser: UserItem
  loading: boolean
  dispatch: Dispatch
}

const Profile: React.FC<UserProps> = props => {
  const { currentUser, loading, dispatch, children } = props
  const location = useLocation()
  const match = useRouteMatch()
  const { formatMessage } = useIntl()
  const menuMap = {
    info: formatMessage({ id: 'account.infomation' }),
    password: formatMessage({ id: 'account.changePassword' }),
  }
  const key = location.pathname.replace(`${match.path}/`, '')
  const [changePage, setChangePage] = useState({
    menuMap,
    selectKey: menuMap[key] ? key : 'info',
  })
  const [isChange, setIsChange] = useState(false)

  const getMenu = () => {
    const { menuMap } = changePage
    return Object.keys(menuMap).map(item => (
      <Item key={item}>{menuMap[item]}</Item>
    ))
  }

  const getView = () => {
    const { selectKey } = changePage
    switch (selectKey) {
      case 'info':
        return (
          <InfoView
            currentUser={currentUser}
            fetchCurrentUser={fetchCurrentUser}
          />
        )
      case 'password':
        return (
          <PasswordView
            currentUser={currentUser}
            fetchCurrentUser={fetchCurrentUser}
          />
        )
      default:
        return <div>base</div>
    }
  }

  const getRightTitle = () => {
    const { selectKey, menuMap } = changePage
    return menuMap[selectKey]
  }

  const selectKey = ({ key }) => {
    setChangePage({
      ...changePage,
      selectKey: key,
    })
  }

  const fetchCurrentUser = () => {
    dispatch({ type: 'user/getMe' })
  }

  useMemo(() => {
    fetchCurrentUser()
  }, [isChange])

  return (
    <PageHeaderWrapper>
      <div className={styles.main}>
        <div className={styles.leftmenu}>
          <Menu
            mode="inline"
            selectedKeys={[changePage.selectKey]}
            onClick={selectKey}
          >
            {getMenu()}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{getRightTitle()}</div>
          {getView()}
        </div>
      </div>
    </PageHeaderWrapper>
  )
}
export default connect(({ loading, user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(Profile)
