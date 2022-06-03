import React, { useState, useEffect, useMemo } from 'react'
import {
  Dispatch,
  useIntl,
  useLocation,
  getLocale,
  connect,
  history,
} from 'umi'
import { OrderItem } from '@/models/order.model'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import {
  Card,
  Table,
  Tag,
  Row,
  Col,
  Radio,
  Input,
  Typography,
  Button,
  Statistic,
  Divider,
  Select,
  Tooltip,
  message,
  Modal
} from 'antd'
import { ConnectState } from '@/models/connect'
import { ColumnProps } from 'antd/lib/table'
import numeral from 'numeral'
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  InboxOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { render } from 'react-dom'
import { debounce, values, isArray } from 'lodash'
import { convertDateToInt, formatDate } from '@/utils/utils'
import {
  getListOrderService,
  // syncAllOrders,
  checkSyncAllOrders,
  syncOrders,
} from '@/services/order.service'

const { Search } = Input
const { Title, Paragraph, Text } = Typography
const { Option } = Select

class Params {
  page: number = 1
  limit: number = 10
  id?: string
  orderStatus?: string
  stockoutStatus?: string
  sortByDate?: string
  verified?: boolean
}

interface OrderProps {
  listOrder?: OrderItem[]
  total: number
  loading: boolean
  dispatch: Dispatch
}

