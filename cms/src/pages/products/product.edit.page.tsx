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
  BgColorsOutlined,
  CloseCircleOutlined,
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
import { getLocale, history, useIntl, useLocation, connect} from 'umi'
import './product.css'
import GalleryForm from './product.gallery.page'
import { v4 as uuidv4 } from 'uuid'
import numeral from 'numeral'
import uniqid from 'uniqid'
import { ConnectState } from '@/models/connect';
//==================================================================

const { TabPane } = Tabs
const { Title, Paragraph, Text } = Typography

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
const EditProduct = props => {
  const {
    dispatch,
    detailProduct,
    idProduct,
    handleCancel,
    listCategory,
    imageFile,
    screenShotFile,
    listColors,
    listSizes,
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
      const { pathname } = useLocation()
      const [params, setParams] = useState(new Params())
  console.log(
    '🚀 ~ file: Edit.page.tsx ~ line 100 ~ detailProduct',
    detailProduct,
  )

  
  const fetchProperty = () => {
    dispatch({ type: 'products/getAllSize', payload: params })
    dispatch({ type: 'products/getAllColor', payload: params })
  }

  useMemo(() => {
    fetchProperty()
  }, [params, pathname])

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
    delete newData.category
    if (locale === 'en-US') {
      newData.categories = detailProduct.category
        ? detailProduct.category.id
        : ''
    } else {
      newData.categories = detailProduct.category
        ? detailProduct.category.id
        : ''
    }
    if (!detailProduct.salePrice) {
      newData.salePrice = 0
    } else {
      newData.salePrice = detailProduct.salePrice
    }
    const saleTag = { number: detailProduct.saleTag.number, currency: '%' }
    newData.saleTag = saleTag
    form.setFieldsValue({ ...newData })
    setScreenShot(detailProduct.screenshots)
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
    // edit info product start

    let tempProperties = res.propertiesProduct?.map((value, index) => ({
      id: value.id ,
      colorId: value.colorId,
      sizeId: value.sizeId,
      purchasePrice: null,
      dealerPrice: null,
      retailPrice: null,
      SKU: uniqid(),
      weight: value.weight,
    }))
    let tempInfomation = detailProduct.infomations?.map((value, index) => ({
      id: value.id,
      colorId: value?.color?.id,
      sizeId: value?.size?.id,
      purchasePrice: null,
      dealerPrice: null,
      retailPrice: null,
      SKU: uniqid(),
      weight: value?.weight,
    }))


    if (!imageProduct.imageData) {
      newData = {
        ...res,
        name: res?.name,
        isUpdateImage: false,
        providerName: res?.providerName || 'empty',
        categorieId: res?.categories,
        vnIntroduction: res.vnIntroduction || 'empty',
        introduction: res.introduction || 'empty',
        vnDescription: res.vnDescription || 'empty',
        description: res.description || 'empty',
        vnSpecifications: res.vnSpecifications || 'empty',
        specifications: res.specifications || 'empty',
        type: 'consumer',
        price: Number(res.price) || 0,
        dealerPrice: Number(res.dealerPrice) || 0,
        propertiesProduct:
          tempProperties && tempProperties.length > 0
            ? tempProperties
            : tempInfomation,
      }
    } else {
      newData = {
        ...res,
        name: res?.name,
        isUpdateImage: true,
        providerName: res?.providerName || 'empty',
        categorieId: res?.categories,
        vnIntroduction: res.vnIntroduction || 'empty',
        introduction: res.introduction || 'empty',
        vnDescription: res.vnDescription || 'empty',
        description: res.description || 'empty',
        vnSpecifications:'empty',
        specifications:'empty',
        image: imageProduct.imageData,
        type: 'consumer',
        price: Number(res.price) || 0,
        dealerPrice: Number(res.dealerPrice) || 0,
        propertiesProduct:
          tempProperties && tempProperties.length > 0
            ? tempProperties
            : tempInfomation,
      }
    }

    const { success } = await editProductService(idProduct, newData)
    //edit sale start

    if (res.saleTag) {
      let sales = {}
      let tempIsSale = {}
      if (res.saleTag.currency === 'percent' || res.saleTag.currency === '%') {
        if (res.saleTag.number >= 0 && res.saleTag.number <= 100) {
          sales = {
            productId: Number(idProduct),
            type: SALE_TYPE.PERCENT,
            saleByPercent: res.saleTag.number || 0,
            saleByPrice: 0,
            description: res.descriptionPrice || '',
          }
          if (res.saleTag.number === 0) {
            tempIsSale = {
              isSale: false,
            }
            await editIsSale(idProduct, tempIsSale)
          } else {
            tempIsSale = {
              isSale: true,
            }
            await editIsSale(idProduct, tempIsSale)
          }
        } else {
          message.warning(formatMessage({ id: 'product.overloadSaleoff' }))
        }
      } else {
        if (res.saleTag.number >= 0 && res.saleTag.number <= 500000) {
          sales = {
            productId: Number(idProduct),
            type: SALE_TYPE.NUMBER,
            // type: res.saleTag.currency,
            saleByPercent: 0,
            saleByPrice: res.saleTag.number || 0,
            description: res.descriptionPrice || '',
          }
          if (res.saleTag.number === 0) {
            tempIsSale = {
              isSale: false,
            }
            await editIsSale(idProduct, tempIsSale)
          } else {
            tempIsSale = {
              isSale: true,
            }
            await editIsSale(idProduct, tempIsSale)
          }
        } else {
          message.warning(formatMessage({ id: 'product.overloadSaleoff' }))
        }
      }
      await createSale(sales)
    }

    // edit screenshot start
    if (success) {
      const tempArray = [...screenShot]
      const editedScreenShotArray = tempArray.filter(item => !!item.thumbUrl)
      for (var i = 0; i < editedScreenShotArray.length; i++) {
        const newScreenShot = {
          name: editedScreenShotArray[i].originFileObj.name,
          order: 0,
          image: editedScreenShotArray[i].originFileObj,
        }
        const result = await createProductScreenShotService(
          idProduct,
          newScreenShot,
        )
        if (result) {
          notification.success({
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            message: formatMessage({ id: 'product.addScreenShotSuccess' }),
          })
        } else {
          notification.warning({
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
            message: formatMessage({ id: 'product.addScreenShotFailed' }),
          })
        }
        if (i == editedScreenShotArray.length) {
          await handleCancel()
        }
      }
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'product.editSucess' }),
      })
    } else {
      notification.warning({
        icon: <CloseCircleOutlined  style={{ color: 'red' }} />,
        message: formatMessage({ id: 'product.editFailed' }),
      })
    }
    setLoadingForm(false)
    history.go(`/product/${idProduct}`)
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
        const { success } = await deleteScreenShotService(file.uid)
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
                  {/* SKU */}

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
                      {!listCategory
                        ? ''
                        : listCategory.map(values => (
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
                  {/* Image */}
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
            {/*Color weight Size */}
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
                                  style={{ width: '350px' }}
                                  label={formatMessage({
                                    id: 'product.selectSize',
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
                                  style={{ width: '350px' }}
                                  label={formatMessage({
                                    id: 'product.selectColor',
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
                                       <div style={{display: 'flex', alignItems: 'center'}}>
                                          {formatMessage({ id: 'product.colorName' })}
                                        <span style={{ height: '20px', width: '20px', display: 'inline-block', backgroundColor: `${item?.color}`, borderRadius: '4px', border: '1px solid #dedede', marginLeft: '8px' }}></span>
                                       </div>

                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                {/* Weight */}
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
            {/* giam gia */}
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
                  {/* Sale Price */}
                  {/* <FormItem
                    style={{ width: '100%' }}
                    label={formatMessage({ id: 'product.salePrice' })}
                    name="salePrice"
                  >
                    <InputNumber
                      disabled={true}
                      min={0}
                      style={{ width: '96%' }}
                      formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </FormItem> */}

                  {/* Sale Tag */}
                  <FormItem
                    style={{ width: '99%' }}
                    label={formatMessage({ id: 'product.saleTag' })}
                    name="saleTag"
                  >
                    <PriceInput />
                  </FormItem>
                  {/* Price Description */}
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
            {/* upload hinh anh */}
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
            {/* Gioi thieu */}
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
                  <Button type="primary" ghost onClick={handleShowAddForm}>
                    {formatMessage({ id: 'product.gallery' })}&nbsp;
                    <Tooltip
                      title={formatMessage({ id: 'product.galleryTooltip' })}
                    >
                      <QuestionCircleOutlined style={{ fontSize: '14px' }} />{' '}
                    </Tooltip>
                  </Button>
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
                    <JoditEditor config={config} />
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
                    <JoditEditor config={config} />
                  </FormItem>
                </TabPane>
              </Tabs>
            </TabPane>
            {/* Mo ta */}
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
                  <Button type="primary" ghost onClick={handleShowAddForm}>
                    {formatMessage({ id: 'product.gallery' })}&nbsp;
                    <Tooltip
                      title={formatMessage({ id: 'product.galleryTooltip' })}
                    >
                      <QuestionCircleOutlined style={{ fontSize: '14px' }} />{' '}
                    </Tooltip>
                  </Button>
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
                    <JoditEditor config={config} />
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
                    <JoditEditor config={config} />
                  </FormItem>
                </TabPane>
              </Tabs>
            </TabPane>
            {/* Thong so ki thuat */}
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
                  <Button type="primary" ghost onClick={handleShowAddForm}>
                    {formatMessage({ id: 'product.gallery' })}&nbsp;
                    <Tooltip
                      title={formatMessage({ id: 'product.galleryTooltip' })}
                    >
                      <QuestionCircleOutlined style={{ fontSize: '14px' }} />{' '}
                    </Tooltip>
                  </Button>
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
              detailProduct={detailProduct}
              idProduct={idProduct}
              handleCancelGallery={handleCancelGallery}
              screenShotFile={screenShotFile}
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
)(EditProduct)