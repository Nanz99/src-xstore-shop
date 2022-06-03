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
  getLocale,
} from 'umi'

import React, { useState, useEffect, useMemo } from 'react'
import { ConnectState } from '@/models/connect'
import { ProductItem } from '@/models/product.model'
import numeral from 'numeral'
import styles from './products.css'
import { ColumnProps } from 'antd/lib/table'
import { isArray, values } from 'lodash'
import Avatar from 'antd/lib/avatar/avatar'
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  FileImageOutlined,
  PlusCircleOutlined,
  SyncOutlined,
  TrademarkOutlined,
} from '@ant-design/icons'
import CreateProductForm from './product.create.page'
import {
  publishProductService,
  unpublishProductService,
  checkSyncAllProduct,
  syncAllProduct,
  syncProduct,
} from '@/services/product.service'
import Paragraph from 'antd/lib/typography/Paragraph'
import { convertDateToInt, formatDate } from '@/utils/utils'
import Title from 'antd/lib/typography/Title'

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
  total: number
  loading: boolean
  dispatch: Dispatch
}

const Products: React.FC<ProductProps> = props => {
  const {
    dispatch,
    listProducts,
    total,
    loading,
    currentUser,
    listCategories,
  } = props
  const [params, setParams] = useState(new Params())
  const [destroyForm, setDestroyForm] = useState(false)
  const [asynchronousProducts, setAsynchronousProducts] = useState(0)
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()
  const [fetching, setFetching] = useState(false)
  const locale = getLocale()

  const [visibleAddform, setVisibleAddForm] = useState(false)
  const [visibleCheckSyncForm, setVisibleCheckSyncForm] = useState(false)

  const fetch = async () => {
    await checkSyncAllProduct()
    dispatch({ type: 'products/getAllProductsModel', payload: params })
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
    if (checked) res = await publishProductService(values.id)
    else res = await unpublishProductService(values.id)
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

  // //Price Sort
  // let handleChangeSortPrice = sort => {
  //   setParams({
  //     ...params,
  //     sortByPrice: sort,
  //   })
  // }

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
      key: 'ID',
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
    {
      title: formatMessage({ id: 'product.imageProduct' }),
      align: 'center',
      key: 'status',
      render: values => {
        return (
          <div>
            <a onClick={() => history.push(`/product/${values.id}`)}>
              <Avatar
                shape="square"
                size={100}
                src={values.imageUrl}
                icon={<FileImageOutlined />}
              />
            </a>
          </div>
        )
      },
    },

    //Name column
    {
      title: formatMessage({ id: 'product.name' }),
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

            {/* div nay la ten san pham ( Co the link qua trang detail?) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'start',
              }}
            >
              <a onClick={() => history.push(`/product/${values.id}`)}>
                {values.name || ''}
              </a>{' '}
            </div>
          </div>
        )
      },
    },
    // {
    //   title: formatMessage({ id: 'product.category' }),
    //   align: 'center',
    //   key: 'category',
    //   render: values => {
    //     return (
    //       <div>
    //         {locale === "vi-VN" ? values?.category?.enName : values?.category?.vnName}
    //       </div>
    //     )
    //   },
    // },
    //Price (reatil product, dealer)
    {
      title: formatMessage({ id: 'product.price' }),
      align: 'center',
      key: 'price',
      render: values => {
        return (
          <div style={{ width: '200px', margin: 'auto' }}>
            <p style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', }}>
              <span style={{ marginRight: '5px' }}> {formatMessage({ id: 'product.retailPrice' })} : </span>
              <Tag color="#4361ee" style={{ fontSize: 14 }}>
                {numeral(values?.price).format(0, 0) || ''} đ
              </Tag>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', }}>
              <span style={{ marginRight: '5px' }}> {formatMessage({ id: 'product.dealerPrice' })} : </span>
              <Tag color="#4361ee" style={{ fontSize: 14 }}>
                {numeral(values?.dealerPrice).format(0, 0) || ''} đ
              </Tag>
            </p>
          </div>
        )
      },
    },

    //Date
    {
      title: formatMessage({ id: 'product.date' }),
      align: 'center',
      key: 'date',
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

    //Condition
    {
      title: formatMessage({ id: 'product.condition' }),
      align: 'center',
      key: 'condition',
      render(value) {
        return (
          <div>
            {value.condition === 1 ? (
              <Paragraph>
                <Tag color="#fbbc05">
                  {formatMessage({ id: 'product.conditionNEW' })}
                </Tag>
              </Paragraph>
            ) : (
              <Paragraph>
                <Tag color="#747474">
                  {formatMessage({ id: 'product.conditionNORMAL' })}
                </Tag>
              </Paragraph>
            )}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'product.saleBest' }),
      align: 'center',
      key: 'saleBest',
      render(value) {
        return (
          <div>
            {value.isHot === true ? (
              <Paragraph>
                <Tag color="#ef233c">
                  {formatMessage({ id: 'product.saleBestHot' })}
                </Tag>
              </Paragraph>
            ) : (
              <Paragraph>
                <Tag color="#747474">
                  {formatMessage({ id: 'product.saleBestNormal' })}
                </Tag>
              </Paragraph>
            )}
          </div>
        )
      },
    },
      {
      title: formatMessage({ id: 'product.action' }),
      key: 'action',
      align: 'center',
      render: values => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <Button type="primary" shape="circle" style={{backgroundColor:'#4361ee'}} icon={<EyeOutlined />} onClick={() => {
              history.push(`/product/${values.id}`)
              window.scrollTo(0, 0)
              }}/>
          </div>
        )
      },
    },
  ]

  return (
    <PageHeaderWrapper>
      <Card size="small" style={{ padding: '6px 12px 6px 12px' }}>
        <Row>
          <Col span={12}>
            {/* Filter public */}
            <Radio.Group
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
            </Radio.Group>
          </Col>
          <Col
            span={12}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {/* Sort condition */}
            <Select
              placeholder={formatMessage({ id: 'product.sortCondition' })}
              style={{ width: 120 }}
              onChange={handleChangeSortCondition}
              allowClear
            >
              <Option value="all">
                {formatMessage({ id: 'product.sortAll' })}
              </Option>
              <Option value="NEW">
                {formatMessage({ id: 'product.conditionNEW' })}
              </Option>
              <Option value="NORMAL">
                {formatMessage({ id: 'product.conditionNORMAL' })}
              </Option>
            </Select>

            {/* Sort price */}
            {/* <Select
              placeholder={formatMessage({ id: 'product.sortPrice' })}
              style={{ width: 120, marginLeft: '8px' }}
              onChange={handleChangeSortPrice}
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
            </Select> */}

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
              placeholder={formatMessage({ id: 'product.product' })}
              name="name"
              allowClear
            />
          </Col>
        </Row>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            style={{ width: '80%' }}
            type="dashed"
            block
            onClick={() => {
              handleShowAddForm()
            }}
          >
            <PlusCircleOutlined />
            {formatMessage({ id: 'product.addNew' })}
          </Button>
          <Button
            style={{ width: '19%' }}
            loading={fetching}
            type="primary"
            block
            onClick={() => {
              hanldeCheckSyncAllProduct()
            }}
          >
            <SyncOutlined />
            {formatMessage({ id: 'product.checkSync' })}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={listProducts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 768 }}
          bordered
          pagination={{
            showSizeChanger: true,
            // current: params.page,
            pageSize: params.limit,
            total: total,
            showTotal: showTotal,
            onChange: onTableChange,
            onShowSizeChange: onShowSizeChange,
          }}
        />

        {/* // Create product modal */}
        <Modal
          maskClosable={false}
          visible={visibleAddform}
          title={formatMessage({ id: 'product.addNew' })}
          centered={true}
          onCancel={handleHideAddForm}
          destroyOnClose={destroyForm}
          width={1100}
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

        <Modal
          title={formatMessage({ id: 'product.checkSync' })}
          visible={visibleCheckSyncForm}
          centered={true}
          onOk={handleSyncAllProduct}
          onCancel={handleCancelCheckSyncForm}
          destroyOnClose={destroyForm}
          okText={formatMessage({ id: 'product.accept' })}
          cancelText={formatMessage({ id: 'product.cancel' })}
        >
          <p>
            {formatMessage({ id: 'product.beforeSyncAllFirstText' })}{' '}
            <b>{asynchronousProducts}</b>{' '}
            {formatMessage({ id: 'product.beforeSyncAllProductSecondText' })}
          </p>
        </Modal>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(
  ({ products, loading, user, category }: ConnectState) => ({
    loading: loading.effects['products/getAllProductsModel'],
    listProducts: products?.listProducts || [],
    total: products.total,
    currentUser: user?.currentUser || {},
    listCategories: category?.listCategory || [],
  }),
)(Products)
