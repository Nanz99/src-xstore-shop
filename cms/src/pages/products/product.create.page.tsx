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
  getAllColor,
  getAllSize,
} from '@/services/product.service'
import {
  CheckCircleOutlined,
  FileImageOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
  ProfileOutlined,
  ProjectOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  SettingOutlined,
  DeleteOutlined,
  TagsOutlined,
  BgColorsOutlined,
} from '@ant-design/icons'
import { getLocale, useIntl, connect, useLocation } from 'umi'
// import GalleryForm from './product.gallery.page'
import GalleryForm from './product.gallery.page'
import 'jodit'
import 'jodit/build/jodit.min.css'
import JoditEditor from 'jodit-react'
import PriceInput from '@/components/PriceInput'
import { SALE_TYPE } from '@/utils/constants'
import { stubFalse } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { ConnectState } from '@/models/connect';
import uniqid from 'uniqid'


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
class Params {
  page: number = 1
  limit: number = 10
  name?: string
  verified?: boolean
  status?: number
  sortByPrice?: string
  sortByDate?: string
  condition?: string
}
function CreateProduct(props) {
  const { currentUser, handleCancel, categoryList, listSizes, listColors, dispatch } = props
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const { formatMessage } = useIntl()

  const locale = getLocale()
  const { pathname } = useLocation()
  const [params, setParams] = useState(new Params())
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
  // const [listColor, setListColor] = useState([])
  // const [listSize, setListSize] = useState([])

  
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }


  const fetch = () => {

    dispatch({ type: 'products/getAllSize', payload: params })
    dispatch({ type: 'products/getAllColor', payload: params })
  }

  useMemo(() => {
    fetch()
  }, [params, pathname])


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

  const handleCreateSize = values => { }

  const handleCreateDescription = value => {
    setDescription(value)
  }
  // ====================================================

  const handleDeleteItem = value => {
    //  if (
    //    unitPrice.length > 1 &&
    //    totalProduct.length > 1
    //  ) {
    //    // delete one item in array when click delete item
    //    const tempQuantity = [...quantity]
    //    tempQuantity.splice(value, 1)
    //    setQuantity(tempQuantity)
    //    const tempUnitPrice = [...unitPrice]
    //    tempUnitPrice.splice(value, 1)
    //    setUnitPrice(tempUnitPrice)
    //    const tempSubTotal = [...totalProduct]
    //    tempSubTotal.splice(value, 1)
    //    setTotalProduct(tempSubTotal)
    //  } else {
    //    // reset number fields when array product is empty
    //    form.resetFields(['subTotal', 'grandTotal', 'shippingPrice'])
    //  }
  }

  const handleCreate = async values => {
    setLoadingForm(true)
    let tempProperties = values?.propertiesProduct
      ?.map((value, index) => ({
        colorId: value.colorId,
        sizeId: value.sizeId,
        purchasePrice: null,
        dealerPrice: null,
        retailPrice: null,
        SKU: uniqid(),
        weight: Number(value?.weight),
      }))
      ?.sort((a, b) => a.sizeId - b.sizeId)

    if (tempProperties?.length === 0) {
      message.warning(
        formatMessage({
          id: 'product.reqSizeAndColor',
        }),
      )
    }
 
    let newData = {}
    // create basic info
    if (!!imageProduct.imageData) {
      newData = {
        ...values,
        name: values.name || '',
        image: imageProduct.imageData,
        vnIntroduction: values.vnIntroduction || 'empty',
        introduction: values.introduction || 'empty',
        vnDescription: values.vnDescription || 'empty',
        description: values.description || 'empty',
        vnSpecifications: 'empty',
        specifications: 'empty',
        providerName: values.providerName || 'empty',
        price: Number(values?.price) || 0,
        dealerPrice: Number(values?.dealerPrice) || 0,
        categorieId: values?.categories || undefined,
        sale_ok: 'testing',
        purchase_ok: 'testing',
        default_code: 'testing',
        type: 'consumer',
        invoice_policy: 'order',
        propertiesProduct: tempProperties,
      }
    } else {
      newData = {
        ...values,
        name: values.name || '',
        vnIntroduction: values.vnIntroduction || 'empty',
        introduction: values.introduction || 'empty',
        vnDescription: values.vnDescription || 'empty',
        description: values.description || 'empty',
        vnSpecifications: 'empty',
        specifications: 'empty',
        providerName: values.providerName || 'empty',
        price: Number(values?.price) || 0,
        dealerPrice: Number(values?.dealerPrice) || 0,
        categorieId: values?.categories || undefined,
        sale_ok: 'testing',
        purchase_ok: 'testing',
        default_code: 'testing',
        type: 'consumer',
        invoice_policy: 'order',
        propertiesProduct: tempProperties,
      }
    }
    const res = await createProductService(newData)

    if (res && res?.data && res?.data?.id) {
      // create sale
      if (values.saleTag) {
        let sales = {}
        let tempIsSale = {}
        if (
          values.saleTag.currency === 'percent' ||
          values.saleTag.currency === '%'
        ) {
          if (values.saleTag.number > 100) {
            message.warning(formatMessage({ id: 'product.overloadSaleoff' }))
          } else {
            if (values.saleTag.number > 0) {
              // create sale
              sales = {
                productId: Number(res.data.id),
                type: SALE_TYPE.PERCENT,
                saleByPercent: values.saleTag.number || 0,
                saleByPrice: 0,
                description: values.descriptionPrice || '',
              }
              await createSale(sales)

              // isSale flag
              tempIsSale = {
                isSale: true,
              }
              await editIsSale(res.data.id, tempIsSale)
            } else {
              // isSale flag
              tempIsSale = {
                isSale: false,
              }
              await editIsSale(res.data.id, tempIsSale)
            }
          }
        } else {
          if (values.saleTag.number <= res.data.price) {
            sales = {
              productId: Number(res.data.id),
              type: SALE_TYPE.NUMBER,
              saleByPrice: values.saleTag.number || 0,
              description: values.descriptionPrice || '',
            }
            if (values.saleTag.number === 0) {
              // isSale flag
              tempIsSale = {
                isSale: false,
              }
              await editIsSale(res.data.id, tempIsSale)
            } else {
              // create sale
              sales = {
                productId: Number(res.data.id),
                type: SALE_TYPE.NUMBER,
                saleByPrice: values.saleTag.number,
                description: values.descriptionPrice,
              }
              await createSale(sales)

              // isSale flag
              tempIsSale = {
                isSale: true,
              }
              await editIsSale(res.data.id, tempIsSale)
            }
          } else {
            message.warning(formatMessage({ id: 'product.overloadSaleoff' }))
          }
        }
      } else {
        // message.error(formatMessage({ id: 'product.errorCreateSaleoff' }))
      }

      // create screenshot
      if (screenShot.length > 0) {
        let isSuccessUpload = false
        const tempArray = [...screenShot]
        const editedScreenShotArray = tempArray.filter(item => !!item.thumbUrl)
        for (var i = 0; i < editedScreenShotArray.length; i++) {
          const newScreenShot = {
            name: editedScreenShotArray[i].originFileObj.name,
            order: 0,
            image: editedScreenShotArray[i].originFileObj,
          }
          const result = await createProductScreenShotService(
            res.data.id,
            newScreenShot,
          )
          if (result) {
            isSuccessUpload = true
          } else {
            isSuccessUpload = false
          }
          if (i == editedScreenShotArray.length) {
            await handleCancel()
          }
        }
        if (isSuccessUpload === false) {
          message.warning(
            formatMessage({ id: 'product.createSuccessFailScreenshot' }),
          )
        }
      }
      message.success(formatMessage({ id: 'product.createSuccess' }))
      setLoadingForm(false)
      handleCancel()
      await window.location.reload()
    } else {
      message.warning(formatMessage({ id: 'product.createFailed' }))
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
                  <InboxOutlined />
                  {formatMessage({ id: 'product.product' })}
                </span>
              }
              key="1"
            >
              <Row>
                <Col span={12}>
                  {/* //Name */}
                  <FormItem
                    style={{ width: '98%' }}
                    label={formatMessage({ id: 'product.name' })}
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({ id: 'product.reqProduct' }),
                      },
                    ]}
                  >
                    <Input type="text" />
                  </FormItem>
                  {/* Providername */}
                  <FormItem
                    style={{ width: '98%' }}
                    label={formatMessage({ id: 'product.providerName' })}
                    name="providerName"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'product.reqProviderNam',
                        }),
                      },
                    ]}
                  >
                    <Input type="text" />
                  </FormItem>
                  {/* Catagory */}
                  <FormItem
                    style={{ width: '98%' }}
                    label={formatMessage({ id: 'product.category' })}
                    name="categories"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({ id: 'product.reqCategory' }),
                      },
                    ]}
                  >
                    {/* <Input type='text'/> */}
                    <Select>
                      {!categoryList
                        ? ''
                        : categoryList.map(values => (
                          <Select.Option value={values.id}>
                            {locale === 'en-US'
                              ? values.enName
                              : values.vnName}
                          </Select.Option>
                        ))}
                    </Select>
                  </FormItem>
                  {/* Price */}
                  <FormItem
                    style={{ width: '98%' }}
                    label={formatMessage({ id: 'product.retailPrice' })}
                    name="price"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'product.reqRetailPrice',
                        }),
                      },
                    ]}
                  >
                    <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                  </FormItem>
                  <FormItem
                    style={{ width: '98%' }}
                    label={formatMessage({ id: 'product.dealerPrice' })}
                    name="dealerPrice"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'product.reqDealerPrice',
                        }),
                      },
                    ]}
                  >
                    <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
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
            {/* Size and Color and Weight*/}
            <TabPane
              tab={
                <span>
                  <BgColorsOutlined />
                  {formatMessage({ id: 'product.sizeAndColorAndWeight' })}
                </span>
              }
              key="7"
            >
              <Row justify="space-between">
                <Col span={24}>
                  <Form.List name="propertiesProduct">
                    {(fields, { add, remove }) => {
                      return (
                        <div>
                          {fields.map((field, index) => {
                            return (
                              <Space key={field.key} align="start">
                                <Form.Item
                                  {...field}
                                  style={{ width: '300px' }}
                                  label={formatMessage({
                                    id: 'product.size',
                                  })}
                                  name={[field.name, 'sizeId']}
                                  fieldKey={[field.fieldKey, 'sizeId']}
                                  required
                                  rules={[
                                    {
                                      required: true,
                                      message: formatMessage({
                                        id: 'stockin.required',
                                      }),
                                    },
                                  ]}
                                >
                                  <Select
                                    size="small"
                                  >
                                    {(listSizes || []).map((item, index) => (
                                      <Select.Option
                                        key={index}
                                        value={item.id}
                                      >
                                        {item.size}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                {/* Color */}
                                <Form.Item
                                  {...field}
                                  style={{ width: '300px' }}
                                  label={formatMessage({
                                    id: 'product.color',
                                  })}
                                  name={[field.name, 'colorId']}
                                  fieldKey={[field.fieldKey, 'colorId']}
                                  required
                                  rules={[
                                    {
                                      required: true,
                                      message: formatMessage({
                                        id: 'stockin.required',
                                      }),
                                    },
                                  ]}
                                >
                                  <Select
                                    size="small"
                                  >
                                    {(listColors || []).map((item, index) => (
                                      <Select.Option
                                        key={index}
                                        value={item.id}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          {formatMessage({ id: 'product.colorName' })}
                                          <span style={{ height: '20px', width: '20px', display: 'inline-block', backgroundColor: `${item?.color}`, borderRadius: '4px', border: '1px solid #dedede', marginLeft: '8px' }}></span>
                                        </div>

                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  style={{ width: '350px' }}
                                  label={formatMessage({
                                    id: 'product.weightG',
                                  })}
                                  name={[field.name, 'weight']}
                                  fieldKey={[field.fieldKey, 'weight']}
                                  required
                                  rules={[
                                    {
                                      required: true,
                                      message: formatMessage({
                                        id: 'stockin.required',
                                      }),
                                    },
                                  ]}
                                >
                                  
                                  <InputNumber style={{width:'100px'}} min={0} />
                              
                                </Form.Item>

                        
                                <Form.Item {...field}>
                                  <Button
                                    danger
                                    size="small"
                                    type="link"
                                    onClick={() => {
                                      remove(field.name)
                                    }}
                                    icon={<DeleteOutlined />}
                                  ></Button>
                                </Form.Item>
                              </Space>
                            )
                          })}
                          <Form.Item>
                            <Button

                              size="small"
                              type="dashed"
                              onClick={() => {
                                add()
                              }}
                              block
                            >
                              <PlusOutlined />{' '}
                              {formatMessage({
                                id: 'product.productAddSizeAndColorAndWeight',
                              })}
                            </Button>
                          </Form.Item>
                        </div>
                      )
                    }}
                  </Form.List>
                </Col>
              </Row>
            </TabPane>
            {/* giảm giá */}
            <TabPane
              tab={
                <span>
                  <TagsOutlined />
                  {formatMessage({ id: 'product.sale' })}
                </span>
              }
              key="6"
            >
              <Row>
                <Col span={12}>

                  <FormItem
                    style={{ width: '99%' }}
                    label={formatMessage({ id: 'product.saleTag' })}
                    name="saleTag"
                  >
                    <PriceInput />
                  </FormItem>
                  <FormItem
                    style={{ width: '97%' }}
                    label={formatMessage({ id: 'product.description' })}
                    name="descriptionPrice"
                  >
                    <Input.TextArea />
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            {/* Hinh */}
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
            {/* Introduction */}
            <TabPane
              tab={
                <span>
                  <ProfileOutlined />
                  {formatMessage({ id: 'product.introduction' })}
                </span>
              }
              key="3"
            >

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
            {/* description */}
            <TabPane
              tab={
                <span>
                  <ProjectOutlined />
                  {formatMessage({ id: 'product.description' })}
                </span>
              }
              key="4"
            >

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
            {/* specifications */}
            {/* <TabPane
              tab={
                <span>
                  <SettingOutlined />
                  {formatMessage({ id: 'product.specifications' })}
                </span>
              }
              key="5"
            >
             
              <Row justify="space-between">
                <Col>
                
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
                key="specifications"
                activeKey={changeTab}
                size="small"
                style={{ marginBottom: 32 }}
              >
                <TabPane key="0">
                  <FormItem
                    name="vnSpecifications"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'product.reqSpecifications',
                        }),
                      },
                    ]}
                  >
                    <JoditEditor key="vnSpecifications" config={config} />
                  </FormItem>
                </TabPane>
                <TabPane key="1">
                  <FormItem
                    name="specifications"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'product.reqSpecifications',
                        }),
                      },
                    ]}
                  >
                    <JoditEditor key="specifications" config={config} />
                  </FormItem>
                </TabPane>
              </Tabs>
            </TabPane> */}
          </Tabs>
          {/* <Modal
            visible={visibleGalleryForm}
            title={formatMessage({ id: 'product.gallery' })}
            centered={true}
            onCancel={handleCancelGallery}
            width={608}
            footer={false}
          >
            <GalleryForm handleCancelGallery={handleCancelGallery} />
          </Modal> */}
          <Modal
            maskClosable={false}
            visible={visibleGalleryForm}
            title={formatMessage({ id: 'product.gallery' })}
            centered={true}
            onCancel={handleCancelGallery}
            width={608}
            footer={false}
          >
            <GalleryForm
              // detailProduct={detailProduct}
              // idProduct={idProduct}
              handleCancelGallery={handleCancelGallery}
            // screenShotFile={screenShotFile}
            />
          </Modal>
        </Form>
      </Spin>
    </>
  )
}


export default connect(
  ({ products, loading, user, category }: ConnectState) => ({
    loading: loading.effects['products/getAllProductsModel'],
    listProducts: products?.listProducts || [],
    total: products.total,
    currentUser: user?.currentUser || {},
    listCategories: category?.listCategory || [],
    listSizes: products?.listSizes || [],
    listColors: products?.listColors || [],
  }),
)(CreateProduct)