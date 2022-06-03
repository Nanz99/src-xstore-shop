import {
  Form,
  Input,
  Col,
  Card,
  notification,
  Row,
  message,
  Button,
  Space,
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
} from '@/services/product.service'
import TextArea from 'antd/lib/input/TextArea'
import omit from 'lodash'
import numeral from 'numeral'
import styles from './style.less'

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
  const { exportFormValue, listProduct, handleCancel } = props
  const { formatMessage } = useIntl()
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const [mainValue, setMainValue] = useState(new MainValue())
  const [shippingFee, setShippingFee] = useState()
  const [subTotal, setSubTotal] = useState()
  const [quantity, setQuantity] = useState([])
  const [unitPrice, setUnitPrice] = useState([])
  const [totalProduct, setTotalProduct] = useState([])

  const getValueForm = () => {
    if (exportFormValue) {
      const tempValue = { ...mainValue }
      tempValue.stockinProducts = exportFormValue.orderProducts

      // set quantity item to calculate every product
      const tempQuantity: any = [...quantity]
      for (let i = 0; i < exportFormValue.orderProducts.length; i++) {
        tempQuantity[i] = exportFormValue.orderProducts[i].quantity
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

      for (let i = 0; i < exportFormValue.orderProducts.length; i++) {
        tempUnitPrice[i] = exportFormValue.orderProducts[i].product.retailPrice
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
    setSubTotal(undefined)
    setShippingFee(undefined)
    handleCancel()
  }

  const handleCreate = async res => {
    const tempValue = res.stockinProducts.map((values, item) => ({
      productId: values.productId,
      color: values.color,
      size: values.size,
      quantity: values.quantity,
      unitPrice: values.unitPrice,
      total: values.quantity * values.unitPrice,
    }))
    const data = {
      stockoutProducts: [...tempValue],
      orderId: exportFormValue.id,
      message: res.message,
      subTotal: Number(res.subTotal),
      shippingPrice: Number(res.shippingPrice) || 0,
      grandTotal: Number(res.grandTotal),
    }
    const { success } = await postStockoutService(data)
    if (success === true) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'stockin.createSuccess' }),
      })
      form.resetFields()
      handleClose()
    } else {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'stockin.createFailed' }),
      })
      form.resetFields()
      handleClose()
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
            <Form.List name="stockinProducts">
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <Space key={field.key} align="start">
                        <Form.Item
                          {...field}
                          style={{ width: '30px' }}
                          // label={formatMessage({ id: 'stockin.index' })}
                          name={[field.name, 'Id']}
                          fieldKey={[field.fieldKey, 'Id']}
                        >
                          <Input
                            disabled={true}
                            style={{ width: '100%', textAlign: 'center' }}
                            size="small"
                            defaultValue={index + 1}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          style={{ width: '280px' }}
                          label={formatMessage({ id: 'stockin.name' })}
                          name={[field.name, 'productId']}
                          fieldKey={[field.fieldKey, 'productId']}
                          rules={[
                            {
                              required: true,
                              message: formatMessage({
                                id: 'stockin.required',
                              }),
                            },
                          ]}
                        >
                          {/* <InputNumber
                              size="small"
                              placeholder={formatMessage({
                                id: 'stockin.productId',
                              })}
                              style={{ width: '100%' }}
                            /> */}

                          <Select
                            disabled={true}
                            showSearch
                            size="small"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {(listProduct || []).map(item => (
                              <Option key={item.id} value={item.id}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label={formatMessage({ id: 'stockin.color' })}
                          style={{ width: '160px', textAlign: 'center' }}
                          name={[field.name, 'color']}
                          fieldKey={[field.fieldKey, 'color']}
                          rules={[
                            {
                              required: false,
                              // message: formatMessage({
                              //   id: 'stockin.required',
                              // }),
                            },
                          ]}
                        >
                          <Input size="small" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label={formatMessage({ id: 'stockin.size' })}
                          style={{ width: '160px', textAlign: 'center' }}
                          name={[field.name, 'size']}
                          fieldKey={[field.fieldKey, 'size']}
                          rules={[
                            {
                              required: false,
                              // message: formatMessage({
                              //   id: 'stockin.required',
                              // }),
                            },
                          ]}
                        >
                          <Input size="small" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label={formatMessage({ id: 'stockin.totalQuantity' })}
                          style={{ width: '160px', textAlign: 'center' }}
                          name={[field.name, 'quantity']}
                          fieldKey={[field.fieldKey, 'quantity']}
                          rules={[
                            {
                              required: true,
                              message: formatMessage({
                                id: 'stockin.required',
                              }),
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            disabled={true}
                            style={{ width: '100%', textAlign: 'center' }}
                            onChange={evt => handleChangeQuantity(evt, index)}
                            size="small"
                            placeholder={formatMessage({
                              id: 'stockin.productQuantity',
                            })}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label={formatMessage({ id: 'stockin.unitPrice' })}
                          name={[field.name, 'unitPrice']}
                          fieldKey={[field.fieldKey, 'unitPrice']}
                          rules={[
                            {
                              required: true,
                              message: formatMessage({
                                id: 'stockin.required',
                              }),
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            disabled={true}
                            size="small"
                            onChange={evt => handleChangeUnitPrice(evt, index)}
                            placeholder={formatMessage({
                              id: 'stockin.unitPrice',
                            })}
                            style={{ width: '100%' }}
                            formatter={value =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                        <Form.Item {...field}>
                          <Button
                            disabled={true}
                            danger
                            size="small"
                            type="link"
                            onClick={() => {
                              remove(field.name)
                              handleDeleteItem(index)
                            }}
                            icon={<DeleteOutlined />}
                          ></Button>
                        </Form.Item>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        disabled={true}
                        size="small"
                        type="dashed"
                        onClick={() => {
                          add()
                        }}
                        block
                      >
                        <PlusOutlined />{' '}
                        {formatMessage({ id: 'stockout.addProduct' })}
                      </Button>
                    </Form.Item>
                  </div>
                )
              }}
            </Form.List>
          </Col>
          <Col span={24}>
            <Row>
              <Col span={10}>
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

                {/* Message */}
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
                    style={{ width: '100%', marginTop: '4px' }}
                    rows={3}
                  />
                </FormItem>
              </Col>
              <Col span={14}>
                {/* //Shiping Price
                <Row>
                  <Col
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    span={10}
                  >
                    <Text style={labelStyle}>
                      {formatMessage({ id: 'stockin.shippingPrice' })}:
                    </Text>
                  </Col>
                  <Col
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    span={14}
                  >
                    <FormItem
                      style={{ width: '160px' }}
                      name="shippingPrice"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'stockin.required' }),
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        disabled={true}
                        style={{ width: '160px' }}
                        value={shippingFee}
                        size="small"
                        formatter={value =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        //addonAfter="vnd"
                        onChange={e => handleChangeShippingFee(e)}
                      />
                    </FormItem>
                  </Col>
                </Row> */}
                {/* //Subtotal */}
                <Row>
                  <Col
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    span={10}
                  >
                    <Text style={labelStyle}>
                      {formatMessage({ id: 'stockin.subTotal' })}:
                    </Text>
                  </Col>
                  <Col
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    span={14}
                  >
                    <FormItem
                      style={{ width: '160px' }}
                      name="subTotal"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'stockin.required' }),
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        disabled={true}
                        style={{ width: '160px' }}
                        formatter={value =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        size="small"
                        // addonAfter="vnd"
                      />
                    </FormItem>
                  </Col>
                </Row>
                {/* //grandTotal*/}
                <Row justify="end">
                  <Col
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    span={10}
                  >
                    <Text style={labelStyle}>
                      {formatMessage({ id: 'stockin.grandTotal' })}:
                    </Text>
                  </Col>
                  <Col
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    span={14}
                  >
                    <FormItem
                      style={{ width: '160px' }}
                      name="grandTotal"
                      rules={[
                        {
                          required: true,
                          message: formatMessage({ id: 'stockin.required' }),
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        disabled={true}
                        style={{ width: '160px' }}
                        formatter={value =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        size="small"
                        // addonAfter="vnd"
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider style={{ margin: '12px 0' }} />
        <div className={styles.button_view}>
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
              {' '}
              {formatMessage({ id: 'stockin.create' })}{' '}
            </Button>
          </FormItem>
        </div>
      </Form>
    </>
  )
}
export default CreateStockin
