import React, { useState, useEffect } from 'react'
import { Dispatch, connect, useIntl } from 'umi'
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
  const { className, submitting, form, dispatch } = props
  const { formatMessage } = useIntl()
  const clsString = classNames(styles.submit)

  const handleFinish = (values: Store) => {
    dispatch({ type: 'user/sendEmail', payload: { ...values } })
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
                <FormItem
                  name="email"
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'login.requireEmail' }),
                    },
                  ]}
                >
                  <Input
                    className={styles.inputEmail}
                    placeholder="Email"
                    size="middle"
                    prefix={
                      <MailTwoTone
                        twoToneColor="#bfbfbf"
                        className={styles.prefixIcon}
                      />
                    }
                  />
                </FormItem>
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
      <Row justify="center">
        <Col span={24} className={styles.powerBy}>
          Powered by Digitech Solution
        </Col>
      </Row>
    </div>
  )
}

export default connect(({ loading, user }: ConnectState) => ({
  submitting: loading.effects['user/login'],
}))(ForgotPassword)
