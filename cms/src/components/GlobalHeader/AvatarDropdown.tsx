import React from 'react'
import { history, ConnectProps, connect, useIntl } from 'umi'
import { UserItem } from '@/models/users'
import { ConnectState } from '@/models/connect'
import { Avatar, Menu, Spin } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import HeaderDropdown from '../HeaderDropdown'
import { ClickParam } from 'antd/es/menu'

import styles from './index.less'

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: UserItem
  menu?: boolean
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = props => {
  const onMenuClick = (event: ClickParam) => {
    const { key } = event

    if (key === 'logout') {
      const { dispatch } = props

      if (dispatch) {
        dispatch({
          type: 'user/logout',
        })
      }

      return
    }
    if (key === 'profile') {
      history.push('/account/profile')
    }

    history.push(`/account/${key}`)
  }

  const { currentUser, menu } = props

  const { formatMessage } = useIntl()
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="profile">
        <UserOutlined />
        {formatMessage({ id: 'menu.profile' })}
      </Menu.Item>
      {/* <Menu.Item key="history">
        <HistoryOutlined />
        {formatMessage({ id: 'menu.history' })}
      </Menu.Item>
      <Menu.Divider /> */}
      <Menu.Item key="logout">
        <LogoutOutlined />
        {formatMessage({ id: 'user.logout' })}
      </Menu.Item>
    </Menu>
  )
  return currentUser ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          icon={<UserOutlined />}
          size="small"
          className={styles.avatar}
          src={currentUser.avatarUrl}
          alt="avatar"
        />
        <span className={styles.name}>
          {currentUser.firstName ||
            formatMessage({ id: 'user.info.anonymous' })}
        </span>
      </span>
    </HeaderDropdown>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  )
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown)
