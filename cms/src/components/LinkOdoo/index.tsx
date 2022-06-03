import {
  GlobalOutlined,
  PlusCircleOutlined,
  ApiOutlined,
} from '@ant-design/icons'
import { getLocale, setLocale, useIntl, history } from 'umi'
import React, { useMemo, useState } from 'react'
import HeaderDropdown from '../HeaderDropdown'
import classNames from 'classnames'
import styles from './index.less'
import { Button } from 'antd'
import { createOdooSSO } from '@/services/common.service'

interface LinkOdooProps {
  className?: string
}

const LinkOdoo: React.FC<LinkOdooProps> = props => {
  const { className } = props
  const { formatMessage } = useIntl()
  const [fetching, setFetching] = useState(false)

  const linkToOdoo = async () => {
    setFetching(true)
    const result = await createOdooSSO()

    if (result && result.success) {
      const { uid_token: tokenData } = result
      let ssoUrl = ENV_ODOO_WEBSITE + '/web/loginCustom'
      ssoUrl += '?token='
      ssoUrl += tokenData

      window.open(ssoUrl, '_blank')
    }
    setFetching(false)
  }

  return fetching ? (
    <Button
      style={{ border: '1px dashed #0070b8' }}
      loading={fetching}
      shape="round"
      type="dashed"
      block
    >
      {formatMessage({ id: 'product.processing' })}
    </Button>
  ) : (
    <Button
      style={{ border: '1px dashed #0070b8' }}
      shape="round"
      type="dashed"
      block
      onClick={() => {
        linkToOdoo()
      }}
    >
      <ApiOutlined style={{ color: '#0070b8' }} />
      {formatMessage({ id: 'product.linkToERP' })}
    </Button>
  )
}

export default LinkOdoo
