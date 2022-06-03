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
  notification
} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'

import {
  history,
  Dispatch,
  useIntl,
  connect,
  useLocation,
  formatMessage,
  UserItem,
  CategoryItem,
  Access,
} from 'umi'

import React, { useState, useEffect, useMemo } from 'react'
import { ConnectState } from '@/models/connect'
import { ProductItem } from '@/models/product.model'
import { ServiceItem } from '@/models/service.model'
import numeral from 'numeral'
import styles from './products.css'
import { ColumnProps } from 'antd/lib/table'
import { isArray, values } from 'lodash'
import Avatar from 'antd/lib/avatar/avatar'
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FileImageOutlined,
  PlusCircleOutlined

} from '@ant-design/icons'
import CreateSizeForm from './size.create.page'
import {
  checkSyncAllProduct,
  syncAllProduct,
  syncProduct,
} from '@/services/product.service'
import Paragraph from 'antd/lib/typography/Paragraph'
import { convertDateToInt, formatDate } from '@/utils/utils'
import Title from 'antd/lib/typography/Title'
import { publishService, unpublishService } from '@/services/service.service'
import {getAllSize, removeSize} from '@/services/product.service'
import EditSize from './size.edit.page'


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
  totalService: number
  loading: boolean
  dispatch: Dispatch,
  listServices: ServiceItem[]
}

