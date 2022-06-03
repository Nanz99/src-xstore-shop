import React, { useEffect, useState, useMemo } from 'react'
import {
  Form,
  notification,
  message,
  Input,
  Dropdown,
  Button,
  Select,
  Upload,
  Row,
  Col,
  Card,
  Divider,
  InputNumber,
  Radio,
  Tabs,
  Avatar,
  Tag,
  Typography,
  Modal,
  Tooltip,
  Spin,
  Space,
} from 'antd'

import {
  createProductScreenShotService,
  createProductService,
  createSale,
  deleteProductService,
  editIsSale,
} from '@/services/product.service'
import {
  CheckCircleOutlined,
  FileImageOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
  ProfileOutlined,
  ProjectOutlined,
  CustomerServiceOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  SettingOutlined,
  DeleteOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { getLocale, useIntl } from 'umi'
// import GalleryForm from './product.gallery.page'
import 'jodit'
import 'jodit/build/jodit.min.css'
import JoditEditor from 'jodit-react'
import PriceInput from '@/components/PriceInput'
import { SALE_TYPE } from '@/utils/constants'
import { stubFalse } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { createService } from '@/services/service.service'

const config = {
  uploader: {
    insertImageAsBase64URI: false,
  },
  allowResizeX: false,
  allowResizeY: false,
  minWidth: 952,
  maxWidth: 952,
  width: 952,
}

const { TabPane } = Tabs
const { Title, Paragraph, Text } = Typography

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function CreateService(props) {
  const { currentUser, handleCancel, categoryList } = props
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const { formatMessage } = useIntl()
  const locale = getLocale()
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    },
  ])
  const [description, setDescription] = useState('')
  const [changeTab, setChangeTab] = useState('0')
  const [screenShot, setScreenShot] = useState([])
  const [loadingImageProduct, setLoadingImageProduct] = useState(false)
  const [imageProduct, setImageProduct] = useState({
    imageData: '',
    imageUrl: '',
  })

  const [visibleGalleryForm, setVisibleGalleryForm] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)

  const [priceSize, setPriceSize] = useState({})
  const listSize = ['Size S', 'Size M', 'Size L']

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  function dummyRequest({ file, onSuccess }) {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  function beforeUpload(file, fileList) {
    const allowTypes = ['image/jpeg', 'image/png']
    const isImage = allowTypes.includes(file.type)
    const isLessThan1M = file.size / 1024 / 1024 < 1

    if (!isImage) {
      fileList.pop()
      message.error(formatMessage({ id: 'product.cantUpload' }))
    }
    if (!isLessThan1M) {
      fileList.pop()
      message.error(formatMessage({ id: 'product.cantFitSizeUpload' }))
    }

    return isImage && isLessThan1M
  }

  const handleShowAddForm = () => {
    setVisibleGalleryForm(true)
  }

  const handleCancelGallery = () => {
    setVisibleGalleryForm(false)
  }

  const handleChangeTab = value => {
    setChangeTab(value)
  }

  const handleChangeImage = info => {
    if (info.file.status === 'uploading') {
      setLoadingImageProduct(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        setImageProduct({
          ...imageProduct,
          imageData: info.file.originFileObj,
          imageUrl: imageUrl,
        }),
          setLoadingImageProduct(false)
      })
    }
  }

  const handleChangeScreenShot = values => {
    let tempList = [...values.fileList]
    setScreenShot([...tempList])
  }

  const handleCreateSize = values => {}

  const handleCreateDescription = value => {
    setDescription(value)
  }
  // ====================================================


  const handleCreate = async values => {
    
    let newData = {}
    // create basic info
    if (!!imageProduct.imageData) {
      newData = {
        ...values,
        name: values.name || '',
        imageAvatar: imageProduct.imageData,
        listImages: screenShot || [],
        vnIntroduction: values.vnIntroduction || 'empty',
        introduction: values.introduction || 'empty',
        vnDescription: values.vnDescription || '',
        description: values.description || 'empty',
      }
    } else {
      newData = {
        ...values,
        name: values.name || '',
        listImages: screenShot || [],
        vnIntroduction: values.vnIntroduction || 'empty',
        introduction: values.introduction || 'empty',
        vnDescription: values.vnDescription || 'empty',
        description: values.description || 'empty',
      }
    }

    const res = await createService(newData)
       if (res?.success) {
   
      // create screenshot
      // if (screenShot.length > 0) {
      //   let isSuccessUpload = false
      //   const tempArray = [...screenShot]
      //   const editedScreenShotArray = tempArray.filter(item => !!item.thumbUrl)
      //   for (var i = 0; i < editedScreenShotArray.length; i++) {
      //     const newScreenShot = {
      //       name: editedScreenShotArray[i].originFileObj.name,
      //       order: 0,
      //       image: editedScreenShotArray[i].originFileObj,
      //     }
      //     const result = await createProductScreenShotService(
      //       res.data.id,
      //       newScreenShot,
      //     )
      //     if (result) {
      //       isSuccessUpload = true
      //     } else {
      //       isSuccessUpload = false
      //     }
      //     if (i == editedScreenShotArray.length) {
      //       await handleCancel()
      //     }
      //   }
      //   if (isSuccessUpload === false) {
      //     message.warning(
      //       formatMessage({ id: 'product.createSuccessFailScreenshot' }),
      //     )
      //   }
      // }
      message.success(formatMessage({ id: 'service.createSuccess' }))
      setLoadingForm(false)
      handleCancel()
      await window.location.reload()
    } else {
      message.warning(formatMessage({ id: 'service.createFailed' }))
    }
  
    setLoadingForm(false)
  }


  return (
    <>
      <Spin spinning={loadingForm}>
        <Form
          name="product-create-page"
          form={form}
          {...layout}
          onFinish={handleCreate}
          initialValues={{
            saleTag: { number: 0, currency: '%' },
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
          <CustomerServiceOutlined />  
                  {formatMessage({ id: 'service.service' })}
                </span>
              }
              key="1"
            >
              <Row>
                <Col span={12}>
                  {/* //Name */}
                  <FormItem
                    style={{ width: '98%' }}
                    label={formatMessage({ id: 'service.name' })}
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({ id: 'service.reqService' }),
                      },
                    ]}
                  >
                    <Input type="text" />
                  </FormItem>
                </Col>
                <Col span={12}>
                  {/* //Image */}
                  <FormItem
                    style={{ marginRight: '120px' }}
                    label={formatMessage({ id: 'product.image' })}
                  >
                    <Avatar
                      shape="square"
                      src={imageProduct.imageUrl}
                      size={144}
                      icon={<FileImageOutlined style={{ color: '#4754a4' }} />}
                    />
                    <Upload
                      name="image"
                      showUploadList={false}
                      className="avatar-uploader"
                      customRequest={dummyRequest}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeImage}
                      accept=".jpg,.jpeg,.png"
                      multiple={false}
                    >
                      <Button style={{ marginTop: '16px' }}>
                        <UploadOutlined /> Click to Upload
                      </Button>
                    </Upload>
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
           
            {/* Screenshot */}
            <TabPane
              tab={
                <span>
                  <PictureOutlined />
                  {formatMessage({ id: 'product.screenShot' })}
                </span>
              }
              key="2"
            >
              <Row>
                <Col span={24}>
                  {/* ScreenShot */}
                  <FormItem
                    noStyle
                    label={formatMessage({ id: 'product.screenShot' })}
                  >
                    <Upload
                      listType="picture-card"
                      className="avatar-uploader"
                      customRequest={dummyRequest}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeScreenShot}
                      multiple={true}
                    >
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ProfileOutlined />
                  {formatMessage({ id: 'product.introduction' })}
                </span>
              }
              key="3"
            >
              {/* Introduction */}
              <Row justify="space-between">
                <Col>
                  {/* <Button type="primary" ghost onClick={handleShowAddForm}>
                    {formatMessage({ id: 'product.gallery' })}&nbsp;
                    <Tooltip
                      title={formatMessage({ id: 'product.galleryTooltip' })}
                    >
                      <QuestionCircleOutlined style={{ fontSize: '14px' }} />{' '}
                    </Tooltip>
                  </Button> */}
                </Col>
                <Col>
                  <Radio.Group
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    defaultValue={changeTab}
                    value={changeTab}
                    onChange={evt => handleChangeTab(evt.target.value)}
                  >
                    <Radio value="0">
                      <Tag color="#d3241c">VI</Tag>
                    </Radio>
                    <Radio value="1">
                      <Tag color="#00247D">EN</Tag>
                    </Radio>
                  </Radio.Group>
                </Col>
              </Row>
              <Tabs
                key="introduction"
                activeKey={changeTab}
                size="small"
                style={{ marginBottom: 32 }}
              >
                <TabPane key="0">
                  <FormItem
                    name="vnIntroduction"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'product.reqIntroduction',
                        }),
                      },
                    ]}
                  >
                    <JoditEditor key="vnIntroduction" config={config} />
                  </FormItem>
                </TabPane>
                <TabPane key="1">
                  <FormItem
                    name="introduction"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'product.reqIntroduction',
                        }),
                      },
                    ]}
                  >
                    <JoditEditor key="introduction" config={config} />
                  </FormItem>
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ProjectOutlined />
                  {formatMessage({ id: 'product.description' })}
                </span>
              }
              key="4"
            >
              {/* description */}
              <Row justify="space-between">
                <Col>
                  {/* <Button type="primary" ghost onClick={handleShowAddForm}>
                    {formatMessage({ id: 'product.gallery' })}&nbsp;
                    <Tooltip
                      title={formatMessage({ id: 'product.galleryTooltip' })}
                    >
                      <QuestionCircleOutlined style={{ fontSize: '14px' }} />{' '}
                    </Tooltip>
                  </Button> */}
                </Col>
                <Col>
                  <Radio.Group
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    defaultValue={changeTab}
                    value={changeTab}
                    onChange={evt => handleChangeTab(evt.target.value)}
                  >
                    <Radio value="0">
                      <Tag color="#d3241c">VI</Tag>
                    </Radio>
                    <Radio value="1">
                      <Tag color="#00247D">EN</Tag>
                    </Radio>
                  </Radio.Group>
                </Col>
              </Row>
              <Tabs
                key="description"
                activeKey={changeTab}
                size="small"
                style={{ marginBottom: 32 }}
              >
                <TabPane key="0">
                  <FormItem
                    name="vnDescription"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'product.reqDescription',
                        }),
                      },
                    ]}
                  >
                    <JoditEditor key="vnDescription" config={config} />
                  </FormItem>
                </TabPane>
                <TabPane key="1">
                  <FormItem
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'product.reqDescription',
                        }),
                      },
                    ]}
                  >
                    <JoditEditor key="description" config={config} />
                  </FormItem>
                </TabPane>
              </Tabs>
            </TabPane>
       
          </Tabs>
        </Form>
      </Spin>
    </>
  )
}

export default CreateService
