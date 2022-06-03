import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { createCategoryService } from '@/services/categories.service'
import { useIntl, getLocale, CategoryItem } from 'umi'
import Tag from 'antd/es/tag'

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: CategoryItem[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    )
  },
  getCheckboxProps: (record: CategoryItem) => ({
    disabled: record.id === 'Disabled User', // Column configuration not to be checked
    name: record.id,
  }),
}

const SelectCategory = props => {
  const {
    categoryList: dataSource,
    isValidCategoryCode,
    setSelectedCategory,
    handleCancel,
  } = props
  const { formatMessage } = useIntl()
  const locale = getLocale()

  const columns: ColumnProps<CategoryItem>[] = [
    {
      title: 'Id', //Ten cot index
      render: values => {
        const { id } = values
        return (
          <>
            <div>{id}</div>
          </>
        )
      },
    },
    {
      title: formatMessage({ id: 'category.category' }), //Ten cot index
      render: values => {
        const { enName, vnName } = values
        return (
          <>
            <div>
              {formatMessage({ id: 'category.name' })}:{' '}
              {locale === 'en-US' ? <div>{enName}</div> : <div>{vnName}</div>}
            </div>
          </>
        )
      },
    },
    {
      title: formatMessage({ id: 'category.path' }), //Ten cot index
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
  ]

  const handleSelect = async res => {
    const { success } = await createCategoryService(res)
  }

  const validatorPath = (rule, value, callback) => {
    if (isNaN(value) || value.length > 10) {
      callback(formatMessage({ id: 'account.phoneWrong' }))
    }
    callback()
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
      />
    </>
  )
}

export default SelectCategory
