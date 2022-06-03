import {
  createProductGalleryService,
  deleteGalleryService,
  getDetailProductService,
} from '@/services/product.service'
import {
  CheckCircleOutlined,
  CopyOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
  Tabs,
  Typography,
  Upload,
} from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { formatMessage } from 'umi'
import './product.css'

const { TabPane } = Tabs
const { Title, Paragraph, Text } = Typography

const Gallery = props => {
  const { idProduct, handleCancelGallery } = props
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const [screenShot, setScreenShot] = useState({ fileList: [] })
  const [screenShotFile, setScreenShotFile] = useState({})
  const [loadingScreenshot, setLoadingScreenshot] = useState(false)
  const [isRemove, setIsRemove] = useState(false)
  const [loadOneTime, setLoadOneTime] = useState(false)
  const [isCopyText, setIsCopyText] = useState(false)

  const toggleCopyText = () => {
    setIsCopyText(!isCopyText)
  }

  const inputRef = useRef(null)

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const loadingButton = (
    <div>
      <LoadingOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const replaceScreenshotData = values => {
    const tempScreenShot = values?.map(item => ({
      uid: item.id,
      name: item.name,
      status: 'done',
      url: item.mediaUrl,
    }))
    setScreenShot({ fileList: tempScreenShot })
  }

  const handleSetCopyInput = values => {
    if (values) form.setFieldsValue({ copyInput: values })
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  const beforeUpload = (file, fileList) => {
    const allowTypes = ['image/jpeg', 'image/png']
    const isImage = allowTypes.includes(file.type)
    const isLessThan2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
      fileList.pop()
      message.error(formatMessage({ id: 'product.cantUpload' }))
    }
    if (!isLessThan2M) {
      fileList.pop()
      message.error(formatMessage({ id: 'product.cantFitSizeUpload2M' }))
    }
    return isImage && isLessThan2M
  }

  const handleChangeScreenShot = ({ file, fileList }) => {
    setLoadingScreenshot(true)
    setScreenShotFile({ ...file })
    setLoadOneTime(true)
    //setScreenShot({ fileList: [...fileList] })
  }

  const handleEdit = async () => {
    // edit screenshot start
    if (!isRemove) {
      if (screenShotFile) {
        const newFile = {
          name: screenShotFile.originFileObj.name,
          order: 0,
          image: screenShotFile.originFileObj,
        }
        const result = await createProductGalleryService(idProduct, newFile)
        if (result) {
          await fetch()
          setLoadingScreenshot(false)
          setLoadOneTime(false)
          notification.success({
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            message: formatMessage({ id: 'product.addScreenShotSuccess' }),
          })
        } else {
          await fetch()
          setLoadingScreenshot(false)
          setLoadOneTime(false)
          notification.warning({
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            message: formatMessage({ id: 'product.addScreenShotFailed' }),
          })
        }
      }
    } else {
      setLoadingScreenshot(false)
      setLoadOneTime(false)
      setIsRemove(false)
    }
  }

  const handleRemoveScreenShot = async file => {
    setIsRemove(true)
    if (!file.thumbUrl) {
      try {
        const { success } = await deleteGalleryService(file.uid)
        if (success) {
          await fetch()
          setLoadingScreenshot(false)
          notification.success({
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            message: formatMessage({ id: 'product.deleteSuccess' }),
          })
        } else {
          await fetch()
          setLoadingScreenshot(false)
          notification.error({
            icon: <CheckCircleOutlined style={{ color: 'red' }} />,
            message: formatMessage({ id: 'product.deleteFailed' }),
          })
        }
      } catch (error) {
        return error
      }
    } else {
      notification.error({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'product.deleteFailed' }),
      })
    }
  }

  const fetch = async () => {
    const res = await getDetailProductService(idProduct)
    if (!res.success) {
      message.error('Whoop! no data')
      handleCancelGallery()
      setLoadingScreenshot(false)
    } else {
      replaceScreenshotData(res.galleries)
      setLoadingScreenshot(false)
    }
  }

  useMemo(() => {
    fetch()
    form.resetFields()
  }, [handleCancelGallery])

  useMemo(() => {
    // setOneTime to handChangeScreenShot execute one time
    if (loadingScreenshot && loadOneTime) {
      handleEdit()
    }
  }, [loadOneTime])
  

  useMemo(() => {
    if (isCopyText) {
      inputRef.current.select()
      document.execCommand('copy')
      message.info(formatMessage({ id: 'product.copyToClipboard' }))
    }
  }, [isCopyText])

  useMemo(() => {
    if (loadingScreenshot) {
      handleEdit()
    }
  }, [isRemove])

  return (
    <>
      <Form name="product-gallery-page" form={form}>
        <Row>
          <Col span={24}>
            {/* //ScreenShot */}
            <FormItem
              noStyle
              label={formatMessage({ id: 'product.screenShot' })}
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                disabled={loadingScreenshot}
                onChange={handleChangeScreenShot}
                fileList={screenShot.fileList}
                onRemove={handleRemoveScreenShot}
                multiple={false}
                itemRender={(originNode, file, currFileList) => {
                  return (
                    <a
                      style={{ width: '100%', height: '100px' }}
                      onClick={() => {
                        handleSetCopyInput(file.url)
                      }}
                    >
                      {originNode}
                    </a>
                  )
                }}
              >
                {loadingScreenshot == true ? loadingButton : uploadButton}
              </Upload>
            </FormItem>
            <FormItem name="copyInput" style={{ marginTop: '16px' }}>
              <Input
                ref={inputRef}
                placeholder={formatMessage({ id: 'product.getLink' })}
                addonAfter={
                  <Button
                    size="small"
                    type="link"
                    icon={<CopyOutlined />}
                    onClick={toggleCopyText}
                  />
                }
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </>
  )
}
export default Gallery
