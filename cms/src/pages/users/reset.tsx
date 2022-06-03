import React, { useState, useEffect } from 'react'
import {
  Dispatch,
  connect,
  useIntl,
  useParams,
  useLocation,
  useRouteMatch,
} from 'umi'
import { ConnectState } from '@/models/connect'
import classNames from 'classnames'
import { Form, Input, Button, Col, Row, Checkbox } from 'antd'
import { FormInstance } from 'antd/lib/form'

import styles from './styles.less'
import { LockTwoTone, MailTwoTone } from '@ant-design/icons'
import { Store } from 'antd/lib/form/interface'
import { getMe } from '@/services/users'

const FormItem = Form.Item

interface LoginProps {
  dispatch: Dispatch
  submitting?: boolean
  className?: string
  form?: FormInstance
}

const ForgotPassword: React.FC<LoginProps> = props => {
  const { className, submitting, dispatch } = props
  const { formatMessage } = useIntl()
  const location = useLocation()
  const [form] = Form.useForm()
  const clsString = classNames(styles.submit)

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

  const handleFinish = (values: Store) => {
    values.token = location.query.token
    dispatch({ type: 'user/resetPassword', payload: { ...values } })
  }

  return (
    <div>
      <div className={styles.main}>
        <div className={classNames(className, styles.login)}>
          <Row style={{ justifyContent: 'center' }}>
            <Col
              xs={{ span: 20 }}
              sm={{ span: 20 }}
              md={{ span: 20 }}
              lg={{ span: 20 }}
              xl={{ span: 20 }}
              xxl={{ span: 20 }}
            >
              <Form
                onFinish={handleFinish}
                form={form}
                initialValues={{ remember: true }}
              >
                <Form.Item
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'login.requirePass' }),
                    },
                    {
                      validator: validatorPassword,
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    className={styles.inputPassword}
                    placeholder={formatMessage({ id: 'login.newPassword' })}
                    size="middle"
                    prefix={
                      <LockTwoTone
                        twoToneColor="#bfbfbf"
                        className={styles.prefixIcon}
                      />
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="confirmNewPassword"
                  dependencies={['newPassword']}
                  rules={[
                    {
                      required: true,
                      message: formatMessage({
                        id: 'login.confirmNewPassword',
                      }),
                    },
                    {
                      validator: validatorConfirmPassword,
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    className={styles.inputPassword}
                    placeholder={formatMessage({
                      id: 'login.confirmNewPassword',
                    })}
                    size="middle"
                    prefix={
                      <LockTwoTone
                        twoToneColor="#bfbfbf"
                        className={styles.prefixIcon}
                      />
                    }
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    style={{ backgroundColor: '#223e7f' }}
                    className={clsString}
                    htmlType="submit"
                    type="primary"
                    size="middle"
                    loading={submitting}
                  >
                    {formatMessage({ id: 'login.send' })}
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default connect(({ loading, user }: ConnectState) => ({
  submitting: loading.effects['user/login'],
}))(ForgotPassword)
