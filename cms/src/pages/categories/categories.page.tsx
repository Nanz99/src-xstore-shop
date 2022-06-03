import React, { useState, useMemo } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import {
  Card,
  Table,
  Button,
  Modal,
  Input,
  notification,
  Tag,
  Typography,
  Row,
  Col,
  message
} from 'antd'
import {
  useIntl,
  Dispatch,
  useLocation,
  connect,
  getLocale,
  useAccess,
} from 'umi'
import { CategoryItem } from '@/models/category.model'
import { ColumnProps } from 'antd/lib/table'
import { ConnectState } from '@/models/connect'
import {  isArray } from 'lodash'
import {
  EditOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import EditCategoryForm from './category.edit.page'
import CreateCategoryForm from './category.create.page'
import {
  deleteCategoryService,
  syncAllCategory,
  checkSyncAllCategory,
  syncCategory,
} from '@/services/categories.service'

const { Text } = Typography

class Params {
  page: number = 1
  limit: number = 20
  id?: number
  enName?: string
  vnName?: string
  verified?: boolean
}

interface CategoryProps {
  listCategory?: CategoryItem[]
  total: number
  loading: boolean
  dispatch: Dispatch
}

const Category: React.FC<CategoryProps> = props => {
  const { dispatch, listCategory, total, loading } = props
  const access = useAccess()
  const [params, setParams] = useState(new Params())
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()
  const locale = getLocale()
  const [visibleEditForm, setVisibleEditForm] = useState(false)
  const [visibleAddForm, setVisibleAddForm] = useState(false)
  const [idCategory, setIdCategory] = useState()
  const [fetching, setFetching] = useState(false)
  const [destroyForm, setDestroyForm] = useState(false)
  const [asynchronousCategory, setAsynchronousCategory] = useState(0)
  const [visibleCheckSyncForm, setVisibleCheckSyncForm] = useState(false)

  const fetch = async () => {
    await checkSyncAllCategory()
    dispatch({ type: 'category/getAllCategoryModel', payload: params })
  }

  useMemo(() => {
    fetch()
  }, [params, pathname])

  const handleOk = value => { }

  const handleCancel = () => {
    setVisibleEditForm(false)
    setVisibleAddForm(false)
    fetch()
  }

  const handleVisibleEditForm = id => () => {
    setVisibleEditForm(true)
    setIdCategory(id)
  }

  const handleShowAddForm = () => {
    setVisibleAddForm(true)
  }

  const handleConfirmDelete = id => () => {
    Modal.confirm({
      title: formatMessage({ id: 'category.questDelete' }),
      icon: <ExclamationCircleOutlined />,
      onCancel: handleCancel,
      onOk: handleDelete(id),
      okText: formatMessage({ id: 'category.delete' }),
    })
  }

  const handleDelete = id => async () => {
    const { success } = await deleteCategoryService(id)
    if (success) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'category.delSuccess' }),
      })
    } else {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'category.delFailed' }),
      })
    }
    await fetch()
  }

  let onSearchCategory = value => {
    if (locale === 'en-US') {
      setParams({
        ...params,
        enName: value,
      })
    } else {
      setParams({
        ...params,
        vnName: value,
      })
    }
  }
  
  onSearchCategory = _.debounce(onSearchCategory, 500)

  let isValidCategoryCode = async (value: any) => {
    // check code with category path
    const splitPath = value.path.toString().split('/')
    const filterPath = splitPath.filter(
      (f: any) => f.length > 0 && !isNaN(Number(f)),
    )
    const findPath = filterPath.map((m: any) => Number(m)).findIndex(value.id)

    if (findPath !== -1) {
      return true
    }
    return false
  }

  const showTotal = (total: number) => {
    return `${formatMessage({ id: 'product.totalItem' })} ${listCategory && listCategory?.length}`
  }

  const columns: ColumnProps<CategoryItem>[] = [
    {
      title: formatMessage({ id: 'category.index' }), //Ten cot index
       align: 'center',
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },
    {
      title: formatMessage({ id: 'category.category' }), //Ten cot index
      align: 'center',
      render: values => {
        const { id, enName, vnName } = values
        return (
          <>
            <div>
              {formatMessage({ id: 'category.code' })}: #{id}
            </div>
            <div>
              {formatMessage({ id: 'category.name' })}:{' '}
              {locale === 'en-US' ? (
                <Text>{enName}</Text>
              ) : (
                <Text>{vnName}</Text>
              )}
            </div>
          </>
        )
      },
    },
    {
      title: formatMessage({ id: 'category.path' }), //Ten cot index
       align: 'center',
      render: values => {
        return values && values.parent_path ? (
          <>
            <Tag color="geekblue" style={{ fontSize: '13px' }}>
              {values.parent_path}
            </Tag>
          </>
        ) : (
          <>
            <Tag color="default" style={{ fontSize: '13px' }}>
              {formatMessage({ id: 'category.originPath' })}
            </Tag>
          </>
        )
      },
    },
    {
      title: formatMessage({ id: 'category.pathName' }), //Ten cot index
       align: 'center',
      render: values => {
        return values && values.complete_name ? (
          <>
            <div style={{ fontSize: '13px' }}>{values.complete_name}</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '13px' }}>
              {formatMessage({ id: 'category.originPath' })}
            </div>
          </>
        )
      },
    },
    {
      title: formatMessage({ id: 'category.action' }), //Ten cot Action
       align: 'center',
      render: values => {
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button style={{ marginRight: '10px'}}type="primary" shape="circle" icon={<EditOutlined />} onClick={handleVisibleEditForm(values.id)}/>
            <Button type="primary" shape="circle" icon={<DeleteOutlined />} danger  onClick={handleConfirmDelete(values.id)} />
          </div>
        )
      },
    },
  ]

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


  // Sync category flow

  const handleCancelCheckSyncForm = () => {
    setDestroyForm(true)
    setVisibleCheckSyncForm(false)
    fetch()
  }


  const hanldeCheckSyncAllCategory = async () => {
    setFetching(true)
    const res = await checkSyncAllCategory()
    if (res && isArray(res.result) && res.result.length > 0) {
      setAsynchronousCategory(res.result.length)
      setVisibleCheckSyncForm(true)
    } else if (res && res.statusCode) {
      message.error(formatMessage({ id: 'product.syncFail' }))
    } else {
      message.info(formatMessage({ id: 'product.syncedAll' }))
    }
    setFetching(false)
    fetch()
  }

  const handleSyncAllCategory = async () => {
    setFetching(true)
    const result = await syncAllCategory()
    if (result && result.success && !result.statusCode) {
      message.success(formatMessage({ id: 'product.syncSuccess' }))
    } else {
      message.error(formatMessage({ id: 'product.syncFail' }))
    }
    setVisibleCheckSyncForm(false)
    setFetching(false)
    fetch()
  }

  const handleSyncCategory = async id => {
    setFetching(true)

    const result = await syncCategory({ id })

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
      <Card size="small" style={{ padding: '6px 12px 6px 12px' }}>
        <Row>
          <Col
            span={24}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Input.Search
              style={{ width: 300 }}
              // onSearch={onSearchCategory}
                  onChange={e => onSearchCategory(e.target.value)}
              placeholder={formatMessage({ id: 'category.category' })}
              name="category"
              allowClear
            />
          </Col>
        </Row>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button type="dashed" block onClick={handleShowAddForm}>
            <PlusCircleOutlined />
            {formatMessage({ id: 'category.addNew' })}
          </Button>
          <Button
            style={{ width: '19%', marginLeft: 15 }}
            loading={fetching}
            type="primary"
            block
            onClick={() => {
              hanldeCheckSyncAllCategory()
            }}
          >
            <SyncOutlined />
            {formatMessage({ id: 'product.checkSync' })}
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={listCategory}
          loading={loading}
          scroll={{ x: 768 }}
          bordered
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
        <Modal
          destroyOnClose={true}
          maskClosable={false}
          visible={visibleAddForm}
          title={<strong>{formatMessage({ id: 'category.addNew' })}</strong>}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              {formatMessage({ id: 'category.cancel' })}
            </Button>,
            <Button
              form="category-create-page"
              htmlType="submit"
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
            >
              {''}
              {formatMessage({ id: 'category.create' })}
              {''}
            </Button>,
          ]}
        >
          <CreateCategoryForm
            categoryList={listCategory}
            isValidCategoryCode={isValidCategoryCode}
            handleCancel={handleCancel}
          />
        </Modal>

        <Modal
          destroyOnClose={true}
          maskClosable={false}
          visible={visibleEditForm}
          title={
            <strong>{formatMessage({ id: 'category.editCategory' })}</strong>
          }
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              {formatMessage({ id: 'category.cancel' })}
            </Button>,
            <Button
              form="category-edit-page"
              htmlType="submit"
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
            >
              {''}
              {formatMessage({ id: 'category.save' })}
              {''}
            </Button>,
          ]}
        >
          <EditCategoryForm
            categoryList={listCategory}
            idCategory={idCategory}
            isValidCategoryCode={isValidCategoryCode}
            handleCancel={handleCancel}
          />
        </Modal>
        <Modal
          title={formatMessage({ id: 'product.checkSync' })}
          visible={visibleCheckSyncForm}
          centered={true}
          onOk={handleSyncAllCategory}
          onCancel={handleCancelCheckSyncForm}
          destroyOnClose={destroyForm}
          okText={formatMessage({ id: 'product.accept' })}
          cancelText={formatMessage({ id: 'product.cancel' })}
        >
          <p>
            {formatMessage({ id: 'product.beforeSyncAllFirstText' })}{' '}
            <b>{asynchronousCategory}</b>{' '}
            {formatMessage({ id: 'product.beforeSyncAllCategorySecondText' })}
          </p>
        </Modal>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(({ category, loading }: ConnectState) => ({
  loading: loading.effects['category/getAllCategoryModel'],
  listCategory: category?.listCategory || [],
  total: category.total,
}))(Category)
