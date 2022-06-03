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
import { useIntl, getLocale } from 'umi'

import uniqid from 'uniqid'
import {putSize} from '@/services/product.service'

const EditSize = props => {
  const { categoryList,listSize, idCategory, handleCancel, idSize } = props
  const { formatMessage } = useIntl()
  const locale = getLocale()
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const [presentSize, setPresentSize] = useState({})
  const [visibleSelectCategoryModal, setVisibleSelectCategoryModal] = useState(
    false,
  )
  const [selectedCatagory, setSelectedCategory] = useState([])
  

  useMemo(() => {
    if (listSize) {
      let newItem = listSize?.filter(item => item.id === idSize)
        ?.map((obj, k) => {
          return {
            size: obj?.size,
            description: obj?.description
          }
        })
      form.setFieldsValue({...newItem[0]})
    }
  }, [idSize])


  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const handleEdit = async res => {
    let newData = {
      ...res
    }
    const { success } = await putSize(idSize, newData)
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
        name="product-create-page"
        form={form}
        {...layout}
        onFinish={handleEdit}
      >
        <FormItem
          label={formatMessage({ id: 'menu.Properties.Size' })}
          name="size"
          fieldKey="size"
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
          label={formatMessage({ id: 'service.description'  })}
          name="description"
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
        {/* <FormItem
          label={formatMessage({ id: 'category.parentCategory' })}
          name="parentId"
        >
          <Select
            open={false}
            allowClear
            onClear={() => handleSelectedCategory([])}
            onClick={handleShowSelect}
          >
            {selectedCatagory && selectedCatagory.length > 0
              ? selectedCatagory.map(values => (
                  <option value={values['key']}>{values['name']}</option>
                ))
              : ''}
          </Select>
        </FormItem> */}
        {/* <FormItem
          label={formatMessage({ id: 'category.description' })}
          name="description"
        >
          <TextArea rows={3} />
        </FormItem> */}
      </Form>
      {/* <Modal
        destroyOnClose={true}
        maskClosable={false}
        visible={visibleSelectCategoryModal}
        title={
          <strong>{formatMessage({ id: 'category.selectCategory' })}</strong>
        }
        onCancel={handleCancelSelect}
        footer={null}
      >
        
      </Modal> */}
    </>
  )
}
export default EditSize
