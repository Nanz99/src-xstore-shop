import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Input,
  Radio,
  DatePicker,
  Tag,
  Modal,
  Form,
  message,
  Switch,
  Select,
  notification,
} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import dayjs from 'dayjs'
import {
  history,
  Dispatch,
  useIntl,
  connect,
  useLocation,
  formatMessage,
  UserItem,
  CategoryItem,
} from 'umi'

import React, { useState, useEffect, useMemo } from 'react'
import { ConnectState } from '@/models/connect'
import { ProductItem } from '@/models/product.model'
import { OrderServiceItem, ServiceItem } from '@/models/service.model'
import numeral from 'numeral'
import styles from './products.css'
import { ColumnProps } from 'antd/lib/table'
import { isArray, values } from 'lodash'
import Avatar from 'antd/lib/avatar/avatar'
import {
  CheckOutlined,
  CloseOutlined,
  FileImageOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

import {
  checkSyncAllProduct,
  syncAllProduct,
  syncProduct,
} from '@/services/product.service'
import Paragraph from 'antd/lib/typography/Paragraph'
import { convertDateToInt, formatDate } from '@/utils/utils'
import Title from 'antd/lib/typography/Title'
import { deleteOrderService, publishService, unpublishService, UpdateStatusOrderService } from '@/services/service.service'


const { Meta } = Card
const { Option } = Select

class Params {
  page: number = 1
  limit: number = 10
  name?: string
  verified?: boolean
  status?: number
  sortByPrice?: string
  sortByDate?: string
  condition?: string
}

class CategoryParams {
  page: number = 1
  limit: number = 99999
}

interface ProductProps {
  listProducts?: ProductItem[]
  currentUser: UserItem
  listCategories: CategoryItem[]
  totalOrderService: number
  loading: boolean
  dispatch: Dispatch,
  listServices: ServiceItem[],
  listOrderServices: OrderServiceItem[]
}

const ServiceBookingParty: React.FC<ProductProps> = props => {
  const {
    dispatch,
    loading,
    listOrderServices,
    totalOrderService
  } = props
  const [params, setParams] = useState(new Params())
  const [destroyForm, setDestroyForm] = useState(false)
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()
  const [fetching, setFetching] = useState(false)
  const [visibleAddform, setVisibleAddForm] = useState(false)
  const [visibleCheckSyncForm, setVisibleCheckSyncForm] = useState(false)

  const fetch = async () => {
    await checkSyncAllProduct()
    dispatch({ type: 'products/getAllProductsModel', payload: params })
    dispatch({ type: 'services/getAllServicesModel', payload: params })
    dispatch({ type: 'services/getOrderServicesModel', payload: params })
    dispatch({ type: 'category/getAllCategoryModel', payload: CategoryParams })
  }

  useMemo(() => {
    fetch()
  }, [params, pathname])




  // Initial value for publish
  const InitSwitchStatus = values => {
    if (values === 1) {
      return true
    }
    return false
  }

  const handleChangeStatus = async (checked, values) => {
    let res = {}
    if (checked) res = await publishService(values.id)
    else res = await unpublishService(values.id)
    if (res.success)
      message.success(formatMessage({ id: 'product.changeSuccess' }))
    else message.error(formatMessage({ id: 'product.changeFailed' }))
  }

  const handleCancel = () => {
    setDestroyForm(true)
    setVisibleAddForm(false)
    fetch()
  }

  const handleHideAddForm = () => {
    setVisibleAddForm(false)
    fetch()
  }

  const handleShowAddForm = () => {
    setVisibleAddForm(true)
  }

  const handleCancelCheckSyncForm = () => {
    setDestroyForm(true)
    setVisibleCheckSyncForm(false)
    fetch()
  }

  const showTotal = (totalOrderService: number) => {
    return `${formatMessage({ id: 'product.totalItem' })} ${totalOrderService}`
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

  //Handle Search
  let onChangeProductName = name => {
    setParams({
      ...params,
      name: name,
    })
  }

  //Status Filter
  let handleOnChangeStatus = status => {
    setParams({
      ...params,
      status: status,
    })
  }


  //Date Sort
  let handleChangeSortDate = sort => {
    setParams({
      ...params,
      sortByDate: sort,
    })
  }

  //Condition Sort
  let handleChangeSortCondition = sort => {
    if (sort !== 'all') {
      setParams({
        ...params,
        condition: sort,
      })
    } else {
      setParams({
        ...params,
      })
    }
  }
  
    const [orderId, setOrderId] = useState(0)
    const [orderStatus, setOrderStatus] = useState('')
    const handleGetStatus = (status) =>{
    setOrderStatus(status)
  }
    
    useEffect(() => {
      const handleUpdateStatus = async () => {
         let data = {
            orderStatus: orderStatus,
         }
         let res = await UpdateStatusOrderService(orderId, data)

         if (res.success) {
            notification.success({
               icon: <CheckCircleOutlined style={{ color: 'green' }} />,
               message: formatMessage({ id: 'service.changeStatusSuccess' }),
            });
            history.go(`/service/booking-party`)
         } 
      }
      handleUpdateStatus()
   }, [orderStatus,orderId])

const handleConfirmDelete = id => () => {
      Modal.confirm({
         title: formatMessage({ id: 'service.questorderDelete' }),
         icon: <ExclamationCircleOutlined />,
         onCancel: handleCancel,
         onOk: handleDelete(id),
         okText: formatMessage({ id: 'product.delete' }),
      });
   };

   const handleDelete = id => async () => {
      const { success } = await deleteOrderService(id);
      if (success) {
         notification.success({
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            message: formatMessage({ id: 'service.deleteProductSuccess' }),
         });
         history.go(`/service/booking-party`);
      } else {
         notification.success({
            icon: <CheckCircleOutlined style={{ color: 'red' }} />,
            message: formatMessage({ id: 'service.deleteProductFailed' }),
         });
      }
   };


  const columns: ColumnProps<ProductItem>[] = [
    //Index column
    {
      title: formatMessage({ id: 'product.index' }),
      align: 'center',
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },
    //   {
    //   title: 'ID',
    //   key: 'ID',
    //   align: 'center',
    //   render: values => {
    //     return (
    //       //div Cha
    //       <div
           
    //       >
    //         <a onClick={() => history.push(`/service/booking-party/${values.id}`)}>
    //         #{values.id || ''}
    //         </a>{' '}

    //       </div>
    //     )
    //   },
    // },
    //Name column
    {
      title: formatMessage({ id: 'service.fullName' }),
      key: 'name',
      align: 'center',
      render: values => {
        return (
          //div Cha
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            {/* <a onClick={() => history.push(`/service/order-service/${values.id}`)}> */}
            {values.name || ''}
            {/* </a>{' '} */}

          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'service.phone' }),
      align: 'center',
      key: 'phone',
      render: values => {
        return (
          <div>
            {values?.phone}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'service.email' }),
      align: 'center',
      key: 'email',
      render: values => {
        return (
          <div>
            {values?.email}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'service.date' }),
      align: 'center',
      key: 'date',
      render: values => {
        return (
          <div>
            {dayjs(values?.date).format(
              'DD/MM/YYYY',
            )}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'service.quantity' }),
      align: 'center',
      key: 'quantity',
      render: values => {
        return (
          <div>
            {values?.quantity || ''}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'service.status' }),
      align: 'center',
      key: 'status',
      render: values => {
       
        return (
          <div>
           
            {values?.status === 0 ? <Tag color="#ffb703" style={{ fontSize: 14 }}>Mới</Tag> : values?.status === 1 ? <Tag color="#2db7f5" style={{ fontSize: 14 }}>Hoàn Thành</Tag> : values?.status === 2 ? <Tag color="#f50" style={{ fontSize: 14 }}>Từ Chối</Tag> : ''}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'service.dateCreate' }),
      align: 'center',
      key: 'date',
      render: values => {
        return (
          <div>
            {dayjs(values?.createdAt).format(
              'DD/MM/YYYY',
            ) || ''}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'service.function' }),
      align: 'center',
      key: 'function',
      render: values => {
        return (
          <div style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Select
              placeholder={formatMessage({ id: 'service.changeStatus' })}
              style={{ width: 140 ,marginRight:'15px' }}
              onChange={handleGetStatus}
              allowClear
            >
              <Select.Option value="NEW" >
                <span onClick={() => setOrderId(values.id)}>{formatMessage({ id: 'service.statusNew' })}</span>
              </Select.Option>
              <Select.Option value="DONE" >
                <span onClick={() => setOrderId(values.id)}>{formatMessage({ id: 'service.statusDone' })}</span>
              </Select.Option>
              <Select.Option value="REJECT" >
                <span onClick={() => setOrderId(values.id)}>{formatMessage({ id: 'service.statusReject' })}</span>
              </Select.Option>
            </Select>
             <Button
                  onClick={handleConfirmDelete(values.id)}
                  type="primary"
                  icon={<DeleteOutlined />}
                  shape="circle"
                  danger
              >
                 
              </Button>
          </div>
          
        )
      },
    },

  ]

  return (
    <PageHeaderWrapper>
      <Card size="small" style={{ padding: '6px 12px 6px 12px' }}>
        <Row>
          <Col span={8}>
            {/* Filter public */}


          </Col>
          <Col
            span={16}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Select
              placeholder={formatMessage({ id: 'service.status' })}
              style={{ width: 120 }}
              onChange={handleOnChangeStatus}
              allowClear
            >
              <Option value="">
                {formatMessage({ id: 'product.sortAll' })}
              </Option>
              <Option value="NEW">
                {formatMessage({ id: 'service.statusNew' })}
              </Option>
              <Option value="DONE">
                {formatMessage({ id: 'service.statusDone' })}
              </Option>
              <Option value="REJECT">
                {formatMessage({ id: 'service.statusReject' })}
              </Option>
            </Select>

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

            {/* Search product name */}
            <Input.Search
              style={{ width: 300, marginLeft: '16px' }}
              onChange={e => onChangeProductName(e.target.value)}
              placeholder={formatMessage({ id: 'service.nameSearch' })}
              name="name"
              allowClear
            />
          </Col>
        </Row>
      </Card>
      <Card>

        <Table
          columns={columns}
          dataSource={listOrderServices}
          rowKey="id"
          loading={loading}
          scroll={{ x: 768 }}
          bordered
          pagination={{
            showSizeChanger: true,
            // current: params.page,
            pageSize: params.limit,
            total: totalOrderService,
            showTotal: showTotal,
            onChange: onTableChange,
            onShowSizeChange: onShowSizeChange,
          }}
        />


      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(
  ({ loading, services }: ConnectState) => ({
    loading: loading.effects['services/getOrderServicesModel'],
    listServices: services?.listServices || [],
    listOrderServices: services?.listOrderServices || [],
    totalOrderService: services.totalOrderService
  }),
)(ServiceBookingParty)


