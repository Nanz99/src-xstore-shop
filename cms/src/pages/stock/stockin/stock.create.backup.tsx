import {
  Form,
  Input,
  Col,
  Card,
  notification,
  Row,
  message,
  Button,
} from 'antd'
import React from 'react'
import { useIntl } from 'umi'
import { CheckCircleOutlined } from '@ant-design/icons'
import { createStockinService } from '@/services/product.service'
import TextArea from 'antd/lib/input/TextArea'

const CreateStockin = props => {
   const { formatMessage } = useIntl()
  const { handleCancel } = props
  const [form] = Form.useForm()
  const FormItem = Form.Item

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const handleCreate = async res => {
    const data = {
      stockinProducts: [
        {
          productId: Number(res.productId),
          quantity: Number(res.quantity),
          unitPrice: Number(res.unitPrice),
          total: Number(res.total),
        },
      ],
      message: res.message,
      subTotal: Number(res.subTotal),
      shippingPrice: Number(res.shippingPrice),
      grandTotal: Number(res.grandTotal),
    }
    const { success } = await createStockinService(data)
    if (success === true) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'stockin.createSuccess' }),
      })
      form.resetFields()
      handleCancel()
    } else {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'stockin.createFailed' }),
      })
      form.resetFields()
      handleCancel()
    }
  }

  return (
    <>
      <Form form={form} onFinish={handleCreate} size="large">
        <Row>
          <Col span={12}>
            <Card
              title={
                <div>
                  <h1>{formatMessage({ id: 'stockin.product' })}</h1>
                </div>
              }
            >
              {/* ProductID */}
              <FormItem
                label={formatMessage({ id: 'stockin.productId' })}
                name="productId"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'stockin.required' }),
                  },
                ]}
              >
                <Input type="text" />
              </FormItem>
              {/* Quantity */}
              <FormItem
                label={formatMessage({ id: 'stockin.productQuantity' })}
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'stockin.required' }),
                  },
                ]}
              >
                <Input type="number" />
              </FormItem>
              {/* Unit price */}
              <FormItem
                label={formatMessage({ id: 'stockin.unitPrice' })}
                name="unitPrice"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'stockin.required' }),
                  },
                ]}
              >
                <Input type="number" />
              </FormItem>
              {/* Total */}
              <FormItem
                label={formatMessage({ id: 'stockin.totalProduct' })}
                name="total"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'stockin.required' }),
                  },
                ]}
              >
                <Input type="number" />
              </FormItem>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={
                <div>
                  <h1>{formatMessage({ id: 'stockin.info' })}</h1>
                </div>
              }
            >
              {/* MESSAGE */}
              <FormItem
                label={formatMessage({ id: 'stockin.message' })}
                name="message"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'stockin.required' }),
                  },
                ]}
              >
                <TextArea rows={5} />
              </FormItem>
              {/* //Subtotal */}
              <FormItem
                label={formatMessage({ id: 'stockin.subTotal' })}
                name="subTotal"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'stockin.required' }),
                  },
                ]}
              >
                <Input type="number" />
              </FormItem>
              {/* //Shiping Price */}
              <FormItem
                label={formatMessage({ id: 'stockin.shippingPrice' })}
                name="shippingPrice"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'stockin.required' }),
                  },
                ]}
              >
                <Input type="number" />
              </FormItem>
              {/* //grandTotal*/}
              <FormItem
                label={formatMessage({ id: 'stockin.grandTotal' })}
                name="grandTotal"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'stockin.required' }),
                  },
                ]}
              >
                <Input type="number" />
              </FormItem>
            </Card>
          </Col>
        </Row>
        <FormItem {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {' '}
            {formatMessage({ id: 'stockin.create' })}{' '}
          </Button>
        </FormItem>
      </Form>
    </>
  )
}
export default CreateStockin
