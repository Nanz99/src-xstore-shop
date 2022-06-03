import React, { useState, useEffect, Fragment, useMemo } from 'react'
import {
  Form,
  Input,
  Upload,
  Select,
  Button,
  Cascader,
  Radio,
  Avatar,
  message,
  Tag,
  Space,
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
import { getDetailAccount } from '@/services/account.service'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'
import { residences } from '@/utils/utils'
import { putUserProfileService } from '@/services/account.service'

const FormItem = Form.Item
const { Option } = Select

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
  paddingLeft: '30px',
}

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt3M = file.size / 1024 / 1024 < 3
  if (!isLt3M) {
    message.error('Image must smaller than 3MB!')
  }
  return isJpgOrPng && isLt3M
}

const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value
  if (!province.key) {
    callback('Please input your province!')
  }
  if (!city.key) {
    callback('Please input your city!')
  }
  callback()
}

const Info = props => {
  const { currentUser, fetchCurrentUser } = props
  const [form] = Form.useForm()
  const { formatMessage } = useIntl()
  const [infoValue, setInfoValue] = useState({})
  const [avatar, setAvatar] = useState({
    imageData: '',
    imageUrl: '',
  })
  const [loadingAvatar, setLoadingAvatar] = useState(false)
  const [radioValue, setRadioValue] = useState('CUSTOMER')
  //const [cascaderValue, setCascaderValue] = useState(['', ''])

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

  const validatorPhone = (rule, value, callback) => {
    if (isNaN(value) || value.length > 10) {
      callback(formatMessage({ id: 'account.phoneWrong' }))
    }
    callback()
  }

  const handleChangeAvatar = info => {
    if (info.file.status === 'uploading') {
      setLoadingAvatar(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        setAvatar({
          ...avatar,
          imageData: info.file.originFileObj,
          imageUrl: imageUrl,
        }),
          setLoadingAvatar(false)
      })
    }
  }

  const handleSubmit = async values => {
    let tempValues = {}
    let res = {}
    if (!avatar.imageData) {
      tempValues = {
        ...values,
        fullName: '',
      }
      res = await putUserProfileService(tempValues)
    } else {
      tempValues = {
        ...values,
        fullName: '',
      }
      res = await putUserProfileService(tempValues)
      tempValues = {
        image: avatar.imageData,
        fullName: '',
      }
      res = await putUserProfileService(tempValues)
    }
    if (res.success) {
      message.success(formatMessage({ id: 'account.updateInfoSuccess' }))
      fetchCurrentUser()
    } else {
      message.error(formatMessage({ id: 'account.updateInfoFailed' }))
      fetchCurrentUser()
    }
  }

  const getInfo = () => {
    const res = { ...currentUser }
    //const newCascader = [...cascaderValue]
    if (res) {
      setInfoValue({
        ...res,
      })
      setRadioValue(res.role)
      //newCascader[0] = res.country
      //newCascader[1] = res.city
      //setCascaderValue([...newCascader])
      setAvatar({
        ...avatar,
        imageUrl: res.avatarUrl,
      })
      form.setFieldsValue({ ...res })
    } else {
      console.log('loading data')
    }
  }

  useMemo(() => {
    getInfo()
  }, [currentUser])

  return (
    <Fragment>
      <div className={styles.baseView}>
        <div className={styles.left}>
          <Form
            name="info-view"
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <FormItem
              label={formatMessage({ id: 'account.email' })}
              name="email"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.required' }),
                },
                {
                  validator: validatorEmail,
                },
              ]}
            >
              <Input />
            </FormItem>
            <Space
              style={{ display: 'flex', marginBottom: 8 }}
              align="baseline"
            >
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
            </Space>
            <FormItem
              label={formatMessage({ id: 'account.phone' })}
              name="phone"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.required' }),
                },
                { validator: validatorPhone },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'account.description' })}
              name="description"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.required' }),
                },
              ]}
            >
              <Input.TextArea
                placeholder={formatMessage({ id: 'account.description' })}
                rows={4}
              />
            </FormItem>
            {/* <FormItem
              label={formatMessage({ id: 'account.role' })}
              name="role"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.required' }),
                },
              ]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value="CUSTOMER">
                  <Tag color="#7cb305">Customer</Tag>
                </Radio>
                <Radio style={radioStyle} value="OPERATOR">
                  <Tag color="#1890ff">Operator</Tag>
                </Radio>
                <Radio style={radioStyle} value="ADMIN">
                  <Tag color="#f5222d">Administrator</Tag>
                </Radio>
              </Radio.Group>
            </FormItem> */}
            {/* <FormItem
              label={`${formatMessage({ id: 'account.country' })}/${formatMessage({ id: 'account.city' })}`}
            >
              { cascaderValue[0] !== null && cascaderValue[1] !== null 
                ? cascaderValue[0].length > 0 && cascaderValue[1].length > 0
                ? <Cascader defaultValue={[...cascaderValue]} options={residences} onChange={handleChangeCascader}/>
                : <Cascader defaultValue={['Country','City']} options={residences} onChange={handleChangeCascader}/>
                : <Cascader defaultValue={['Country','City']} options={residences} onChange={handleChangeCascader}/>
              }
            </FormItem> */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item
                label={formatMessage({ id: 'account.city' })}
                name="city"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'account.city' }),
                  },
                ]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              >
                <Input placeholder={formatMessage({ id: 'account.city' })} />
              </Form.Item>
              <Form.Item
                label={formatMessage({ id: 'account.country' })}
                name="country"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'account.address' }),
                  },
                ]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50% - 8px)',
                  margin: '0 8px',
                }}
              >
                <Input placeholder={formatMessage({ id: 'account.country' })} />
              </Form.Item>
            </Form.Item>
            <FormItem
              label={formatMessage({ id: 'account.address' })}
              name="address"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'account.address' }),
                },
              ]}
            >
              <Input />
            </FormItem>
            <Button form="info-view" htmlType="submit" type="primary">
              {formatMessage({ id: 'account.update' })}
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <div className={styles.avatar_title}>
            {formatMessage({ id: 'account.avatar' })}
          </div>
          <div className={styles.avatar}>
            <Avatar
              src={avatar.imageUrl}
              size={144}
              icon={<UserOutlined style={{ color: '#4754a4' }} />}
            />
          </div>
          <Upload
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChangeAvatar}
          >
            <div className={styles.button_view}>
              <Button icon={<UploadOutlined />}>
                {formatMessage({ id: 'account.changeAvatar' })}
              </Button>
            </div>
          </Upload>
        </div>
      </div>
    </Fragment>
  )
}
export default Info