const SizeList: React.FC<ProductProps> = props => {
  const {
    dispatch,
    listProducts,
  totalService,
    loading,
    currentUser,
    listServices,
    listCategories,
  } = props
  const [params, setParams] = useState(new Params())
  const [destroyForm, setDestroyForm] = useState(false)
  const [asynchronousProducts, setAsynchronousProducts] = useState(0)
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()
  const [fetching, setFetching] = useState(false)
  const [listSize, setListSize] = useState([])
  const [idSize, setIdSize] = useState(0)

  // console.log('####################',listProducts);
  const [visibleAddform, setVisibleAddForm] = useState(false)
  const [visibleEditform, setVisibleEditForm] = useState(false)
  const [visibleCheckSyncForm, setVisibleCheckSyncForm] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false);

  const fetch = async () => {
    await checkSyncAllProduct()
    dispatch({ type: 'products/getAllProductsModel', payload: params })
    dispatch({ type: 'services/getAllServicesModel', payload: params })
    dispatch({ type: 'category/getAllCategoryModel', payload: CategoryParams })
    const res = await getAllSize()
    setListSize(res?.data)
  }


  useMemo(() => {
    fetch()
  }, [params, pathname])

  // Sync product flow
  const hanldeCheckSyncAllProduct = async () => {
    setFetching(true)
    const res = await checkSyncAllProduct()
    if (res && isArray(res.result) && res.result.length > 0) {
      setAsynchronousProducts(res.result.length)
      setVisibleCheckSyncForm(true)
    } else if (res && res.statusCode) {
      message.error(formatMessage({ id: 'product.syncFail' }))
    } else {
      message.info(formatMessage({ id: 'product.syncedAll' }))
    }
    setFetching(false)
    fetch()
  }

  const handleSyncAllProduct = async () => {
    setFetching(true)
    const result = await syncAllProduct()
    if (result && result.success && !result.statusCode) {
      message.success(formatMessage({ id: 'product.syncSuccess' }))
    } else {
      message.error(formatMessage({ id: 'product.syncFail' }))
    }
    setVisibleCheckSyncForm(false)
    setFetching(false)
    fetch()
  }

  const handleSyncProduct = async data => {
    setFetching(true)
    let restructData = {}
    if (data) {
      restructData = {
        name: data.name,
        sale_ok: true,
        purchase_ok: true,
        type: 'consu',
        complete_name: data.category.complete_name,
        default_code: '',
        barcode: data.SKU,
        list_price: data.retailPrice,
        standard_price: data.purchasePrice,
        invoice_policy: 'order',
        description_sale: data.salePrice.toString(),
      }
      const result = await syncProduct(restructData)

      if (result && result.success && !result.statusCode) {
        message.success(formatMessage({ id: 'product.syncSuccess' }))
      } else {
        message.error(formatMessage({ id: 'product.syncFail' }))
      }
    }
    setFetching(false)
    fetch()
  }

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
    setVisibleEditForm(false)
    fetch()
  }

  const handleHideAddForm = () => {
    setVisibleAddForm(false)
    fetch()
  }
  const handleHideEditForm = () => {
    setVisibleEditForm(false)
    fetch()
  }

  const handleShowAddForm = () => {
    setVisibleAddForm(true)
  }

  const handleShowEditForm = (id) => {
    setVisibleEditForm(true)
    setIdSize(id)
  }

  const handleHideDelete = () => {
    setVisibleDelete(false)
  }

  const handleCancelCheckSyncForm = () => {
    setDestroyForm(true)
    setVisibleCheckSyncForm(false)
    fetch()
  }

  const handleRemoveSize = id => {
    setVisibleDelete(true)
    setIdSize(id)
  }

  const showTotal = (totalService: number) => {
    return `${formatMessage({ id: 'product.totalItem' })} ${totalService}`
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

  //Price Sort
  let handleChangeSortPrice = sort => {
    setParams({
      ...params,
      sortByPrice: sort,
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

  const deleteSize = async (id) => {
    const { success } = await removeSize(id)
    if (success) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'category.delSuccess' }),
      })
      handleHideDelete()
    } else {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'category.delFailed' }),
      })
    }
    await fetch()
  }

  const columns: ColumnProps<ProductItem>[] = [
    //Index column
    {
      title: formatMessage({ id: 'category.index' }), //Ten cot index
       align: 'center',
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },

    // {
    //   title: formatMessage({ id: 'product.publishTitle' }),
    //   align: 'center',
    //   key: 'status',
    //   render: values => {
    //     return (
    //       <Switch
    //         checkedChildren={<CheckOutlined />}
    //         unCheckedChildren={<CloseOutlined />}
    //         defaultChecked={InitSwitchStatus(values.status)}
    //         onChange={e => {
    //           handleChangeStatus(e, values)
    //         }}
    //       />
    //     )
    //   },
    // },

    //Name column
    {
      title: formatMessage({ id: 'menu.Properties.Size' }),
      key: 'name',
      align: 'center',
      render: listSize => {
        return (
          //div Cha
          <div
            style={{
              display: 'flex',
              // flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 10, 
              fontSize: 16
            }}
          >
            <p>
              {listSize?.size || ''}
            </p>{' '}
          </div>
        )
      },
    },

    //Quantity

    // //Provider Name
    // {
    //   title: formatMessage({ id: 'product.provider' }),
    //   align: 'center',
    //   key: 'provider',
    //   dataIndex: 'providerName',
    // },

    //Description
    {
      title: formatMessage({ id: 'service.description' }),
      align: 'center',
      render(listSize) {
        return (
          // <p dangerouslySetInnerHTML={{ __html: value.vnIntroduction || '' }} style={{
          //   width: '350px', margin: '0 auto'
          // }}>
          // </p>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

          }}>
            <p style={{ marginTop: 12, width : "120px"}}>{listSize?.description}</p>
          </div>
         
        )
      },
    },
    //Date
    {
      title: formatMessage({ id: 'product.date' }),
      align: 'center',
      render(listSize) {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'order.detailCreateAt' })}:{' '}
              <Tag color="orange">{formatDate(listSize.createdAt) || ''}</Tag>
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'order.detailUpdateAt' })}:{' '}
              <Tag color="geekblue">{formatDate(listSize.updatedAt) || ''}</Tag>
            </Paragraph>
          </div>
        )
      },
    },

    // Function
    {
      title: formatMessage({ id: 'category.action' }), //Ten cot Action
       align: 'center',
      render: listSize => {
        return (
          <div>
            <Button
              style={{ marginRight: '10px'}}type="primary" shape="circle" icon={<EditOutlined />} 
              onClick={() => {
                handleShowEditForm(listSize?.id)
              }}
            />
            <Button
              type="primary" shape="circle" icon={<DeleteOutlined />} danger 
              onClick={() => handleRemoveSize(listSize?.id)}
            />
          </div>
        )
      },
    },

    // # Sync each product
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
    //               handleSyncProduct(values)
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

  return (
    <PageHeaderWrapper>
      <Card size="small" style={{ padding: '6px 12px 6px 12px' }}>
        <Row>
          <Col span={24}>
            {/* Filter public */}
            <Button
              style={{ width: '100%' }}
              type="dashed"
              block
              onClick={() => {
                handleShowAddForm()
              }}
            >
              <PlusCircleOutlined />
              {formatMessage({ id: 'size.addNew' })}
            </Button>
            {/* <Radio.Group
              optionType="button"
              defaultValue="all"
              onChange={e => handleOnChangeStatus(e.target.value)}
            >
              <Radio.Button value={undefined}>
                {formatMessage({ id: 'product.all' })}
              </Radio.Button>
              <Radio.Button value="DRAFT">
                {formatMessage({ id: 'product.statusDraft' })}
              </Radio.Button>
              <Radio.Button value="PUBLISH">
                {formatMessage({ id: 'product.statusPublish' })}
              </Radio.Button>
              <Radio.Button value="LOCK">
                {formatMessage({ id: 'product.statusUnPublish' })}
              </Radio.Button>
            </Radio.Group> */}
          </Col>
        </Row>
      </Card>
      <Card>

        <Table
          columns={columns}
          dataSource={listSize || []}
          rowKey="id"
          loading={loading}
          scroll={{ x: 768 }}
          bordered
          pagination={{
            showSizeChanger: true,
            // current: params.page,
            pageSize: params.limit,
            total: totalService,
            showTotal: showTotal,
            onChange: onTableChange,
            onShowSizeChange: onShowSizeChange,
          }}
        />

        {/* // Create product modal */}
        <Modal
          maskClosable={false}
          visible={visibleAddform}
          title={formatMessage({ id: 'size.addNew' })}
          centered={true}
          onCancel={handleHideAddForm}
          destroyOnClose={destroyForm}
          width={600}
          footer={[
            <Button
              form="product-create-page"
              htmlType="button"
              key="back"
              onClick={handleCancel}
            >
              {formatMessage({ id: 'product.cancel' })}
            </Button>,
            <Button
              form="product-create-page"
              htmlType="submit"
              key="submit"
              type="primary"
            >
              {''}
              {formatMessage({ id: 'product.create' })}
              {''}
            </Button>,
          ]}
        >
          <CreateSizeForm
            currentUser={currentUser}
            handleCancel={handleCancel}
            listSize={listSize}
          />
        </Modal>
        <Modal
          maskClosable={false}
          visible={visibleEditform}
          title={formatMessage({ id: 'size.edit' })}
          centered={true}
          onCancel={handleHideEditForm}
          destroyOnClose={destroyForm}
          width={600}
          footer={[
            <Button
              form="product-create-page"
              htmlType="button"
              key="back"
              onClick={handleCancel}
            >
              {formatMessage({ id: 'product.cancel' })}
            </Button>,
            <Button
              form="product-create-page"
              htmlType="submit"
              key="submit"
              type="primary"
            >
              {''}
              {formatMessage({ id: 'product.edit' })}
              {''}
            </Button>,
          ]}
        >
          <EditSize
            currentUser={currentUser}
            handleCancel={handleCancel}
            listSize={listSize}
            idSize={idSize}
          />
        </Modal>
        <Modal title="Basic Modal" visible={visibleDelete} onOk={() => deleteSize(idSize)} onCancel={handleHideDelete}>
       {formatMessage({ id: 'category.questDelete' })}
      </Modal>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(
  ({ products, loading,services }: ConnectState) => ({
    loading: loading.effects['services/getAllServicesModel'],
    listProducts: products?.listProducts || [],
    totalService: services.totalService,
    listServices: services?.listServices || [],
  }),
)(SizeList)

