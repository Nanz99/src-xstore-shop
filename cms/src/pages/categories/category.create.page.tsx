import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  notification,
  Input,
  Button,
  InputNumber,
  Modal,
  Select,
} from 'antd'
import { createCategoryService } from '@/services/categories.service'
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { useIntl, getLocale, connect } from 'umi'
import TextArea from 'antd/lib/input/TextArea'
import SelectCategory from './categories.select.modal'
import { isArray } from 'lodash'
import uniqid from 'uniqid'
import { ConnectState } from '@/models/connect';


class Params {
  page: number = 1
  limit: number = 10
  id?: number
  enName?: string
  vnName?: string
  verified?: boolean
}
const CreateCategory = props => {
  const { handleCancel, listCategory, categoryList, isValidCategoryCode, dispatch } = props
  const { formatMessage } = useIntl()
  const [params, setParams] = useState(new Params())
  const locale = getLocale()
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const [visibleSelectCategoryModal, setVisibleSelectCategoryModal] = useState(
    false,
  )
  const [selectedCatagory, setSelectedCategory] = useState([])

  const [parentId, setParentId] = useState(0)

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const fetch = async () => {
    dispatch({ type: 'category/getAllCategoryModel', payload: params })
  }

  useMemo(() => {
    fetch()
  }, [params])

  const handleCreate = async res => {
    let newData = {
      ...res,
      image: null,
      slug: uniqid(),
      parentId: Number(parentId),
    }
   
    const { success } = await createCategoryService(newData)
    if (success) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'category.createSuccess' }),
      })
      form.resetFields()
      handleCancel()
    } else {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'category.createFailed' }),
      })
      form.resetFields()
      handleCancel()
    }
  }

  const handleSelectedCategory = values => {
    setSelectedCategory(values)
    form.setFieldsValue({ parentId: values[0]?.key })
    setVisibleSelectCategoryModal(false)
  }

  const handleShowSelect = () => {
    setVisibleSelectCategoryModal(true)
  }

  const handleCancelSelect = () => {
    setVisibleSelectCategoryModal(false)
  }

  return (
    <>
      <Form
        name="category-create-page"
        form={form}
        {...layout}
        onFinish={handleCreate}
      >
        <FormItem
          label={formatMessage({ id: 'category.enName' })}
          name="enName"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'category.reqCategory' }),
            },
          ]}
        >
          <Input type="text" />
        </FormItem>

        <FormItem
          label={formatMessage({ id: 'category.vnName' })}
          name="vnName"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'category.reqCategory' }),
            },
          ]}
        >
          <Input type="text" />
        </FormItem>

        {/* <FormItem
          label={formatMessage({ id: 'category.slug' })}
          name="slug"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'category.reqSlug' }),
            },
          ]}
        >
          <Input type="text" />
        </FormItem> */}

        <FormItem
          label={formatMessage({ id: 'category.parentCategory' })}
          name="parentId"
        >
          <Select
            // open={false}
            allowClear
            // onClear={() => handleSelectedCategory([])}
            // onClick={handleShowSelect}
            onChange={(value) => setParentId(value)}
          >
            <Select.Option value="0">{formatMessage({ id: 'category.notParent' })}</Select.Option>
            {listCategory && listCategory?.length > 0 ? listCategory.map(values => (
              <Select.Option value={values.id}>{values.vnName}</Select.Option>
            )) : null}
          </Select>
        </FormItem>

        <FormItem
          label={formatMessage({ id: 'category.description' })}
          name="description"
        >
          <TextArea rows={3} />
        </FormItem>
      </Form>
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        visible={visibleSelectCategoryModal}
        title={
          <strong>{formatMessage({ id: 'category.selectCategory' })}</strong>
        }
        onCancel={handleCancelSelect}
        footer={null}
      >
        <SelectCategory
          handleSelectedCategory={handleSelectedCategory}
          handleCancelSelect={handleCancelSelect}
        />
      </Modal>
    </>
  )
}


export default connect(({ category, loading }: ConnectState) => ({
  loading: loading.effects['category/getAllCategoryModel'],
  listCategory: category?.listCategory || [],
  total: category.total,
}))(CreateCategory)