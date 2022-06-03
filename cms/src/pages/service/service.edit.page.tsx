import PriceInput from '@/components/PriceInput'
import {
  createProductScreenShotService,
  createSale,
  deleteScreenShotService,
  editIsSale,
  editProductService,
} from '@/services/product.service'
import { SALE_TYPE } from '@/utils/constants'
import {
  CheckCircleOutlined,
  FileImageOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
  ProfileOutlined,
  ProjectOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TagsOutlined,
  UploadOutlined,
  DeleteOutlined,
  DollarOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  Upload,
  Space,
} from 'antd'
import JoditEditor from 'jodit-react'
import React, { useEffect, useMemo, useState } from 'react'
import { getLocale, history, useIntl } from 'umi'
import './service.css'
// import GalleryForm from './product.gallery.page'
import numeral from 'numeral'
import { deleteGalleryImageService } from '@/services/service.service'
import { editService } from '../../services/service.service'
//==================================================================

const { TabPane } = Tabs

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('Image must smaller than 10MB!')
  }
  return isJpgOrPng && isLt10M
}

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

const EditService = props => {
  const {
    detailProduct,
    idProduct,
    handleCancel,
    listCategory,
    imageFile,
    screenShotFile,
  } = props
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const { formatMessage } = useIntl()
  const locale = getLocale()
  const [fileList, setFileList] = useState([...imageFile])
  const [screenShot, setScreenShot] = useState([])
  const [changeTab, setChangeTab] = useState('0')
  const [loadingImageProduct, setLoadingImageProduct] = useState(false)
  const [imageProduct, setImageProduct] = useState({
    imageData: '',
    imageUrl: imageFile?.[0]?.url,
  })
  let countField = 0
  const [visibleGalleryForm, setVisibleGalleryForm] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
  console.log(
    '🚀 ~ file: Edit.page.tsx ~ line 100 ~ detailProduct',
    detailProduct,
  )
   
  const checkPrice = (rule, value) => {
    if (value.number > 0) {
      return Promise.resolve()
    }
    return Promise.reject('Price must be greater than zero!')
  }
  const [number, setNumber] = useState(0)
  const [currency, setCurrency] = useState('percent')

  const config = {
    allowResizeX: false,
    allowResizeY: false,
    minWidth: 952,
    maxWidth: 952,
    width: 952,
  }

  const fetch = () => {
    const newData = { ...detailProduct }
   
    form.setFieldsValue({ ...newData })
    setScreenShot(detailProduct.galleries)
  }

  useMemo(() => {
    fetch()
  }, [idProduct, handleCancel])

  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  }
  const tailLayout = {
    wrapperCol: { offset: 0, span: 20 },
  }

  const handleCancelGallery = () => {
    setVisibleGalleryForm(false)
  }

  const handleEdit = async res => {
    setLoadingForm(true)
    // check fields exist in res
    var fields = [
      'vnIntroduction',
      'introduction',
      'vnDescription',
      'description',
    ]
    let newData = {}
    for (const property in fields) {
      if (res.hasOwnProperty(fields[property]) === false) {
        res[fields[property]] = detailProduct[fields[property]]
      }
    }
   
    if (!imageProduct.imageData) {
      newData = {
        ...res,
        name: res?.name,
        listImages: screenShot || [],
        vnIntroduction: res.vnIntroduction || 'empty',
        introduction: res.introduction || 'empty',
        vnDescription: res.vnDescription || 'empty',
        description: res.description || 'empty',
      }
    } else {
      newData = {
        ...res,
        name: res?.name,
        imageAvatar: imageProduct.imageData,
        listImages: screenShot || [],
        vnIntroduction: res.vnIntroduction || 'empty',
        introduction: res.introduction || 'empty',
        vnDescription: res.vnDescription || 'empty',
        description: res.description || 'empty',
      }
    }

    const { success } = await editService(idProduct, newData)
    //edit sale start

 
    // edit screenshot start
    if (success) {
   //    const tempArray = [...screenShot]
   //    const editedScreenShotArray = tempArray.filter(item => !!item.thumbUrl)
   //    for (var i = 0; i < editedScreenShotArray.length; i++) {
   //      const newScreenShot = {
   //        name: editedScreenShotArray[i].originFileObj.name,
   //        order: 0,
   //        image: editedScreenShotArray[i].originFileObj,
   //      }
   //      const result = await createProductScreenShotService(
   //        idProduct,
   //        newScreenShot,
   //      )
   //      if (result) {
   //        notification.success({
   //          icon: <CheckCircleOutlined style={{ color: 'green' }} />,
   //          message: formatMessage({ id: 'product.addScreenShotSuccess' }),
   //        })
   //      } else {
   //        notification.warning({
   //          icon: <CheckCircleOutlined style={{ color: 'green' }} />,
   //          message: formatMessage({ id: 'product.addScreenShotFailed' }),
   //        })
   //      }
   //      if (i == editedScreenShotArray.length) {
   //        await handleCancel()
   //      }
   //    }
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'service.editSuccess' }),
      })
    } else {
      notification.warning({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'service.editFailed' }),
      })
    }
    setLoadingForm(false)
    // history.go(`/product/${idProduct}`)
    await handleCancel()
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

  const handleChangeScreenShot = info => {
    let newList = [...info.fileList]
    setScreenShot([...newList])
  }

  const handleChangeTab = value => {
    setChangeTab(value)
  }

  const handleShowAddForm = () => {
    setVisibleGalleryForm(true)
  }

  const handleRemoveScreenShot = async file => {
    if (!file.thumbUrl) {
      try {
        const { success } = await deleteGalleryImageService(file.uid)
        if (success) {
          notification.success({
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            message: formatMessage({ id: 'product.deleteSuccess' }),
          })
        } else {
          notification.success({
            icon: <CheckCircleOutlined style={{ color: 'red' }} />,
            message: formatMessage({ id: 'product.deleteFailed' }),
          })
        }
      } catch (error) {
        return error
      }
    } else {
    }
  }
  

  return (
    <>
      <Spin spinning={loadingForm}>
        <Form
          name="product-edit-page"
          form={form}
          {...layout}
          onFinish={handleEdit}
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
                      defaultFileList={[...screenShotFile]}
                      onRemove={handleRemoveScreenShot}
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
          {/* <Modal
            maskClosable={false}
            visible={visibleGalleryForm}
            title={formatMessage({ id: 'product.gallery' })}
            centered={true}
            onCancel={handleCancelGallery}
            width={608}
            footer={false}
          >
            <GalleryForm
              detailProduct={detailProduct}
              idProduct={idProduct}
              handleCancelGallery={handleCancelGallery}
              screenShotFile={screenShotFile}
            />
          </Modal> */}
        </Form>
      </Spin>
    </>
  )
}
export default EditService
