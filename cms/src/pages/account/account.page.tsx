import { AccountItem } from '@/models/account.model'
import { ConnectState } from '@/models/connect'
import { CustomerItem } from '@/models/customer.model'
import { OperatorItem } from '@/models/operator.model'
import { deactiveAccountService } from '@/services/account.service'
import { ACCOUNT_STATUS, UserRole } from '@/utils/constants'
import {
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  PlusCircleOutlined,
  UnlockOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Row,
  Switch,
  Table,
  Tabs,
  Tag,
} from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Access,
  connect,
  Dispatch,
  history,
  useIntl,
  useLocation,
  useModel,
  useAccess,
} from 'umi'
import CreateView from './create.view'
import styles from './style.less'

const { TabPane } = Tabs

class Params {
  page: number = 1
  limit: number = 10
  fullName?: string
  email?: string
}

interface AccountProps {
  listAccount?: AccountItem[]
  listCustomer?: CustomerItem[]
  listOperator?: OperatorItem[]
  totalAccount: number
  totalCustomer: number
  totalOperator: number
  loadingAccount: boolean
  loadingCustomer: boolean
  loadingOperator: boolean
  dispatch: Dispatch
}

const Account: React.FC<AccountProps> = props => {
  const {
    listAccount,
    listCustomer,
    listOperator,
    totalAccount,
    totalCustomer,
    totalOperator,
    loadingAccount,
    loadingCustomer,
    loadingOperator,
    dispatch,
  } = props
  const access = useAccess()
  const [params, setParams] = useState(new Params())
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()
  const [visibleCreateView, setVisibleCreateView] = useState(false)
  const { initialState, error, refresh, setInitialState } = useModel(
    '@@initialState',
  )

  // Fetch API
  const fetch = () => {
    dispatch({ type: 'account/getListAccountModel', payload: params })
    dispatch({ type: 'customer/getListCustomerModel', payload: params })
    dispatch({ type: 'operator/getListOperatorModel', payload: params })
  }

  // Fetch eachtime Params is changed
  useMemo(() => {
    fetch()
  }, [params])

  // Init switch status
  const InitSwitchStatus = values => {
    if (values === 2) {
      return true
    }
    return false
  }

  // Handle change tab bar
  const handleChangeTab = value => {
    fetch()
  }

  // Handle change active user
  const handleChangeActive = async (checked, values) => {
    let res = {}
    let tempValue = {
      email: values.email,
      status: 0,
    }
    if (checked) {
      tempValue.status = ACCOUNT_STATUS.DEACTIVE
      res = await deactiveAccountService(tempValue)
    } else {
      tempValue.status = ACCOUNT_STATUS.ACTIVE
      res = await deactiveAccountService(tempValue)
    }
    if (typeof res.status === 'number') {
      if (values.status === ACCOUNT_STATUS.ACTIVE) {
        message.success(formatMessage({ id: 'account.lockOperator' }))
      } else {
        message.success(formatMessage({ id: 'account.unlockOperator' }))
      }
      fetch()
    } else {
      message.error(formatMessage({ id: 'order.changeError' }))
      fetch()
    }
  }

  // Display total item list
  const showTotal = total => {
    return `${formatMessage({ id: 'account.totalItem' })} ${total}`
  }

  // Display role on table
  const showRole = value => {
    switch (value) {
      case 'CUSTOMER':
        return <Tag color="green">{value}</Tag>
      case 'OPERATOR':
        return <Tag color="blue">{value}</Tag>
      case 'ADMIN':
        return <Tag color="red">{value}</Tag>
      default:
        return (
          <Tag color="default">{formatMessage({ id: 'common.empty' })}</Tag>
        )
    }
  }

  // Display active toggle on table
  const showActiveToggle = values => {
    const role = initialState?.user?.currentUser?.role
    switch (role) {
      case 'OPERATOR': {
        // if (values.role === UserRole.ADMIN) {
        //   return (<Switch
        //     disabled={true}
        //     className={styles.switchAnt}
        //     checked={InitSwitchStatus(values.status)}
        //     checkedChildren={<div><LockOutlined /></div>}
        //     unCheckedChildren={<div><UnlockOutlined /></div>}
        //     onChange={e => {
        //       handleChangeActive(e, values)
        //     }}
        //     />)
        // } else {
        //   return (<Switch
        //     disabled={true}
        //     className={styles.switchAnt}
        //     checked={InitSwitchStatus(values.status)}
        //     checkedChildren={<div><LockOutlined /></div>}
        //     unCheckedChildren={<div><UnlockOutlined /></div>}
        //     onChange={e => {
        //       handleChangeActive(e, values)
        //     }}
        //     />)
        // }
        return
      }
      case 'ADMIN':
        return (
          <Switch
            className={styles.switchAnt}
            checked={InitSwitchStatus(values.status)}
            checkedChildren={
              <div>
                <LockOutlined />
              </div>
            }
            unCheckedChildren={
              <div>
                <UnlockOutlined />
              </div>
            }
            onChange={e => {
              handleChangeActive(e, values)
            }}
          />
        )
      default:
        return (
          <Tag color="default">{formatMessage({ id: 'common.empty' })}</Tag>
        )
    }
  }

  const handleShowCreateView = () => {
    setVisibleCreateView(true)
  }

  const handleCancelCreateView = () => {
    setVisibleCreateView(false)
  }

  // Handle Change Data Table
  const onTableChange = (page: number) => {
    const newParams = { ...params }
    if (params.page !== page) {
      newParams.page = page
    }
    setParams(newParams)
  }

  // Handle Change Display Size
  const onShowSizeChange = (current: number, size: number) => {
    if (params.limit !== size) {
      params.limit = size
    }
  }

  // Handle Search Name
  let onChangeName = name => {
    setParams({
      ...params,
      fullName: name,
    })
  }
  onChangeName = debounce(onChangeName, 600)

  // Handle Search Email
  let onChangeEmail = email => {
    setParams({
      ...params,
      email: email,
    })
  }
  onChangeEmail = debounce(onChangeEmail, 600)

  // Column Table
  const columnsAll: ColumnProps<AccountItem>[] = [
    {
      title: formatMessage({ id: 'account.index' }),
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },
    {
      title: formatMessage({ id: 'account.name' }),
      key: 'basicInfo',
      align: 'center',
      render: values => {
        return (
          <div>
            <a
              onClick={() => {
                history.push(`account/profile/${values.id}`)
              }}
            >
              {values.firstName || 'empty'}&nbsp;
              {values.lastName || 'empty'}
            </a>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'account.email' }),
      key: 'basicInfo',
      align: 'center',
      render: values => {
        return (
          <div>
            <p>{values.email}</p>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'account.role' }),
      key: 'basicInfo',
      align: 'center',
      render: values => {
        return <div>{showRole(values.role)}</div>
      },
    },
    {
      title: formatMessage({ id: 'account.action' }),
      key: 'basicInfo',
      align: 'center',
      render: values => {
        return (
          <div>
            <Button
              onClick={() => history.push(`account/profile/${values.id}`)}
              type="link"
              icon={<EyeOutlined />}
            >
              View
            </Button>
          </div>
        )
      },
    },
  ]

  const columnsOperator: ColumnProps<AccountItem>[] = [
    {
      title: formatMessage({ id: 'account.index' }),
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },
    {
      title: formatMessage({ id: 'account.name' }),
      key: 'basicInfo',
      align: 'center',
      render: values => {
        return (
          <div>
            <a
              onClick={() => {
                history.push(`account/profile/${values.id}`)
              }}
            >
              {values.firstName || 'empty'}&nbsp;
              {values.lastName || 'empty'}
            </a>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'account.email' }),
      key: 'basicInfo',
      align: 'center',
      render: values => {
        return (
          <div>
            <p>{values.email}</p>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'account.role' }),
      key: 'basicInfo',
      align: 'center',
      render: values => {
        return <div>{showRole(values.role)}</div>
      },
    },
    {
      title: formatMessage({ id: 'account.action' }),
      key: 'basicInfo',
      align: 'center',
      render: values => {
        return (
          <div>
            <Button
              onClick={() => history.push(`account/profile/${values.id}`)}
              type="link"
              icon={<EyeOutlined />}
            >
              View
            </Button>
            {showActiveToggle(values)}
          </div>
        )
      },
    },
  ]

  return (
    <PageHeaderWrapper>
      <Card
        extra={
          <Row gutter={[16, 16]}>
            <Col>
              <Input.Search
                onChange={e => onChangeEmail(e.target.value)}
                placeholder={formatMessage({ id: 'account.email' })}
                name="email"
                prefix={<MailOutlined />}
                allowClear
              />
            </Col>
            <Col>
              <Input.Search
                onChange={e => onChangeName(e.target.value)}
                placeholder={formatMessage({ id: 'account.account' })}
                name="name"
                prefix={<UserOutlined />}
                allowClear
              />
            </Col>
          </Row>
        }
      >
        <Access
          accessible={access.canReadAccount}
          fallback={
            <Button
              disabled={true}
              type="dashed"
              block
              onClick={handleShowCreateView}
            >
              <PlusCircleOutlined />
              {formatMessage({ id: 'account.createNew' })}
            </Button>
          }
        >
          <Button type="dashed" block onClick={handleShowCreateView}>
            <PlusCircleOutlined />
            {formatMessage({ id: 'account.createNew' })}
          </Button>
        </Access>
        <Tabs defaultActiveKey="1" onChange={handleChangeTab}>
          <TabPane
            tab={<span>{formatMessage({ id: 'account.all' })}</span>}
            key="1"
          >
            <Table
              columns={columnsAll}
              dataSource={listAccount}
              rowKey="id"
              loading={loadingAccount}
              pagination={{
                showSizeChanger: true,
                current: params.page,
                pageSize: params.limit,
                total: totalAccount,
                showTotal: showTotal,
                onChange: onTableChange,
                onShowSizeChange: onShowSizeChange,
              }}
            />
          </TabPane>
          <TabPane
            tab={<span>{formatMessage({ id: 'account.customer' })}</span>}
            key="2"
          >
            <Table
              columns={columnsAll}
              dataSource={listCustomer}
              rowKey="id"
              loading={loadingCustomer}
              pagination={{
                showSizeChanger: true,
                current: params.page,
                pageSize: params.limit,
                total: totalCustomer,
                showTotal: showTotal,
                onChange: onTableChange,
                onShowSizeChange: onShowSizeChange,
              }}
            />
          </TabPane>
          <TabPane
            tab={<span>{formatMessage({ id: 'account.operator' })}</span>}
            key="3"
          >
            <Table
              columns={columnsOperator}
              dataSource={listOperator}
              rowKey="id"
              loading={loadingOperator}
              pagination={{
                showSizeChanger: true,
                current: params.page,
                pageSize: params.limit,
                total: totalOperator,
                showTotal: showTotal,
                onChange: onTableChange,
                onShowSizeChange: onShowSizeChange,
              }}
            />
          </TabPane>
        </Tabs>
        <Modal
          maskClosable={false}
          visible={visibleCreateView}
          centered={true}
          title={<strong>{formatMessage({ id: 'account.createNew' })}</strong>}
          onCancel={handleCancelCreateView}
          footer={false}
          width={650}
        >
          <CreateView handleCancelCreateView={handleCancelCreateView} />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(
  ({ account, customer, operator, loading }: ConnectState) => ({
    loadingAccount: loading.effects['account/getAccount'],
    loadingCustomer: loading.effects['customer/getCustomer'],
    loadingOperator: loading.effects['operator/getOperator'],
    listAccount: account?.listAccount || [],
    listCustomer: customer?.listCustomers || [],
    listOperator: operator?.listOperators || [],
    totalAccount: account.total,
    totalCustomer: customer.total,
    totalOperator: operator.total,
  }),
)(Account)
