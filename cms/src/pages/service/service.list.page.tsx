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
  CheckOutlined,
  CloseOutlined,
  FileImageOutlined,
  PlusCircleOutlined

} from '@ant-design/icons'
import CreateProductForm from './service.create.page'
import {
  checkSyncAllProduct,
  syncAllProduct,
  syncProduct,
} from '@/services/product.service'
import Paragraph from 'antd/lib/typography/Paragraph'
import { convertDateToInt, formatDate } from '@/utils/utils'
import Title from 'antd/lib/typography/Title'
import { publishService, unpublishService } from '@/services/service.service'

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

const ServiceList: React.FC<ProductProps> = props => {
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


  // console.log('####################',listProducts);
  const [visibleAddform, setVisibleAddForm] = useState(false)
  const [visibleCheckSyncForm, setVisibleCheckSyncForm] = useState(false)

  const fetch = async () => {
    await checkSyncAllProduct()
    dispatch({ type: 'products/getAllProductsModel', payload: params })
    dispatch({ type: 'services/getAllServicesModel', payload: params })
    dispatch({ type: 'category/getAllCategoryModel', payload: CategoryParams })
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

  const columns: ColumnProps<ProductItem>[] = [
    //Index column
    {
      title: formatMessage({ id: 'product.index' }),
      align: 'center',
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },

    {
      title: formatMessage({ id: 'product.publishTitle' }),
      align: 'center',
      key: 'status',
      render: values => {
        return (
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked={InitSwitchStatus(values.status)}
            onChange={e => {
              handleChangeStatus(e, values)
            }}
          />
        )
      },
    },

    //Name column
    {
      title: formatMessage({ id: 'service.service' }),
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


            <a onClick={() => history.push(`/service/service-list/${values.id}`)}>
              {values.name || ''}
            </a>{' '}

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
      title: formatMessage({ id: 'service.imageService' }),
      align: 'center',
      render(value) {
        return (
          // <p dangerouslySetInnerHTML={{ __html: value.vnIntroduction || '' }} style={{
          //   width: '350px', margin: '0 auto'
          // }}>
          // </p>
           <Avatar
                shape="square"
                size={100}
                src={value?.imageUrl}
                icon={<FileImageOutlined />}
              />
        )
      },
    },
    //Date
    {
      title: formatMessage({ id: 'product.date' }),
      align: 'center',
      render(value) {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'order.detailCreateAt' })}:{' '}
              <Tag color="orange">{formatDate(value.createdAt) || ''}</Tag>
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'order.detailUpdateAt' })}:{' '}
              <Tag color="geekblue">{formatDate(value.updatedAt) || ''}</Tag>
            </Paragraph>
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
          <Col span={12}>
            {/* Filter public */}
            <Button
              style={{ width: '80%' }}
              type="dashed"
              block
              onClick={() => {
                handleShowAddForm()
              }}
            >
              <PlusCircleOutlined />
              {formatMessage({ id: 'service.addNew' })}
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
          <Col
            span={12}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >


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
              placeholder={formatMessage({ id: 'service.service' })}
              name="name"
              allowClear
            />
          </Col>
        </Row>
      </Card>
      <Card>

        <Table
          columns={columns}
          dataSource={listServices}
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
          title={formatMessage({ id: 'service.addNew' })}
          centered={true}
          onCancel={handleHideAddForm}
          destroyOnClose={destroyForm}
          width={1000}
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
          <CreateProductForm
            currentUser={currentUser}
            handleCancel={handleCancel}
            categoryList={listCategories}
          />
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
)(ServiceList)