const Order: React.FC<OrderProps> = props => {
  const { listOrder, dispatch, total, loading } = props
  const [params, setParams] = useState(new Params())
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()
  const locale = getLocale()
  const [totalStatus, setTotalStatus] = useState({
    waitingOrder: 0,
    needDelivery: 0,
    delivering: 0,
    delivered: 0,
  })
 

  const [fetching, setFetching] = useState(false)

  const [destroyForm, setDestroyForm] = useState(false)
  const [asynchronousOrders, setAsynchronousOrders] = useState(0)
  const [visibleCheckSyncForm, setVisibleCheckSyncForm] = useState(false)
  
  //Search follow id
  let handleSearch = values => {
    setParams({
      ...params,
      id: values,
    })
  }
  handleSearch = debounce(handleSearch, 600)

  //Status Filter
  let handleOnChangeOrderStatus = (status) => {
    setParams({
      ...params,
      orderStatus: status,
    })
  }
  handleOnChangeOrderStatus = debounce(handleOnChangeOrderStatus, 600)

  //Stockout Filter
  let handleOnChangeStockoutStatus = status => {
    setParams({
      ...params,
      stockoutStatus: status,
    })
  }
  handleOnChangeStockoutStatus = debounce(handleOnChangeStockoutStatus, 600)

  const onTableChange = (page: number) => {
    const newParams = { ...params }
    if (params.page !== page) {
      newParams.page = page
    }

    setParams(newParams)
  }

  const onShowSizeChange = (current: number, size: number) => {
    if (params.limit !== size) {
      params.limit = size
    }
  }

  const showTotal = (total: number) => {
    return `${formatMessage({ id: 'product.totalItem' })} ${total}`
  }

  const getStatistic = async () => {
    const tempParams1 = {
      page: 1,
      limit: 999999,
      orderStatus: 'NEW',
      stockoutStatus: undefined,
    }
    const tempParams2 = {
      page: 1,
      limit: 999999,
      orderStatus: 'PROCESSING',
      stockoutStatus: 'INCOMPLETE',
    }
    const tempParams3 = {
      page: 1,
      limit: 999999,
      orderStatus: 'DELIVERING',
    }
    const tempParams4 = {
      page: 1,
      limit: 999999,
      orderStatus: 'DONE',
      stockoutStatus: 'COMPLETED',
    }
  
    const res1 = await getListOrderService(tempParams1)
    const res2 = await getListOrderService(tempParams2)
    const res3 = await getListOrderService(tempParams3)
    const res4 = await getListOrderService(tempParams4)
    
   
    if (res1.data && res2.data && res3.data && res4.data) {
      return setTotalStatus({
        waitingOrder: res1.total,
        needDelivery: res2.total,
        delivering: res3.total,
        delivered: res4.total,
      })
    }
  }

  const showOrderStatus = value => {
    switch (value) {
      case 0:
        return (
          <Tag color="blue"> {formatMessage({ id: 'order.statusNEW' })} </Tag>
        )
      case 1:
        return (
          <Tag color="gold">
            {' '}
            {formatMessage({ id: 'order.statusPROCESSING' })}{' '}
          </Tag>
        )
        case 2:
          return (
            <Tag color="lime">
               {formatMessage({ id: 'order.statusDELIVERING' })}{' '}
            </Tag>
          )  
      case 3:
        return (
          <Tag color="green"> {formatMessage({ id: 'order.statusDONE' })} </Tag>
        )
      case 4:
        return (
          <Tag color="red"> {formatMessage({ id: 'order.statusREJECT' })} </Tag>
        )
      default:
        return (
          <Tag color="default"> {formatMessage({ id: 'common.empty' })} </Tag>
        )
    }
  }

  const showStockoutStatus = value => {
    switch (value) {
      case 0:
        return (
          <Tag color="orange">
            {' '}
            {formatMessage({ id: 'order.statusINCOMPLETE' })}{' '}
          </Tag>
        )
      case 1:
        return (
          <Tag color="geekblue">
            {' '}
            {formatMessage({ id: 'order.statusCOMPLETED' })}{' '}
          </Tag>
        )
      default:
        return (
          <Tag color="default"> {formatMessage({ id: 'common.empty' })} </Tag>
        )
    }
  }

  //Date Sort
  let handleChangeSortDate = sort => {
    setParams({
      ...params,
      sortByDate: sort,
    })
  }

  //Fetch
  const fetch = async () => {
    await checkSyncAllOrders()
    dispatch({ type: 'order/getListOrderModel', payload: params })
  }

  useMemo(() => {
    fetch()
    getStatistic()
  }, [params])

  const columns: ColumnProps<OrderItem>[] = [
    {
      title: formatMessage({ id: 'order.index' }),
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },
    {
      title: formatMessage({ id: 'order.order' }),
      render: value => {
        return (
          <div>
            <div>
              <a
                onClick={() => {
                  history.push(
                    `/orders/${value.id}?status=${value.orderStatus}`,
                  )
                }}
              >
                ID: #{value.id}
              </a>
            </div>
            <div>{showOrderStatus(value.orderStatus)}</div>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'order.price' }),
      render: value => {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'order.shipPrice' })}:{' '}
              {value && value.shippingFee ? (
                <Tag color="geekblue">
                  {numeral(value.shippingFee).format(0, 0) || ''} đ
                </Tag>
              ) : (
                <Tag color="geekblue">Free</Tag>
              )}
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'stockin.subTotal' })}:{' '}
              {value && value.shippingFee ? (
                <Tag color="geekblue">
                  {numeral(value.subTotal).format(0, 0) || ''} đ
                </Tag>
              ) : (
                <Tag color="geekblue">Free</Tag>
              )}
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'stockin.grandTotal' })}:{' '}
              <Tag color="geekblue">
                {numeral(value.grandTotal).format(0, 0) || ''} đ
              </Tag>
            </Paragraph>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'order.date' }),
      render(value) {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'order.detailCreateAt' })}:{' '}
              <Tag color="magenta">
                <CalendarOutlined /> {formatDate(value.createdAt) || ''}
              </Tag>
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'order.detailUpdateAt' })}:{' '}
              <Tag color="magenta">
                <CalendarOutlined /> {formatDate(value.updatedAt) || ''}
              </Tag>
            </Paragraph>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'order.payment_method' }),
      align: 'center',
      render(value) {
        return (
          <Tag color="cyan">
           { value.payment_type}
          </Tag>
        )
      },
    },
    // {
    //   title: formatMessage({ id: 'order.stockoutStatus' }),
    //   render(value) {
    //     return <div>{showStockoutStatus(value.stockoutStatus)}</div>
    //   },
    // },
    {
      title: formatMessage({ id: 'stockout.action' }),
      render(value) {
        return (
          <div>
            <Button
              onClick={() => history.push(`/orders/${value.id}`)}
              type="link"
              icon={<EyeOutlined />}
            >
              {formatMessage({ id: 'order.viewDetail' })}
            </Button>
          </div>
        )
      },
    },

    // # Sync each orders
    // {
    //   title: formatMessage({ id: 'product.action' }),
    //   align: 'center',
    //   key: 'status',
    //   render: values => {
    //     return (
    //       <div>
    //         {values.isSyncOdoo === true ? (
    //           <Button style={{ marginBottom: '12px' }} shape="round" disabled>
    //             {formatMessage({ id: 'product.synced' })}
    //           </Button>
    //         ) : (
    //           <Button
    //             style={{ marginBottom: '12px' }}
    //             loading={fetching}
    //             shape="round"
    //             type="primary"
    //             onClick={() => {
    //               handleSyncOrders(values.id)
    //             }}
    //           >
    //             {formatMessage({ id: 'product.sync' })}
    //           </Button>
    //         )}
    //       </div>
    //     )
    //   },
    // },
  ]

  // Sync category flow

  const handleCancelCheckSyncForm = () => {
    setDestroyForm(true)
    setVisibleCheckSyncForm(false)
    fetch()
  }


  const hanldeCheckSyncAllOrders = async () => {
    setFetching(true)
    const res = await checkSyncAllOrders()
    if (res && isArray(res.ordersNotSync) && res.ordersNotSync.length > 0) {
      setAsynchronousOrders(res.ordersNotSync.length)
      setVisibleCheckSyncForm(true)
    } else if (res && res.statusCode) {
      message.error(formatMessage({ id: 'product.syncFail' }))
    } else {
      message.info(formatMessage({ id: 'product.syncedAll' }))
    }
    setFetching(false)
    fetch()
  }

  // const handleSyncAllCategory = async () => {
  //   setFetching(true)
  //   const result = await syncAllCategory()
  //   if (result && result.success && !result.statusCode) {
  //     message.success(formatMessage({ id: 'product.syncSuccess' }))
  //   } else {
  //     message.error(formatMessage({ id: 'product.syncFail' }))
  //   }
  //   setVisibleCheckSyncForm(false)
  //   setFetching(false)
  //   fetch()
  // }

  const handleSyncOrders = async id => {
    setFetching(true)

    const result = await syncOrders({ id })

    if (result && result.success && !result.statusCode) {
      message.success(formatMessage({ id: 'product.syncSuccess' }))
    } else {
      message.error(formatMessage({ id: 'product.syncFail' }))
    }
    setFetching(false)
    fetch()
  }

  return (
    <PageHeaderWrapper>
      <Card size="small" style={{ marginBottom: '24px' }}>
        <Row justify="space-around">
          <Col>
            <Statistic
              style={{ textAlign: 'center' }}
              title="Not Payment"
              value={totalStatus.waitingOrder}
              prefix={<InboxOutlined />}
            />
          </Col>
          <Col>
            <Statistic
              style={{ textAlign: 'center' }}
              title="Need Delivery"
              value={totalStatus.needDelivery}
              prefix={<InboxOutlined />}
            />
          </Col>
          <Col>
            <Statistic
              style={{ textAlign: 'center' }}
              title="Delivering"
              value={totalStatus.delivering}
              prefix={<InboxOutlined />}
            />
          </Col>
          <Col>
            <Statistic
              style={{ textAlign: 'center' }}
              title="Delivered"
              value={totalStatus.delivered}
              prefix={<InboxOutlined />}
            />
          </Col>
        </Row>
      </Card>
      <Card size="small" style={{ padding: '6px 12px 6px 12px' }}>
        <Row>
          <Col span={14}>
            <Radio.Group
              optionType="button"
              defaultValue={undefined}
              onChange={e => handleOnChangeOrderStatus(e.target.value)}
            >
              <Radio.Button value={undefined}>
                {formatMessage({ id: 'order.all' })}
              </Radio.Button>
              <Radio.Button value="NEW">
                {formatMessage({ id: 'order.statusNEW' })}
              </Radio.Button>
              <Radio.Button value="PROCESSING">
                {formatMessage({ id: 'order.statusPROCESSING' })}
              </Radio.Button>
              <Radio.Button value="DELIVERING">
              {formatMessage({ id: 'order.statusDELIVERING' })}
              </Radio.Button>
              <Radio.Button value="DONE">
                {formatMessage({ id: 'order.statusDONE' })}
              </Radio.Button>
              <Radio.Button value="REJECT">
                {formatMessage({ id: 'order.statusREJECT' })}
              </Radio.Button>
            </Radio.Group>
          </Col>
          <Col
            span={10}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {/* <Radio.Group
              optionType="button"
              buttonStyle="solid"
              defaultValue={undefined}
              onChange={e => handleOnChangeStockoutStatus(e.target.value)}
            >
              <Radio.Button value={undefined}>
                {formatMessage({ id: 'order.all' })}
              </Radio.Button>
              <Radio.Button value="COMPLETED">
                {formatMessage({ id: 'order.statusCOMPLETED' })}
              </Radio.Button>
              <Radio.Button value="INCOMPLETE">
                {formatMessage({ id: 'order.statusINCOMPLETE' })}
              </Radio.Button>
            </Radio.Group> */}

            {/* Filter stockout state */}
            <Button
              style={{ width: '28%', marginLeft: 15 }}
              loading={fetching}
              type="primary"
              block
              onClick={() => {
                hanldeCheckSyncAllOrders()
              }}
            >
              <SyncOutlined />
              {formatMessage({ id: 'product.sync' })}
            </Button>
            {/* <Select
              placeholder={formatMessage({ id: 'order.stockoutStatus' })}
              style={{ width: 120, marginLeft: '8px' }}
              onChange={handleOnChangeStockoutStatus}
              allowClear
            >
              <Option value={undefined}>
                {formatMessage({ id: 'order.sortAll' })}
              </Option>
              <Option value="COMPLETED">
                {formatMessage({ id: 'order.statusCompleted' })}
              </Option>
              <Option value="INCOMPLETE">
                {formatMessage({ id: 'order.statusIncomplete' })}
              </Option>
            </Select> */}

            {/* Sort date */}
            <Select
              placeholder={formatMessage({ id: 'product.sortDate' })}
              style={{ width: 120, marginLeft: '5px' }}
              onChange={handleChangeSortDate}
              allowClear
            >
              <Option value="ALL">
                {formatMessage({ id: 'product.sortAll' })}
              </Option>
              <Option value="ASC">
                {formatMessage({ id: 'product.sortAsc' })}
              </Option>
              <Option value="DESC">
                {formatMessage({ id: 'product.sortDesc' })}
              </Option>
            </Select>

            <Input.Search
              style={{ width: 140, marginLeft: '5px' }}
              onSearch={value => handleSearch(value)}
              placeholder="Search #ID"
              name="name"
              allowClear
            />
          </Col>
        </Row>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={listOrder}
          loading={loading}
          scroll={{ x: 768 }}
          pagination={{
            showSizeChanger: true,
            current: params.page,
            pageSize: params.limit,
            total: total,
            showTotal: showTotal,
            onChange: onTableChange,
            onShowSizeChange: onShowSizeChange,
          }}
        />
      </Card>
      <Modal
        title={formatMessage({ id: 'product.checkSync' })}
        visible={visibleCheckSyncForm}
        centered={true}
        // onOk={handleSyncAllOrders}
        onOk={handleCancelCheckSyncForm}
        onCancel={handleCancelCheckSyncForm}
        destroyOnClose={destroyForm}
        okText={formatMessage({ id: 'product.accept' })}
        cancelText={formatMessage({ id: 'product.cancel' })}
      >
        <p>
          {formatMessage({ id: 'product.beforeSyncAllFirstText' })}{' '}
          <b>{asynchronousOrders}</b>{' '}
          {formatMessage({ id: 'product.beforeSyncAllOrderSecondText' })}
        </p>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default connect(({ order, loading }: ConnectState) => ({
  loading: loading.effects['order/getListOrderModel'],
  listOrder: order.listOrder || [],
  total: order.total,
}))(Order)
