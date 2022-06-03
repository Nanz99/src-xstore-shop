import React, { useState, useEffect, Fragment } from 'react'
import {
  Form,
  Input,
  Upload,
  Select,
  Button,
  Cascader,
  Radio,
  Avatar,
  Divider,
  message,
  InputNumber,
  Tag,
} from 'antd'
import {
  Dispatch,
  useIntl,
  useParams,
  useLocation,
  connect,
  history,
} from 'umi'
import styles from './style.less'
import { postCreateAccount } from '@/services/account.service'
import { formatMessageResponse, residences } from '@/utils/utils'

const FormItem = Form.Item
const { Option } = Select

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}

const Create = props => {
  const { handleCancelCreateView } = props
  const [form] = Form.useForm()
  const { formatMessage } = useIntl()
  const [radioValue, setRadioValue] = useState('OPERATOR')

  const validatorName = (rule, value, callback) => {
    if (value.length > 14) {
      callback(formatMessage({ id: 'account.oversizeName' }))
    }
    callback()
  }

  const validatorEmail = (rule, value, callback) => {
    if (!value) {
      callback(formatMessage({ id: 'account.required' }))
    }
    callback()
  }

  const validatorPassword = (rule, value, callback) => {
    if (value.length > 0 && value.length < 8) {
      callback(formatMessage({ id: 'account.passwordWeak' }))
    }
    callback()
  }

  const validatorConfirmPassword = (rule, value, callback) => {
    const password = form.getFieldValue('password')
    if (!value || password === value) {
      callback()
    }
    callback(formatMessage({ id: 'account.passwordNotMatch' }))
  }

  const validatorPhone = (rule, value, callback) => {
    if (isNaN(value) || value.length > 10) {
      callback(formatMessage({ id: 'account.phoneWrong' }))
    }
    callback()
  }

  const handleChangeRadio = e => {
    setRadioValue(e.target.value)
  }

  const handleCancel = () => {
    form.resetFields()
    handleCancelCreateView()
  }

  const handleSubmit = async values => {
    if (values && typeof values.email === 'string') {
      const newData = { ...values }
      newData.role = radioValue
      newData.fullName = values.firstName + ' ' + values.lastName
      const res = await postCreateAccount(newData)
      if (!res.message) {
        message.success('Account successfully created')
        handleCancel()
      } else {
        message.warning(formatMessageResponse(res.message))
      }
    } else {
    }
  }

  return (
    <Fragment>
      <Form form={form} {...layout} onFinish={handleSubmit}>
        <div className={styles.baseView}>
          <div className={styles.left}>
            <FormItem
              label={formatMessage({ id: 'account.email' })}
              name="email"
              required={true}
              rules={[
                {
                  type: 'email',
                  message: formatMessage({ id: 'account.emailWrong' }),
                },
                {
                  validator: validatorEmail,
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'account.password' })}
              name="password"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.required' }),
                },
                {
                  validator: validatorPassword,
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'account.confirmPassword' })}
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.required' }),
                },
                // ({ getFieldValue }) => ({
                //   validator(rule, value) {
                //     if (!value || getFieldValue('password') === value) {
                //       return Promise.resolve();
                //     }
                //     return Promise.reject('Not match password')
                //   }
                // })
                {
                  validator: validatorConfirmPassword,
                },
              ]}
            >
              <Input.Password />
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'account.firstName' })}
              name="firstName"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.required' }),
                },
                {
                  validator: validatorName,
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'account.lastName' })}
              name="lastName"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.required' }),
                },
                {
                  validator: validatorName,
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'account.description' })}
              name="description"
              rules={[
                {
                  message: formatMessage({ id: 'account.description' }),
                },
              ]}
            >
              <Input.TextArea
                placeholder={formatMessage({ id: 'account.description' })}
              />
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'account.address' })}
              name="address"
              rules={[
                {
                  message: formatMessage({ id: 'account.address' }),
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              style={{ width: '100%' }}
              label={formatMessage({ id: 'account.phone' })}
              name="contactPerson"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.required' }),
                },
                {
                  validator: validatorPhone,
                },
              ]}
            >
              <Input />
            </FormItem>
          </div>
          <div className={styles.right}>
            <div className={styles.avatar}>
              <FormItem
                label={formatMessage({ id: 'account.role' })}
                name="role"
                required={true}
                rules={[
                  {
                    message: formatMessage({ id: 'account.role' }),
                  },
                ]}
              >
                <Radio.Group
                  onChange={handleChangeRadio}
                  defaultValue={radioValue}
                >
                  <Radio disabled style={radioStyle} value={'CUSTOMER'}>
                    <Tag color="#7cb305">Customer</Tag>
                  </Radio>
                  <Radio style={radioStyle} value={'OPERATOR'}>
                    <Tag color="#1890ff">Operator</Tag>
                  </Radio>
                  <Radio disabled style={radioStyle} value={'ADMIN'}>
                    <Tag color="#f5222d">Administrator</Tag>
                  </Radio>
                </Radio.Group>
              </FormItem>
            </div>
          </div>
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div className={styles.button_view}>
          <Button onClick={handleCancel}>
            {formatMessage({ id: 'account.cancelBtn' })}
          </Button>
          <FormItem>
            <Button
              style={{ marginLeft: '8px' }}
              htmlType="submit"
              type="primary"
              onClick={handleSubmit}
            >
              {formatMessage({ id: 'account.createBtn' })}
            </Button>
          </FormItem>
        </div>
      </Form>
    </Fragment>
  )
}
export default Create
