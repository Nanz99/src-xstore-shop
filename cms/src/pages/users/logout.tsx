import React, { Fragment, useEffect } from 'react'

import { connect, Dispatch } from 'umi'
import { ConnectState } from '@/models/connect'

interface LogoutProps {
  dispatch: Dispatch
}

const Logout: React.FC<LogoutProps> = props => {
  const { dispatch } = props
  useEffect(() => {
    dispatch({
      type: 'user/logout',
    })
  }, [])

  return <Fragment></Fragment>
}

export default connect(({ loading }: ConnectState) => ({
  submitting: loading.effects['user/logout'],
}))(Logout)
