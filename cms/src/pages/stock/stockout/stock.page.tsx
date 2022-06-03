import React, { useState, useEffect, useMemo } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import {
  Card,
  Table,
  Button,
  Modal,
  Input,
  notification,
  Tag,
  Row,
  Col,
  Radio,
  Tabs,
  Typography,
  message,
  Select,
} from 'antd'
import {
  useIntl,
  Dispatch,
  useLocation,
  connect,
  getLocale,
  history,
} from 'umi'
import numeral from 'numeral'
import { StockoutItem } from '@/models/stockout.model'
import { OrderItem } from '@/models/order.model'
import { ProductItem } from '@/models/product.model'
import { ColumnProps } from 'antd/lib/table'
import { ConnectState } from '@/models/connect'
import { debounce, isEmpty, values } from 'lodash'
import {
  EditOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MailOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { format } from 'prettier'
import styles from './style.less'
import dayjs from 'dayjs'
// import EditStockoutForm from './Stockout.edit.page';
import CreateStockoutForm from './stock.create.page'
import ExportStockoutForm from './stock.exportid.page'

import {
  getDetailOrderService,
  putOrderStatusService,
} from '@/services/order.service'
import { formatDate } from '@/utils/utils'
// import { deleteStockoutService } from '@/services/categories.service';

const { TabPane } = Tabs
const { Title, Paragraph, Text, Link } = Typography
const { Option } = Select

class Params {
  page: number = 1
  limit: number = 10
  id?: number
  verified?: boolean
  stockoutStatus: string = 'INCOMPLETE'
  sortByDate?: string
}

class ParamsProduct {
  page: number = 1
  limit: number = 999999
}

interface StockoutProps {
  listStockout?: StockoutItem[]
  listOrder?: OrderItem[]
  listProduct?: ProductItem[]
  stockoutTotal: number
  orderTotal: number
  loadingStockout: boolean
  loadingOrder: boolean
  loadingProduct: boolean
  dispatch: Dispatch
}

const Stockout: React.FC<StockoutProps> = props => {
  const {
    dispatch,
    listStockout,
    listOrder,
    listProduct,
    orderTotal,
    stockoutTotal,
    loadingStockout,
    loadingOrder,
    loadingProduct,
  } = props
  const [params, setParams] = useState(new Params())
  const paramsProduct = new ParamsProduct()
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()
  const locale = getLocale()
  const [changeTab, setChangeTab] = useState('0')
  const [visibleExportForm, setVisibleExportForm] = useState(false)
  const [exportFormValue, setExportFormValue] = useState({})
  const [visibleEditForm, setVisibleEditForm] = useState(false)
  const [visibleAddForm, setVisibleAddForm] = useState(false)
  const [idStockout, setIdStockout] = useState()
  const [loadingForm, setLoadingForm] = useState(false)

  const fetch = async () => {
    dispatch({ type: 'stockout/getListStockoutModel', payload: params })
    // dispatch({ type: 'order/getListOrderModel', payload: params })
    dispatch({ type: 'products/getAllProductsModel', payload: paramsProduct })
  }

  useMemo(() => {
    fetch()
  }, [params, pathname])

  const handleCancel = () => {
    setVisibleEditForm(false)
    setVisibleAddForm(false)
    setVisibleExportForm(false)
    fetch()
  }

  const handleVisibleExportForm = async values => {
    const res = await getDetailOrderService(values.id)
    if (res) {
      setExportFormValue({ ...res })
      setVisibleExportForm(true)
    } else {
    }
  }

  const handleVisibleEditForm = id => () => {
    setVisibleEditForm(true)
    setIdStockout(id)
  }

  const handleShowAddForm = () => {
    setVisibleAddForm(true)
  }

  async function handleChangeOrder(value) {
    const res = await putOrderStatusService(id, value)
    if (res.success) {
      message.success(formatMessage({ id: 'order.changeSuccess' }))
    } else {
      message.error(formatMessage({ id: 'order.changeError' }))
    }
  }

  // const orderFilterList = () => {
  //   let values: any = [listOrder]
  //   if (listOrder && listOrder.length > 0) {
  //     values = listOrder?.filter(
  //       item => item.stockoutStatus === 0 && item.orderStatus === 1,
  //     )
  //   }
  //   return values
  // }

  // const filterCounter = () => {
  //   let values: any = [listOrder]
  //   if (listOrder && listOrder.length > 0) {
  //     values = listOrder?.filter(
  //       item => item.stockoutStatus === 0 && item.orderStatus === 1,
  //     )
  //   }
  //   return values.length
  // }

  //Date Sort
  let handleChangeSortDate = sort => {
    setParams({
      ...params,
      sortByDate: sort,
    })
  }

  //   const handleConfirmDelete = id => () => {
  //     Modal.confirm({
  //       title: formatMessage({ id: 'Stockout.questDelete' }),
  //       icon: <ExclamationCircleOutlined />,
  //       onCancel: handleCancel,
  //       onOk: handleDelete(id),
  //       okText: formatMessage({ id: 'Stockout.delete' }),
  //     });
  //   };
  //   const handleDelete = id => async () => {
  //     const { success } = await deleteStockoutService(id);
  //     if (success) {
  //       notification.success({
  //         icon: <CheckCircleOutlined style={{ color: 'green' }} />,
  //         message: formatMessage({ id: 'Stockout.delSuccess' }),
  //       });
  //     } else {
  //       notification.success({
  //         icon: <CheckCircleOutlined style={{ color: 'red' }} />,
  //         message: formatMessage({ id: 'Stockout.delFailed' }),
  //       });
  //     }
  //     await fetch();
  //   };

  let onChangeId = value => {
    let tempId = value
    if (isEmpty(tempId)) {
      tempId = ''
    } else {
      tempId = Number(value)
    }
    setParams({
      ...params,
      id: tempId,
    })
  }
  onChangeId = debounce(onChangeId, 600)

  let handleChangeTab = value => {
    setChangeTab(value)
  }

  const showTotal = (total: number) => {
    return `${formatMessage({ id: 'product.totalItem' })} ${total}`
  }

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

  const columnsStockout: ColumnProps<StockoutItem>[] = [
    {
      title: formatMessage({ id: 'stockout.index' }), //Ten cot index
      align: 'center',
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },
    {
      title: formatMessage({ id: 'stockout.stockout' }), //Ten cot index
      align: 'center',
      render: values => {
        return (
          <div>
            <a onClick={() => history.push(`/stock/stockout/${values.id}`)}>
              ID:{' #'}
              {values.id}
            </a>
            <Paragraph
              ellipsis={{
                rows: 2,
                expandable: false,
              }}
            >
              {formatMessage({ id: 'stockout.message' })}: <br />{' '}
              {values.message || ''}{' '}
            </Paragraph>
          </div>
        )
      },
    }, 
    {
      title: formatMessage({ id: 'stockout.price' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'stockout.subTotal' })}:{' '}
              <Tag color="geekblue">
                {numeral(values.subTotal).format(0, 0) || ''} đ
              </Tag>
            </Paragraph>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockout.accountable' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Paragraph>
              <UserOutlined /> {values.stocker.firstName || 'empty'}{' '}
              {values.stocker.lastName || 'empty'}
            </Paragraph>
            <Paragraph>
              <MailOutlined /> {values.stocker.email || 'empty'}
            </Paragraph>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockout.date' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'stockout.createAt' })}:{' '}
              <Tag color="magenta">
                <CalendarOutlined /> {formatDate(values.createdAt) || 'empty'}
              </Tag>
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'stockout.updateAt' })}:{' '}
              <Tag color="magenta">
                <CalendarOutlined /> {formatDate(values.updatedAt) || 'empty'}
              </Tag>
            </Paragraph>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockout.followByOrder' }),
      align: 'center',
      render: values => {
        return (
          <div>
            {values.order ? (
              <div>
                <CheckCircleTwoTone
                  style={{ fontSize: '30px' }}
                  twoToneColor="#52c41a"
                />
                <Paragraph style={{ marginTop: '10px' }}>
                  {formatMessage({ id: 'stockout.followOrder' })}:{' '}
                  <a onClick={() => history.push(`/orders/${values.order.id}`)}>
                    #{values.order.id || ''}
                  </a>
                </Paragraph>
              </div>
            ) : (
              <div>
                <InfoCircleOutlined
                  style={{ fontSize: '30px', color: 'orange' }}
                />
                <Paragraph style={{ marginTop: '10px' }}>
                  {formatMessage({ id: 'stockout.noFollowOrder' })}
                </Paragraph>
              </div>
            )}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockout.action' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Button
              onClick={() => history.push(`/stock/stockout/${values.id}`)}
              type="link"
              icon={<EyeOutlined />}
            >
              View
            </Button>
          </div>
        )
      },
    },

    // {
    //   title: formatMessage({ id: 'stockin.action' }), //Ten cot Action
    //   render: values => {
    //     return (
    //       <div style={{ display:'flex',flexDirection:'row'}}>
    //         <Button
    //           onClick={handleVisibleEditForm(values.id)}
    //           style={{ marginRight: 10 }}
    //         >
    //           <EditOutlined /> {formatMessage({ id: 'stockin.edit' })}{' '}
    //         </Button>
    //         {/*      */}
    //       </div>
    //     );
    //   },
    // },
  ]

  // const columnsOrder: ColumnProps<OrderItem>[] = [
  //   {
  //     title: formatMessage({ id: 'order.index' }),
  //     render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
  //   },
  //   {
  //     title: formatMessage({ id: 'order.order' }),
  //     render: value => {
  //       return (
  //         <div>
  //           <div>
  //             <a
  //               onClick={() => {
  //                 history.push(
  //                   `/orders/${value.id}?status=${value.orderStatus}`,
  //                 )
  //               }}
  //             >
  //               ID: #{value.id}
  //             </a>
  //           </div>
  //           <div>
  //             {value.orderStatus === 0 ? (
  //               <Tag color="orange">
  //                 {formatMessage({ id: 'order.statusNEW' })}
  //               </Tag>
  //             ) : value.orderStatus === 1 ? (
  //               <Tag color="green">
  //                 {formatMessage({ id: 'order.statusPROCESSING' })}
  //               </Tag>
  //             ) : value.orderStatus === 2 ? (
  //               <Tag color="blue">
  //                 {formatMessage({ id: 'order.statusDONE' })}
  //               </Tag>
  //             ) : (
  //               <Tag color="blue">
  //                 {formatMessage({ id: 'order.statusREJECT' })}
  //               </Tag>
  //             )}
  //           </div>
  //         </div>
  //       )
  //     },
  //   },
  //   {
  //     title: formatMessage({ id: 'order.price' }),
  //     render: value => {
  //       return (
  //         <div>
  //           <Paragraph>
  //             {formatMessage({ id: 'order.shipPrice' })}:{' '}
  //             {value && value.shippingFee ? (
  //               <Tag color="cyan">
  //                 {numeral(value.shippingFee).format(0, 0) || 'empty'}
  //               </Tag>
  //             ) : (
  //               <Tag color="cyan">Free</Tag>
  //             )}
  //           </Paragraph>
  //           <Paragraph>
  //             {formatMessage({ id: 'order.salePrice' })}:{' '}
  //             <Tag color="geekblue">
  //               {numeral(value.grandTotal).format(0, 0) || 'empty'}
  //             </Tag>
  //           </Paragraph>
  //         </div>
  //       )
  //     },
  //   },
  //   {
  //     title: formatMessage({ id: 'order.date' }),
  //     render(value) {
  //       return (
  //         <div>
  //           <Paragraph>
  //             {formatMessage({ id: 'order.detailCreateAt' })}:{' '}
  //             <Tag color="orange">{formatDate(value.createdAt) || 'empty'}</Tag>
  //           </Paragraph>
  //           <Paragraph>
  //             {formatMessage({ id: 'order.detailUpdateAt' })}:{' '}
  //             <Tag color="geekblue">
  //               {formatDate(value.updatedAt) || 'empty'}
  //             </Tag>
  //           </Paragraph>
  //         </div>
  //       )
  //     },
  //   },
  //   {
  //     title: formatMessage({ id: 'order.stockoutStatus' }),
  //     render(value) {
  //       return (
  //         <div>
  //           {value.stockoutStatus === 0 ? (
  //             <Tag color="#ff5500">
  //               {formatMessage({ id: 'order.statusIncomplete' })}
  //             </Tag>
  //           ) : value.stockoutStatus === 1 ? (
  //             <Tag color="#0070B8">
  //               {formatMessage({ id: 'order.statusCompleted' })}
  //             </Tag>
  //           ) : (
  //             ''
  //           )}
  //         </div>
  //       )
  //     },
  //   },
  //   {
  //     title: formatMessage({ id: 'stockout.action' }),
  //     render(value) {
  //       return (
  //         <div>
  //           <Button onClick={() => handleVisibleExportForm(value)}>
  //             {formatMessage({ id: 'stockout.delivery' })}
  //           </Button>
  //         </div>
  //       )
  //     },
  //   },
  // ]

  return (
    <PageHeaderWrapper>
      <Card
        // title={
        //   <div>
        //     <Radio.Group
        //       defaultValue={changeTab}
        //       onChange={evt => handleChangeTab(evt.target.value)}
        //     >
        //       <Radio.Button value="0">
        //         {formatMessage({ id: 'stockout.stockoutList' })}
        //       </Radio.Button>
        //       <Radio.Button value="1">
        //         {formatMessage({ id: 'stockout.pendingList' })}
        //       </Radio.Button>
        //     </Radio.Group>
        //   </div>
        // }
        extra={
          <Row>
            <div>
              {/* Sort date */}
              <Select
                placeholder={formatMessage({ id: 'product.sortDate' })}
                style={{ width: 120, marginLeft: '8px' }}
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
            </div>

            {/* Search Id Stockout */}
            <div style={{ marginLeft: '8px' }}>
              <Input.Search
                onChange={e => onChangeId(e.target.value)}
                placeholder={formatMessage({ id: 'stockout.Stock' })}
                name="name"
                allowClear
              />
            </div>
          </Row>
        }
      >
        <Button type="dashed" block onClick={handleShowAddForm}>
          <PlusCircleOutlined />
          {formatMessage({ id: 'stockout.addNew' })}
        </Button>
        <Tabs
          className={styles.tab_nav}
          activeKey="0"
          size="small"
          style={{ marginBottom: 32 }}
        >
          <TabPane key="0">
            <Table
              columns={columnsStockout}
              dataSource={listStockout}
              loading={loadingStockout}
              bordered
              pagination={{
                showSizeChanger: true,
                current: params.page,
                pageSize: params.limit,
                total: stockoutTotal,
                showTotal: showTotal,
                onChange: onTableChange,
                onShowSizeChange: onShowSizeChange,
              }}
            />
          </TabPane>
          <TabPane key="1">
            {/* <Table
              columns={columnsOrder}
              dataSource={orderFilterList()}
              bordered
              loading={loadingOrder}
              pagination={{
                showSizeChanger: true,
                current: params.page,
                pageSize: params.limit,
                total: filterCounter,
                showTotal: showTotal,
                onChange: onTableChange,
                onShowSizeChange: onShowSizeChange,
              }}
            /> */}
          </TabPane>
        </Tabs>

        <Modal
          maskClosable={false}
          visible={visibleAddForm}
          title={<strong>{formatMessage({ id: 'stockout.addNew' })}</strong>}
          onCancel={handleCancel}
          centered={true}
          footer={null}
          width={1000}
        >
          <CreateStockoutForm
            listProduct={listProduct}
            handleCancel={handleCancel}
          />
        </Modal>

        <Modal
          maskClosable={false}
          visible={visibleExportForm}
          title={<strong>{formatMessage({ id: 'stockout.addNew' })}</strong>}
          onCancel={handleCancel}
          centered={true}
          footer={null}
          width={1100}
        >
          <ExportStockoutForm
            handleChangeOrder={handleChangeOrder}
            exportFormValue={exportFormValue}
            listProduct={listProduct}
            handleCancel={handleCancel}
          />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(
  ({ loading, stockout, order, products }: ConnectState) => ({
    loadingStockout: loading.effects['stockout/getListStockoutModel'],
    listStockout: stockout?.listStockout || [],
    loadingOrder: loading.effects['order/getListOrderModel'],
    listOrder: order?.listOrder || [],
    loadingProduct: loading.effects['products/getAllProductsModel'],
    listProduct: products.listProducts || [],
    stockoutTotal: stockout.total,
    orderTotal: order.total,
  }),
)(Stockout)
