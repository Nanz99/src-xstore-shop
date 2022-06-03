import React, { useState, useMemo } from 'react'
import { Table, Button } from 'antd'
import { connect, getLocale, useIntl } from 'umi'
import { isArray } from 'lodash'
import { ConnectState } from '@/models/connect'

interface DataType {
  key: React.Key
  name: string
  slug: string
  path: string
  disabled: boolean
}
class Params {
  page: number = 1
  limit: number = 10
  id?: number
  enName?: string
  vnName?: string
  verified?: boolean
}

const SelectCategory = props => {
  const {
    dispatch,
    loading,
    listCategory,
    total,
    handleSelectedCategory,
    handleCancelSelect,
    presentCategory,
  } = props
  const { formatMessage } = useIntl()
  const locale = getLocale()
  const [params, setParams] = useState(new Params())
  const [selected, setSeleted] = useState<DataType[]>([])

  const fetch = async () => {
    dispatch({ type: 'category/getAllCategoryModel', payload: params })
  }

  useMemo(() => {
    fetch()
  }, [params])

  const columns = [
    {
      title: formatMessage({ id: 'category.name' }),
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'category.category' }),
      dataIndex: 'slug',
    },
    {
      title: formatMessage({ id: 'category.path' }),
      dataIndex: 'path',
    },
  ]

  // Hanlde change page table
  const hanldeTableChange = (page: number) => {
    const newParams = { ...params }
    if (params.page !== page) {
      newParams.page = page
    }
    setParams(newParams)
  }

  // Handle change size table
  const hanldeShowSizeChange = (current: number, size: number) => {
    if (params.limit !== size) {
      params.limit = size
    }
  }

  // Split parent_path to array
  const splitPathCategory = (values: any) => {
    if (!values && !isArray(values)) return

    const splitPath = values.toString().split('/')
    const filterPath = splitPath.filter(
      (f: any) => f.length > 0 && !isNaN(Number(f)),
    )
    return filterPath
  }

  // Handle disabled limited nested category
  const visibleRow = (values: any) => {
    const nextArray = splitPathCategory(values?.parent_path) || []

    // Change to edit category or create category
    if (presentCategory) {
      const presentCategoryPath = presentCategory?.parent_path
      const preArray = splitPathCategory(presentCategoryPath)
      const sumPath = preArray.concat(nextArray)

      // Can choose the same category
      if (presentCategory?.id !== values?.id) {
        return sumPath.length > 0 && sumPath.length <= 3 ? true : false
      } else {
        return nextArray.length <= 3 ? true : false
      }
    } else {
      return nextArray.length <= 2 ? true : false
    }
  }

  // Convert result data from api to datatype
  const formatCategoryList = (values: any) => {
    if (!values) return

    const presentCategoryId = presentCategory?.id || -1
    let newValues: DataType[] = values?.map((obj: any, k: number) => {
      return {
        key: obj?.id,
        name: locale === 'en-US' ? obj?.enName : obj?.vnName,
        slug: obj?.slug,
        path: obj?.complete_name,
        disabled: !visibleRow(obj),
      }
    })
    return newValues
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSeleted(selectedRows)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record?.disabled, // Column configuration not to be checked
    }),
  }

  const handleSelect = (value: DataType[]) => {
    handleSelectedCategory(value)
  }

  return (
    <div>
      <div>
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={formatCategoryList(listCategory)}
          loading={loading}
          pagination={{
            showSizeChanger: true,
            current: params.page,
            pageSize: params.limit,
            total: total,
            onChange: hanldeTableChange,
            onShowSizeChange: hanldeShowSizeChange,
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '8px',
        }}
      >
        <Button
          style={{ marginRight: '8px' }}
          type="default"
          onClick={() => handleCancelSelect()}
        >
          {formatMessage({ id: 'category.cancel' })}
        </Button>
        <Button
          disabled={selected.length === 0}
          type="primary"
          onClick={() => handleSelect(selected)}
        >
          {formatMessage({ id: 'category.save' })}
        </Button>
      </div>
    </div>
  )
}

export default connect(({ category, loading }: ConnectState) => ({
  loading: loading.effects['category/getAllCategoryModel'],
  listCategory: category?.listCategory || [],
  total: category.total,
}))(SelectCategory)
