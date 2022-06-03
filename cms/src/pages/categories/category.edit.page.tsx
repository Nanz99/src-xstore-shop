import React, { useEffect, useMemo, useState } from 'react'
import {
  Input,
  Button,
  Modal,
  Form,
  Switch,
  notification,
  InputNumber,
  Select,
} from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { editCategory } from '@/services/categories.service'
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useIntl, getLocale, connect } from 'umi'
import SelectCategory from './categories.select.modal'
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

const EditCategory = props => {
  const { categoryList, idCategory, handleCancel, dispatch, listCategory } = props
  const { formatMessage } = useIntl()
  const locale = getLocale()
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const [params, setParams] = useState(new Params())
  const [presentCategory, setPresentCategory] = useState({})
  const [visibleSelectCategoryModal, setVisibleSelectCategoryModal] = useState(
    false,
  )
  const [selectedCatagory, setSelectedCategory] = useState([])
  const [parentId, setParentId] = useState('')
  const fetch = async () => {
    dispatch({ type: 'category/getAllCategoryModel', payload: params })
  }

    console.log({parentId})
  useMemo(() => {
    fetch()
  }, [params])

  useMemo(() => {
    if (categoryList) {
      let category = categoryList
        .filter(item => item.id === idCategory)
        .map((obj, k) => {
          setParentId(obj?.parentId?.id || obj?.id)
          return {
            ...obj,
            parentId: obj?.parentId?.id || obj?.id,
            key: obj?.id,
            name: locale === 'en-US' ? obj?.enName : obj?.vnName,
          }
        })
      setPresentCategory(category[0])
      setSelectedCategory(category)
      form.setFieldsValue({ ...category[0] })
    }
  }, [idCategory])

  
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const handleEdit = async res => {
    let newData = {
      ...res,
      image: null,
      slug: uniqid(),
      parentId: Number(parentId),
    }
    const { success } = await editCategory(idCategory, newData)
    if (success) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'category.editSuccess' }),
      })
      await handleCancel()
    } else {
      notification.success({
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'category.editFailed' }),
      })
      await handleCancel()
    }
  }

  const handleSelectedCategory = values => {
    form.setFieldsValue({ parentId: values[0]?.key })
    setSelectedCategory(values)
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
        name="category-edit-page"
        form={form}
        {...layout}
        onFinish={handleEdit}
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
            {/* {selectedCatagory && selectedCatagory.length > 0
              ? selectedCatagory.map(values => (
                  <Select.Option value={values['key']}>{values['name']}</Select.Option>
                ))
              : ''} */}
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
          presentCategory={presentCategory}
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
}))(EditCategory)