import React, { useEffect } from 'react'
import { MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout'
import {
  Link,
  formatMessage,
  ConnectProps,
  connect,
  useIntl,
  Dispatch,
  SettingsItem,
  useModel,
  SettingClientItem,
} from 'umi'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import styles from './UserLayout.less'
import SelectLang from '@/components/SelectLang'
import { ConnectState } from '@/models/connect'
import { Card } from 'antd'

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem
  }
  dispatch: Dispatch
  settings: SettingsItem
  settingClient: SettingClientItem
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
    children,
    location = {
      pathname: '',
    },
    dispatch,
    settings,
    settingClient,
  } = props
  console.log(
    '🚀 ~ file: UserLayout.tsx ~ line 42 ~ settingClient',
    settingClient,
  )

  const { routes = [] } = route
  const { breadcrumb } = getMenuData(routes)
  const { formatMessage } = useIntl()
  const customizeTitle = formatMessage({ id: 'login.loginPage' })
  const { initialState, error, refresh, setInitialState } = useModel(
    '@@initialState',
  )
  console.log(
    '🚀 ~ file: UserLayout.tsx ~ line 49 ~ initialState',
    initialState,
  )
  const titlePage = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    title: customizeTitle,
    ...props,
  })

  useEffect(() => {
    if (initialState?.settingClient) {
      dispatch({
        type: 'settingClient/setSettingClient',
        payload: initialState?.settingClient,
      })
    }
  }, [initialState])

  const logoUrl = settingClient && settingClient.logo

  return (
    <HelmetProvider>
      <Helmet>
        <title>{titlePage}</title>
        <meta name="description" content={titlePage} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <Card size="small" className={styles.card}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/login">
                  <img
                    style={{ height: '80px' }}
                    alt="logo"
                    // src={
                    //   initialState
                    //     ? initialState.settingClient?.logo
                    //     : 'logo.png'
                    // }
                    src={logoUrl}
                  />
                </Link>
              </div>
            </div>
            {children}
          </Card>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default connect(({ settings, settingClient }: ConnectState) => ({
  ...settings,
  settingClient: settingClient.setting,
}))(UserLayout)
