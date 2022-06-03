import React from 'react'
import { ConnectProps, Access, useAccess } from 'umi'
import styles from './index.less'
import Avatar from './AvatarDropdown'
import LinkOdoo from '../LinkOdoo'
import SelectLang from '../SelectLang'
export type SiderTheme = 'light' | 'dark'

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  theme?: SiderTheme
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const { theme } = props
  const access = useAccess()

  let className = styles.right

  if (theme === 'dark') {
    className = `${styles.dark}`
  }

  return (
    <div className={className}>
      <Access accessible={access.canLinkToOdoo} fallback={<></>}>
        <LinkOdoo />
      </Access>
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  )
}

export default GlobalHeaderRight
