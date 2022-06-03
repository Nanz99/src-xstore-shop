import React, { useEffect } from 'react'
import ProLayout, {
  MenuDataItem,
  DefaultFooter,
  Settings,
  BasicLayoutProps as ProLayoutProps,
} from '@ant-design/pro-layout'
import {
  Link,
  connect,
  Dispatch,
  useIntl,
  useAccess,
  useModel,
  SettingsItem,
} from 'umi'
import RightContent from '@/components/GlobalHeader/RightContent'
import { ConnectState } from '@/models/connect'
import styles from './BasicLayout.less'
import { WindowsOutlined } from '@ant-design/icons'

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem
  }
  collapsed: boolean
  settings: Settings
  // route: ProLayoutProps['route'];
  dispatch: Dispatch
  settingClient: SettingsItem
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem
  }
}

interface MenuCustomItem extends MenuDataItem {
  access: string | string[]
  children: MenuCustomItem[]
}

const customFooter = (
  <DefaultFooter
    copyright="Anh Nhut 2021"
    links={[
      {
        key: 'official-website',
        title: 'Official Website',
        href: 'https://vndigitech.com',
        blankTarget: true,
      },
    ]}
  />
)

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings, settingClient, collapsed } = props
  const { initialState, error, refresh, setInitialState } = useModel(
    '@@initialState',
  )
  const access = useAccess()
  const { formatMessage } = useIntl()
  const menuDataRender = (menuList: MenuCustomItem[]) =>
    menuList
      .map(item => {
        const localItem = {
          ...item,
          children: item.children ? menuDataRender(item.children) : [],
        }
        if (!localItem.access) return localItem as MenuDataItem
        if (typeof localItem.access === 'string' && access[localItem.access])
          return localItem as MenuDataItem
        if (Array.isArray(localItem.access)) {
          for (let i = 0; i < localItem.access.length; i++) {
            if (access[localItem.access[i]]) return localItem as MenuDataItem
          }
        }
        return null
      })
      .filter(e => e !== null && e !== undefined)

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      })
    }
  }

  useEffect(() => {
    const user = initialState?.user
    if (user) {
      if (user.accessToken) {
        if (user.currentUser === undefined) {
          setTimeout(() => {
            // Apply when re-reder left menu side bar
            //window.location.reload()
            // Apply when re-render Access components
            refresh()
          }, 400)
        }
      }
    }
  }, [initialState?.isLogin])

  useEffect(() => {
    if (initialState?.settingClient) {
      dispatch({
        type: 'settingClient/setSettingClient',
        payload: initialState?.settingClient,
      })
    }
  }, [initialState])

  // const title = initialState?.settingClient
  //   ? initialState?.settingClient?.website_name
  //   // : 'Digitech Solutions'
  //   : settingClient.setting.website_name
  // const logoUrl = initialState?.settingClient
  //   ? initialState?.settingClient?.logo
  //   // : '/logo-robot.png'
  //   : settingClient.setting.logo

  const title =
    settingClient && settingClient.setting && settingClient.setting.website_name
  const logoUrl =
    settingClient && settingClient.setting && settingClient.setting.logo
  return (
    <ProLayout
      navTheme="realDark"
      title={title}
      logo={
        collapsed ? (
          <img
            style={{ width: '32px', height: 'auto' }}
            // src="/logo-robot.png"
            src="/ccp/short_logo_ccentre.ico"
          />
        ) : (
          <img
            style={{ width: '170px', height: 'auto' }}
            // src="/logo-robot.png"
            // src={initialState.settings?.logo}
            src={logoUrl}
          />
        )
      }
      formatMessage={formatMessage}
      menuHeaderRender={logoDom => <Link to="/">{logoDom}</Link>}
      onCollapse={handleMenuCollapse}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({ id: 'menu.home' }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        )
      }}
      rightContentRender={() => <RightContent />}
      menuDataRender={menuDataRender}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          menuItemProps.children ||
          !menuItemProps.path
        ) {
          return defaultDom
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>
      }}
      className={styles.customContentLayout}
      footerRender={() => customFooter}
      {...props}
      {...settings}
    >
      {children}
    </ProLayout>
  )
}

export default connect(({ global, settingClient }: ConnectState) => ({
  collapsed: global.collapsed,
  settingClient,
}))(BasicLayout)
