import {
  Form,
  Input,
  Col,
  Card,
  notification,
  Row,
  message,
  Button,
  InputNumber,
  Divider,
  Typography,
  Tag,
  Select,
  Descriptions,
} from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { formatMessage, useIntl } from 'umi'
import {
  CheckCircleOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  postStockoutService,
  createStockinService,
  postStockoutOrder,
 
} from '@/services/product.service'
import TextArea from 'antd/lib/input/TextArea'
import omit from 'lodash'
import numeral from 'numeral'
import styles from './style.less'
import { ORDER_STATUS } from '@/utils/constants'
import IdPage from './[id].page'
import { getDetailOrderService } from '@/services/order.service'
import { DatePicker, Space } from 'antd';
import FormItem from 'antd/lib/form/FormItem'

const { Text } = Typography
const { Option } = Select

const labelStyle = {
  lineHeight: '37px',
}

class MainValue {
  stockinProducts?: []
  orderId?: number
  message?: string
  shippingPrice?: number
  subTotal?: number
  grandTotal?: number
}

const CreateStockin = props => {
  const {
    id,
    exportFormValue,
    handleChangeOrder,
    listProduct,
    handleCancel,
  } = props
  const { formatMessage } = useIntl()
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const [mainValue, setMainValue] = useState(new MainValue())
  const [amountProduct, setAmountProduct] = useState(0)
  const [shippingFee, setShippingFee] = useState(0)
  const [subTotal, setSubTotal] = useState(0)
  const [quantity, setQuantity] = useState([])
  const [unitPrice, setUnitPrice] = useState([])
  const [totalProduct, setTotalProduct] = useState([])
  const [estimateDate, setEstimateDate] = useState('')
  const [estimateDateLasted, setEstimateDateLasted] = useState('')

  const getValueForm = () => {
    if (exportFormValue) {
      const tempValue = { ...mainValue }

      // filter all remain product item is out order
      const filterRemain = exportFormValue.orderProducts.filter(
        item => item.remain !== 0,
      )
      tempValue.stockinProducts = filterRemain
      setAmountProduct(filterRemain.length)

      // set quantity item to calculate every product
      const tempQuantity: any = [...quantity]
      for (let i = 0; i < exportFormValue.orderProducts.length; i++) {
        tempQuantity[i] = exportFormValue.orderProducts[i].remain
      }
      setQuantity(tempQuantity)

      // set unit price item to calculate every product
      const tempUnitPrice: any = [...unitPrice]
      // for (let i = 0; i < exportFormValue.orderProducts.length; i++) {
      //   // where product.id = order.id
      //   const item = listProduct.find(
      //     ({ id }) => id === exportFormValue.orderProducts[i].productId,
      //   )
      //   tempUnitPrice[i] = item.retailPrice

      //   // set value for form list
      //   tempValue.stockinProducts[i].unitPrice = tempUnitPrice[i]
      // }

      // set unit price (retail price) to calculate every product
      for (let i = 0; i < exportFormValue.orderProducts.length; i++) {
        tempUnitPrice[i] = exportFormValue?.orderProducts[i]?.product?.retailPrice
      }
      setUnitPrice(tempUnitPrice)

      // set shipping fee to calculate grand total
      setShippingFee(exportFormValue.shippingFee)

      // set value to display on form
      tempValue.orderId = exportFormValue.id
      tempValue.message = exportFormValue.message
      tempValue.shippingPrice = exportFormValue.shippingFee
      tempValue.grandTotal = exportFormValue.grandTotal
      setMainValue(tempValue)
      form.setFieldsValue(tempValue)
    }
  }

  const handleChangeQuantity = (value, index) => {
    const tempQuantity: any = [...quantity]
    tempQuantity[index] = value
    setQuantity(tempQuantity)
  }

  const handleChangeUnitPrice = (value, index) => {
    const tempUnitPrice: any = [...unitPrice]
    tempUnitPrice[index] = value
    setUnitPrice(tempUnitPrice)
  }

  const handleChangeShippingFee = value => {
    setShippingFee(Number(value))
  }

  const handleDeleteItem = value => {
    if (
      quantity.length > 1 &&
      unitPrice.length > 1 &&
      totalProduct.length > 1
    ) {
      // delete one item in array when click delete item
      const tempQuantity = [...quantity]
      tempQuantity.splice(value, 1)
      setQuantity(tempQuantity)

      const tempUnitPrice = [...unitPrice]
      tempUnitPrice.splice(value, 1)
      setUnitPrice(tempUnitPrice)

      const tempSubTotal = [...totalProduct]
      tempSubTotal.splice(value, 1)
      setTotalProduct(tempSubTotal)
    } else {
      // reset number fields when array product is empty
      form.resetFields(['subTotal', 'grandTotal', 'shippingPrice'])
      setQuantity([])
      setUnitPrice([])
      setTotalProduct([])
      setSubTotal(0)
      setShippingFee(0)
    }
  }

  const calcTotalProduct = () => {
    const tempTotalProduct: any = [...totalProduct]
    if (quantity && quantity.length > 0 && unitPrice && unitPrice.length > 0) {
      for (var i = 0; i < quantity.length; i++) {
        tempTotalProduct[i] = quantity[i] * unitPrice[i]
      }
      setTotalProduct(tempTotalProduct)
    }
  }

  const calcSubtotal = () => {
    let sub = 0
    if (totalProduct && totalProduct.length > 0) {
      for (var i = 0; i < totalProduct.length; i++) {
        sub += totalProduct[i]
      }
      if (!totalProduct.includes(NaN)) {
        form.setFieldsValue({
          subTotal: sub,
        })
        setSubTotal(sub)
      }
    }
  }

  const calcGrandTotal = () => {
    let grand = 0
    if (typeof shippingFee === 'number' && typeof subTotal === 'number') {
      grand = Number(shippingFee) + Number(subTotal)
    }
    form.setFieldsValue({
      grandTotal: grand,
    })
  }

  const handleClose = () => {
    form.resetFields()
    setQuantity([])
    setUnitPrice([])
    setTotalProduct([])
    setSubTotal(0)
    setShippingFee(0)
    handleCancel()
  }
 
  const handleCreate = async res => {
    form.resetFields()
    handleClose()
    if(estimateDate !== "" && estimateDateLasted !== ""){
      const data = {
        orderId: exportFormValue.id,
        message: res.message,
        required_note: res.required_note,
        estimateDate: estimateDate?.format('YYYY-MM-DD[T]HH:mm:ss'),
        estimateDateLasted:  estimateDateLasted?.format('YYYY-MM-DD[T]HH:mm:ss')
      }
      
      const { success } = await postStockoutOrder(data)
    if (success === true) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'stockout.export_success' }),
      })
      form.resetFields()
      handleClose()
    } else {
      notification.error({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'stockin.createFailed' }),
      })
      form.resetFields()
      handleClose()
    }
    }
  }

  useMemo(() => {
    getValueForm()
  }, [exportFormValue])

  useMemo(() => {
    calcTotalProduct()
  }, [quantity, unitPrice])

  useMemo(() => {
    calcSubtotal()
  }, [totalProduct])

  useMemo(() => {
    calcGrandTotal()
  }, [subTotal, shippingFee])

  return (
    <>
      <Form form={form} onFinish={handleCreate} size="large">
        <Row>
          <Col span={24}>
            <Row>
              <Col span={12}>
                {/* Order Id */}
                <FormItem
                  label={
                    <strong>{formatMessage({ id: 'stockin.orderId' })}</strong>
                  }
                  name="orderId"
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'stockin.required' }),
                    },
                  ]}
                >
                  <Tag
                    color="blue"
                    style={{ fontSize: '14px', fontWeight: 'bold' }}
                  >
                    #{exportFormValue.id}
                  </Tag>
                </FormItem>
                <FormItem
                  style={{ width: '100%' }}
                  label={formatMessage({ id: 'stockout.require_note' })}
                  name="required_note"
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'stockin.required' }),
                    },
                  ]}
                >
                  <Select
                    style={{ width: 250, marginRight: '15px' }}
                    allowClear
                  >
                    <Select.Option value="CHOTHUHANG" >
                      <span>{formatMessage({ id: 'stockout.require_note1' })}</span>
                    </Select.Option>
                    <Select.Option value="CHOXEMHANGKHONGTHU">
                      <span>{formatMessage({ id: 'stockout.require_note2' })}</span>
                    </Select.Option>
                    <Select.Option value="KHONGCHOXEMHANG" >
                      <span>{formatMessage({ id: 'stockout.require_note3' })}</span>
                    </Select.Option>
                  </Select>
                </FormItem>
                <FormItem
                  style={{ width: '100%' }}
                  label={formatMessage({ id: 'stockin.message' })}
                  name="message"
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'stockin.required' }),
                    },
                  ]}
                >
                  <TextArea
                    style={{ width: '300px', marginTop: '4px' }}
                    rows={4}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
               <div style={{ marginTop: 55}}>
               <FormItem
                  style={{ width: '100%' }}
                  label={formatMessage({ id: 'stockout.estimateDate' })}
                  name="estimateDate"
                  required
                >
                  <Space direction="vertical">
                    <DatePicker onChange={(date) => setEstimateDate(date)} />
                  </Space>
                </FormItem>
                <FormItem
                  style={{ width: '100%' }}
                  label={formatMessage({ id: 'stockout.estimateDateLatest' })}
                  name="estimateDateLasted"
                  required
                >
                  <Space direction="vertical">
                    <DatePicker onChange={(date) => setEstimateDateLasted(date)}  />
                  </Space>
                </FormItem>
               </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider style={{ margin: '12px 0' }} />
        <div
          style={{
            width: '100%',
            height: '32px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <FormItem>
            <Button size="small" onClick={handleClose}>
              {formatMessage({ id: 'account.cancelBtn' })}
            </Button>
          </FormItem>
          <FormItem>
            <Button
              style={{ marginLeft: '8px' }}
              size="small"
              type="primary"
              htmlType="submit"
            >
              Xuất kho
            </Button>
          </FormItem>
        </div>
      </Form>
    </>
  )
}
export default CreateStockin
