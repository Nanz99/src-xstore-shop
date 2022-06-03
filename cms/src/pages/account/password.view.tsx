import { putUserChangePasswordService } from '@/services/account.service'
import { Button, Form, Input, message } from 'antd'
import React, { useState, useEffect } from 'react'
import { useIntl } from 'umi'
import styles from './style.less'

const Password = props => {
  const { currentUser } = props
  const { formatMessage } = useIntl()
  const [form] = Form.useForm()

  const validatorPassword = (rule, value, callback) => {
    if (value.length > 0 && value.length < 8) {
      callback(formatMessage({ id: 'account.passwordWeak' }))
    }
    callback()
  }

  const validatorConfirmPassword = (rule, value, callback) => {
    const password = form.getFieldValue('newPassword')
    if (!value || password === value) {
      callback()
    }
    callback(formatMessage({ id: 'account.passwordNotMatch' }))
  }

  const handleSubmit = async values => {
    const res = await putUserChangePasswordService(values)
    if (res.message) {
      message.error(formatMessage({ id: 'account.changePasswordError' }))
    } else {
      message.success(formatMessage({ id: 'account.changePasswordSuccess' }))
    }
  }

  return (
    <div className={styles.passwordView}>
      <Form
        layout="vertical"
        form={form}
        name="password-view"
        onFinish={handleSubmit}
        scrollToFirstError
      >
        <Form.Item
          name="currentPassword"
          label={formatMessage({ id: 'account.currentPassword' })}
          style={{ width: '36%' }}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={formatMessage({ id: 'account.password' })}
          style={{ width: '36%' }}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              validator: validatorPassword,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label={formatMessage({ id: 'account.confirmPassword' })}
          style={{ width: '36%' }}
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            {
              validator: validatorConfirmPassword,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {formatMessage({ id: 'account.change' })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default Password
