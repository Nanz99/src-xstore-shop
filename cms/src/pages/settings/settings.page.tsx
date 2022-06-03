import DynamicFields from '@/components/DynamicFields'
import { ConnectState } from '@/models/connect'
import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Tabs,
  Upload,
  Space,
  Switch
} from 'antd'
import React, { useEffect, useState } from 'react'
import {
  connect,
  Dispatch,
  formatMessage,
  InfoClientItem,
  SettingClientItem,
} from 'umi'
import { beforeUpload, dummyRequest } from '../../utils/upload'
import './settings.less'
const { TabPane } = Tabs
const { Option } = Select

interface ImageItem {
  imageUrl: string
  imageOrigin: any
  loadingImage: boolean
}

interface SettingProps {
  dispatch: Dispatch
  settingClient: SettingClientItem
  infoClient: InfoClientItem
}

const SettingSystem: React.FC<SettingProps> = props => {
  const { dispatch, settingClient, infoClient } = props
  const [form] = Form.useForm()
  const [formInfo] = Form.useForm()
  const FormItem = Form.Item
  const [logoState, setDataLogo] = useState({
    logo: undefined,
    logoOrigin: undefined,
    loadLogo: false,
  })
  const [showButtonDelete, setShowButtonDelete] = useState({})
  const LIMIT_BANNER = 20
  const [numberAvailable, setNumberAvailable] = useState(LIMIT_BANNER)
  const LIMIT_BANNER__PROMOTE = 20
  const [numberAvailablePromote, setNumberAvailablePromote] = useState(LIMIT_BANNER__PROMOTE)

  const LIMIT_FOOTER_IMAGES = 20
  const [
    numberAvailable_FooterImages,
    setNumberAvailable_FooterImages,
  ] = useState(LIMIT_FOOTER_IMAGES)

  const [listImageFooterImages, setListFooterImages] = useState([])
  const [listImage, setListImage] = useState([])
  const [previewImage, setPreviewImage] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')

  const optionsNetwork = [
    {
      id: 1,
      value: 'FACEBOOK',
      label: 'FACEBOOK',
    },
    {
      id: 2,
      value: 'ZALO',
      label: 'ZALO',
    },
    // {
    //   id: 3,
    //   value: 'TWITTER',
    //   label: 'TWITTER',
    // },
    {
      id: 4,
      value: 'LINKEDIN',
      label: 'LINKEDIN',
    },
    // {
    //   id: 5,
    //   value: 'TELEGRAM',
    //   label: 'TELEGRAM',
    // },
  ]

  const fetch = async () => {
    dispatch({ type: 'settingClient/getInfoClient' })
  }

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (settingClient) {
      form.setFieldsValue({ ...settingClient })
      // setListImage([...listImage])
      const countBannerAvailable = LIMIT_BANNER - settingClient.banners?.length
      const countBannerAvailablePromote = LIMIT_BANNER__PROMOTE - settingClient.banners?.length
      const countFooterAvailable =
        LIMIT_FOOTER_IMAGES - settingClient.footers?.length
      setNumberAvailable(countBannerAvailable)
      // setNumberAvailablePromote(countBannerAvailablePromote)
      // setNumberAvailable_FooterImages(countFooterAvailable)
    }
  }, [settingClient])

  useEffect(() => {
    if (infoClient) {
      formInfo.setFieldsValue({ ...infoClient })
    }
  }, [infoClient])

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const beforeUpload1 = (e: any) => {
    const allowTypes = ['image/jpeg', 'image/png']

    if (e.file.status === 'done') {
      if (Array.isArray(e.fileList) && e.fileList.length >= 2) {
        let arr = []
        for (let item of e.fileList) {
          if (allowTypes.includes(item.type) && item.size / 1024 / 1024 < 2) {
            arr.push(item)
          }
        }
        return arr
      } else {
        const isImage = allowTypes.includes(e.file.type)
        const isLessThan2M = e.file.size / 1024 / 1024 < 2
        if (!isImage) {
          message.error(formatMessage({ id: 'setting.wrongFormat' }))
          return []
        } else if (!isLessThan2M) {
          message.error(formatMessage({ id: 'setting.wrongSize' }))
          return []
        }
      }
    }
    return e && e.fileList
  }


  const uploadButtonLogo = (
    <div>
      {logoState.loadLogo ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">
        {formatMessage({ id: 'common.upload' })}
      </div>
    </div>
  )

  const uploadButtonFooterImages = (
    <div>
      <div className="ant-upload-text">
        {formatMessage({ id: 'common.upload' })}
      </div>
    </div>
  )

  const selectNetwork = defaultValue => (
    <Select disabled defaultValue={defaultValue} className="select-network">
      {optionsNetwork.map(item => (
        <Option key={item.id} value={item.value}>
          {item.label}
        </Option>
      ))}
    </Select>
  )

  const SocialNetworkSelect = <Select options={optionsNetwork} />

  const handleChangeLogo = info => {
    if (info.file.status === 'uploading') {
      setDataLogo({
        ...logoState,
        loadLogo: true,
      })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        setDataLogo({
          logo: imageUrl,
          logoOrigin: info.file.originFileObj,
          loadLogo: false,
        }),
      )
    }
  }

  const handleDeleteSocial = idSocial => {
    const result = dispatch({
      type: 'settingClient/deleteSocial',
      payload: idSocial,
    })
  }

  const handleDeleteFooterImages = idFooterImage => {
    const result = dispatch({
      type: 'settingClient/deleteFooterImage',
      payload: idFooterImage,
    })
  }

  const handleDeleteBanner = async idBanner => {
    const result = dispatch({
      type: 'settingClient/deleteBanner',
      payload: idBanner,
    })
  }

  //------------------------------------------- Form tab general ------------------------------

  const onFinishGeneral = async (values: any) => {
    const getSocial = []
    if (settingClient?.socials) {
      settingClient.socials.forEach(item => {
        const social = { social_type: item.type, social_url: item.socialURL }
        getSocial.push(social)
      })
    }
    let arrSocial = getSocial
    if (values.social) {
      const social = [...values.social]
      arrSocial = getSocial?.concat(social)
    }


    // let referral;
    // if (values.referral === "OFF" || values.referral === false) {
    //   referral = "OFF"
    // } else {
    //   referral = "ON"

    // }

    // let odoo;
    // if (values.odoo === "OFF" || values.odoo === false) {
    //   odoo = "OFF"
    // } else {
    //   odoo = "ON"
    // }
    const tempYouTubeArray = values.youtubeConfigs?.map(item => ({
      topic: item.topic,
      content: 'empty',
      link: item.link,
    }))
    
    const newValue = {
      ...values,
      concept: 'empty',
      // slogan : 'TESTING',
      // banner_top: [],
      banner_center: values.banner_center,
      odoo: "OFF",
      referral: "OFF",
      social: arrSocial,
      logo: logoState.logoOrigin,
      // footerImages: [],
      youtubeConfig: tempYouTubeArray
    }

    // const idSetting = settingClient.id

    const result = await dispatch({
      type: 'settingClient/updateSettingClient',
      payload: newValue,
    })
    form.resetFields(['social', 'banner_top', 'banner_center', 'footerImages'])

  }

  //------------------------------------------- Form tab information ------------------------------
  const onFinishInfoClient = async values => {
    const newValue = {
      ...values,
      bank_account: values?.bankAccount,
      status: 'ON'
    }

    const result = dispatch({
      type: 'settingClient/updateInfoClient',
      payload: newValue,
    })
  }

  const handleResetFormInfo = () => {
    formInfo.resetFields()
  }

  {
    /*--------------------------------------------- Prevew image-------------------------------------*/
  }
  //onst handleCancel = () => setPreviewVisible(false)
  //
  // function getBase64_1(file) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader()
  //     reader.readAsDataURL(file)
  //     reader.onload = () => resolve(reader.result)
  //     reader.onerror = error => reject(error)
  //   })
  // }
  //
  // const handlePreview = async file => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64_1(file.originFileObj)
  //     setPreviewImage(file.url || file.preview)
  //     setPreviewVisible(true)
  //     setPreviewTitle(
  //       file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
  //     )
  //   }
  // }

  {
    /*****************************************************************************************************************/
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Tabs defaultValue="1">
          {/************************* General ************************* */}
          <TabPane tab={formatMessage({ id: 'setting.tabGeneral' })} key="1">
            <Form form={form} onFinish={onFinishGeneral} colon={false}>
              {/* <Row style={{ marginBottom: 10 }} >
                <FormItem
                  name="referral"
                >
                  <Switch defaultChecked={settingClient?.referral === "ON"} checkedChildren={formatMessage({ id: 'setting.referralOff' })} unCheckedChildren={formatMessage({ id: 'setting.referralOn' })} style={{ marginRight: 20 }} />
                </FormItem>
                <FormItem
                  name="odoo"
                >
                  <Switch defaultChecked={settingClient?.odoo === "ON"} checkedChildren={formatMessage({ id: 'setting.crmOff' })} unCheckedChildren={formatMessage({ id: 'setting.crmOn' })} />
                </FormItem>
              </Row> */}
              <Row gutter={[16, 16]}>
                {/***************************** Concept & Website name & Slogan ******************* */}
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <Row>
                    {/********** Website name  ************ */}
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={{ span: 24 }}
                      xl={{ span: 24 }}
                      xxl={{ span: 24 }}
                    >
                      <p style={{ fontWeight: 'bold' }}>
                        {formatMessage({ id: 'setting.website_name' })}
                        <span style={{ color: 'red' }}>*</span>
                      </p>
                      <FormItem
                        name="website_name"
                        rules={[
                          {
                            required: true,
                            message: formatMessage({
                              id: 'common.missingRequireFields',
                            }),
                          },
                        ]}
                      >
                        <Input />
                      </FormItem>
                    </Col>

                    {/********** Slogan  ************ */}
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={{ span: 24 }}
                      xl={{ span: 24 }}
                      xxl={{ span: 24 }}
                    >
                      <p style={{ fontWeight: 'bold' }}>
                        {formatMessage({ id: 'setting.slogan' })}
                        <span style={{ color: 'red' }}>*</span>
                      </p>
                      <FormItem
                        name="slogan"
                        rules={[
                          {
                            required: true,
                            message: formatMessage({
                              id: 'common.missingRequireFields',
                            }),
                          },
                        ]}
                      >
                        <Input />
                      </FormItem>
                    </Col>
                    {/********** Company  ************ */}
                    {/* <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={{ span: 24 }}
                      xl={{ span: 24 }}
                      xxl={{ span: 24 }}
                    >
                      <p style={{ fontWeight: 'bold' }}>
                        {formatMessage({ id: 'setting.companyName' })}
                      </p>
                      <FormItem
                        name="company_name"
                        rules={[
                          {
                            required: true,
                            message: formatMessage({
                              id: 'common.missingRequireFields',
                            }),
                          },
                        ]}
                      >
                        <Input />
                      </FormItem>
                    </Col> */}
                  </Row>
                </Col>

                {/***************************** Logo ******************* */}
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <Card
                    title={
                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                        {formatMessage({ id: 'setting.logo' })}
                        <span style={{ color: 'red' }}>*</span>
                      </p>
                    }
                  >
                    <Upload
                      name="logo"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={beforeUpload}
                      onChange={handleChangeLogo}
                      customRequest={dummyRequest}
                    >
                      {logoState.logo !== undefined ? (
                        <div style={{ width: '100px' }}>
                          <img
                            src={logoState.logo}
                            alt="Logo"
                            style={{ width: '100%' }}
                          />
                        </div>
                      ) : settingClient && settingClient?.logo ? (
                        <div style={{ width: '100px' }}>
                          <img
                            style={{ width: '100%' }}
                            src={settingClient?.logo}
                          />
                        </div>
                      ) : (
                        uploadButtonLogo
                      )}
                      {/* {logoState.logo !== undefined ? (
                        <div style={{ width: '100px' }}>
                          <img
                            src={logoState.logo}
                            alt="Logo"
                            style={{ width: '100%' }}
                          />
                        </div>
                      ) : (
                        uploadButtonLogo
                      )} */}
                    </Upload>
                  </Card>
                </Col>
              </Row>

              {/***************************** Social ******************* */}
              <Row style={{ marginTop: 24 }}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 24 }}
                  xxl={{ span: 24 }}
                >
                  <Card
                    title={
                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                        {formatMessage({ id: 'setting.social_network' })}
                        {/* <span style={{ color: 'red' }}>*</span> */}
                      </p>
                    }
                  >
                    {settingClient &&
                      settingClient.socials &&
                      settingClient.socials.map(item => (
                        <Row key={item.id} style={{ marginBottom: 16 }}>
                          <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                            lg={{ span: 24 }}
                            xl={{ span: 24 }}
                            xxl={{ span: 24 }}
                          >
                            <div
                            // style={{ width: '100%', display: 'flex' }}
                            >
                              <Input
                                className="social-network-input"
                                readOnly
                                defaultValue={item.socialURL}
                                addonBefore={selectNetwork(
                                  item.type.toUpperCase(),
                                )}
                                addonAfter={
                                  <Button
                                    style={{ color: 'black' }}
                                    ghost={true}
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                      handleDeleteSocial(item.id)
                                    }}
                                  />
                                }
                              />
                            </div>
                          </Col>
                        </Row>
                      ))}
                    {/********************************** Add field social *******************************/}
                    <Form.List name="social">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(
                            ({ key, name, fieldKey, ...restField }) => (
                              <div key={key} className="space-social">
                                <Form.Item
                                  {...restField}
                                  // style={{width: '100%'}}
                                  className="space-social-item"
                                  name={[name, 'social_url']}
                                  fieldKey={[fieldKey, `${name}first`]}
                                  rules={[
                                    {
                                      required: true,
                                      message: formatMessage({
                                        id: 'common.missingRequireFields',
                                      }),
                                    },
                                    {
                                      type: 'url',
                                      message: formatMessage({
                                        id: 'common.typeUrl',
                                      }),
                                    },
                                  ]}
                                >
                                  <Input
                                    className="social-network-input"
                                    addonBefore={
                                      <Form.Item
                                        name={[name, 'social_type']}
                                        noStyle
                                        initialValue="FACEBOOK"
                                      >
                                        {SocialNetworkSelect}
                                      </Form.Item>
                                    }
                                  />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              </div>
                            ),
                          )}
                          <Form.Item>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Button
                                style={{ width: '50%' }}
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                {formatMessage({ id: 'setting.add_field' })}
                              </Button>
                            </div>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Card>
                </Col>
              </Row>

              {/***************************** Footer Images ******************* */}
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {/********** Footer Images - hiện có  ************ */}
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <Card
                    title={
                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                        {formatMessage({ id: 'setting.footer_images_active' })}
                      </p>
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      {settingClient &&
                        settingClient.footers &&
                        settingClient.footers.map((item, index) => {
                          return (
                            <div
                              key={index}
                              onMouseEnter={() => {
                                setShowButtonDelete({
                                  id: 'footerImages' + index,
                                  status: true,
                                })
                              }}
                              onMouseLeave={() => {
                                setShowButtonDelete({
                                  id: index,
                                  status: false,
                                })
                              }}
                              style={{
                                border: '1px dashed #d9d9d9',
                                backgroundColor: '#fafafa',
                                width: '104px',
                                height: '104px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 10,
                                padding: 8,
                                textAlign: 'center',
                                verticalAlign: 'top',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                transition: 'border-color 0.3s',
                                position: 'relative',
                              }}
                            >
                              <img
                                src={item.footerUrl}
                                alt="Logo"
                                style={{ width: '100%' }}
                              />
                              <Button
                                icon={<DeleteOutlined />}
                                // onClick={handleDeleteFooterImages}
                                onClick={() => {
                                  handleDeleteFooterImages(item.id)
                                }}
                                style={
                                  showButtonDelete.status === true &&
                                    showButtonDelete.id === 'footerImages' + index
                                    ? { position: 'absolute' }
                                    : { display: 'none' }
                                }
                              ></Button>
                            </div>
                          )
                        })}
                    </div>
                  </Card>
                </Col>
                {/********** Cập nhật Footer Images (Add images )  ************ */}
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <Card
                    title={
                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                        {`${formatMessage({
                          id: 'setting.add_footer_images',
                        })}`}
                        <span style={{ color: 'red' }}>*</span>
                      </p>
                    }
                  >
                    <FormItem
                      name="footerImages"
                      valuePropName="fileList"
                      getValueFromEvent={beforeUpload1}
                      className="banner"
                    >
                      <Upload
                        listType="picture-card"
                        // fileList={listImageFooterImages}
                        // onPreview={handlePreview}
                        maxCount={numberAvailable_FooterImages}
                        customRequest={dummyRequest}
                        multiple
                      >
                        {listImageFooterImages.length >=
                          numberAvailable_FooterImages
                          ? null
                          : listImageFooterImages.length >=
                            numberAvailable_FooterImages
                            ? null
                            : uploadButtonFooterImages}
                        {/* {uploadButtonFooterImages} */}
                      </Upload>
                      {/* <Modal
                        visible={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                      >
                        <img
                          alt="example"
                          style={{ width: '100%' }}
                          src={previewImage}
                        />
                      </Modal> */}
                    </FormItem>
                  </Card>
                </Col>
              </Row>

              {/***************************** Banner ******************* */}
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {/********** Banner - hiện có  ************ */}
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <Card
                    title={
                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                        {formatMessage({ id: 'setting.banners_active' })}
                      </p>
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      {settingClient &&
                        settingClient.banners &&
                        settingClient.banners?.filter(item => item.position === 'top')?.map((item, index) => {
                          return (
                            <div
                              key={index}
                              onMouseEnter={() => {
                                setShowButtonDelete({
                                  id: 'banner' + index,
                                  status: true,
                                })
                              }}
                              onMouseLeave={() => {
                                setShowButtonDelete({
                                  id: index,
                                  status: false,
                                })
                              }}
                              style={{
                                border: '1px dashed #d9d9d9',
                                backgroundColor: '#fafafa',
                                width: '104px',
                                height: '104px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 10,
                                padding: 8,
                                textAlign: 'center',
                                verticalAlign: 'top',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                transition: 'border-color 0.3s',
                                position: 'relative',
                              }}
                            >
                              <img
                                src={item.bannerUrl}
                                alt="Logo"
                                style={{ width: '100%' }}
                              />
                              <Button
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                  handleDeleteBanner(item.id)
                                }}
                                style={
                                  showButtonDelete.status === true &&
                                    showButtonDelete.id === 'banner' + index
                                    ? { position: 'absolute' }
                                    : { display: 'none' }
                                }
                              ></Button>
                            </div>
                          )
                        })}
                    </div>
                  </Card>
                </Col>
                {/********** Cập nhật Banner (Add images )  ************ */}
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <Card
                    title={
                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                        {`${formatMessage({
                          id: 'setting.add_banners',
                        })}`}
                        <span style={{ fontWeight: 'bold', color: 'red' }}>
                          *
                        </span>
                      </p>
                    }
                  >
                    <FormItem
                      name="banner_top"
                      valuePropName="fileList"
                      getValueFromEvent={beforeUpload1}
                      className="banner"
                    >
                      <Upload
                        listType="picture-card"
                        // fileList={listImageFooterImages}
                        // onPreview={handlePreview}
                        maxCount={numberAvailable}
                        customRequest={dummyRequest}
                      // multiple
                      >
                        {listImage.length >= numberAvailable
                          ? null
                          : listImage.length >= numberAvailable
                            ? null
                            : uploadButtonFooterImages}
                      </Upload>
                      {/* <Modal
                        visible={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                      >
                        <img
                          alt="example"
                          style={{ width: '100%' }}
                          src={previewImage}
                        />
                      </Modal> */}
                    </FormItem>
                  </Card>
                </Col>
              </Row>



              {/****************************  Banner Khuyen Mai  - BANNER CENTER***************************/}
              {/* <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <Card
                    title={
                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                        Banner Khuyến mãi - 2 image
                      </p>
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      {settingClient &&
                        settingClient.banners &&
                        settingClient.banners?.filter(item => item.position === 'center')?.slice(0, 2)?.map((item, index) => {
                          return (
                            <div
                              key={index}
                              onMouseEnter={() => {
                                setShowButtonDelete({
                                  id: 'banner' + index,
                                  status: true,
                                })
                              }}
                              onMouseLeave={() => {
                                setShowButtonDelete({
                                  id: index,
                                  status: false,
                                })
                              }}
                              style={{
                                border: '1px dashed #d9d9d9',
                                backgroundColor: '#fafafa',
                                width: '104px',
                                height: '104px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 10,
                                padding: 8,
                                textAlign: 'center',
                                verticalAlign: 'top',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                transition: 'border-color 0.3s',
                                position: 'relative',
                              }}
                            >
                              <img
                                src={item.bannerUrl}
                                alt="Logo"
                                style={{ width: '100%' }}
                              />
                              <Button
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                  handleDeleteBanner(item.id)
                                }}
                                style={
                                  showButtonDelete.status === true &&
                                    showButtonDelete.id === 'banner' + index
                                    ? { position: 'absolute' }
                                    : { display: 'none' }
                                }
                              ></Button>
                            </div>
                          )
                        })}
                    </div>
                  </Card>
                </Col>
              
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <Card
                    title={
                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                        {`${formatMessage({
                          id: 'setting.add_banners',
                        })}`}
                        <span style={{ fontWeight: 'bold', color: 'red' }}>
                          *
                        </span>
                      </p>
                    }
                  >
                    <FormItem
                      name="banner_center"
                      valuePropName="fileList"
                      getValueFromEvent={beforeUpload1}
                      className="banner"
                    >
                      <Upload
                        listType="picture-card"
                        // fileList={listImageFooterImages}
                        // onPreview={handlePreview}
                        maxCount={numberAvailablePromote}
                        customRequest={dummyRequest}
                        multiple
                      >
                        {listImage.length >= numberAvailablePromote
                          ? null
                          : listImage.length >= numberAvailablePromote
                            ? null
                            : uploadButtonFooterImages}
                      </Upload>
              
                    </FormItem>
                  </Card>
                </Col>
              </Row> */}



              {/* **************VIDEO LIST******************** */}
              {/* <Row style={{ marginTop: 24 }}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 24 }}
                  xxl={{ span: 24 }}
                >
                  <Card
                    title={
                      <p style={{ fontWeight: 'bold', margin: 0 }}>
                        Video Youtube
                      </p>
                    }
                  >
                    <Form.List name="youtubeConfigs">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(
                            ({ key, name, fieldKey, ...restField }) => (
                              <div key={key} className="space-social">
                                <Form.Item
                                  {...restField}
                                  // style={{width: '100%'}}
                                  className="space-social-item"
                                  name={[name, 'topic']}
                                  fieldKey={[fieldKey, 'topic']}
                                  rules={[
                                    {
                                      required: true,
                                      message: formatMessage({
                                        id: 'common.missingRequireFields',
                                      }),
                                    },
                                    // {
                                    //   type: 'url',
                                    //   message: formatMessage({
                                    //     id: 'common.typeUrl',
                                    //   }),
                                    // },
                                  ]}
                                >
                                  <Input
                                    className="social-network-input"
                                    placeholder='Tiêu đề'
                                    type="text"
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  className="space-social-item"
                                  name={[name, 'link']}
                                  fieldKey={[fieldKey, 'link']}
                                  rules={[
                                    {
                                      required: true,
                                      message: formatMessage({
                                        id: 'common.missingRequireFields',
                                      }),
                                    },
                                    {
                                      type: 'url',
                                      message: formatMessage({
                                        id: 'common.typeUrl',
                                      }),
                                    },
                                  ]}
                                >
                                  <Input
                                    className="social-network-input"
                                    type="text"
                                    placeholder="Link Video Youtube"
                                  />
                                </Form.Item>
                                <MinusCircleOutlined
                                  style={{ fontSize: '22px' }}
                                  onClick={() => remove(name)}
                                />
                              </div>
                            ),
                          )}
                          <Form.Item>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Button
                                style={{ width: '50%' }}
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Thêm
                              </Button>
                            </div>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Card>
                </Col>
              </Row> */}
              {/***************************** Action ******************* */}
              <Row justify="end" style={{ marginTop: 16 }}>
                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 8 }}
                  md={{ span: 8 }}
                  lg={{ span: 6 }}
                  xl={{ span: 4 }}
                  xxl={{ span: 4 }}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Button type="primary" htmlType="submit">
                    {formatMessage({ id: 'common.edit' })}
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>

          {/************************* Information ************************* */}
          <TabPane tab={formatMessage({ id: 'setting.tabInfomation' })} key="2">
            <Form onFinish={onFinishInfoClient} form={formInfo} colon={false}>
              <Row gutter={[16, 16]}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <p>
                    {formatMessage({ id: 'setting.email' })}
                    <span style={{ color: 'red' }}>*</span>
                  </p>
                  <FormItem
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'common.missingRequireFields',
                        }),
                      },
                      {
                        type: 'email',
                        message: formatMessage({ id: 'common.typeEmail' }),
                      },
                    ]}
                  >
                    <Input />
                  </FormItem>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <p>
                    {formatMessage({ id: 'setting.phone' })}{' '}
                    <span style={{ color: 'red' }}>*</span>
                  </p>
                  <FormItem
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'common.missingRequireFields',
                        }),
                      },
                    ]}
                  >
                    <Input />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 12 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <p>
                    {formatMessage({ id: 'setting.address' })}
                    <span style={{ color: 'red' }}>*</span>
                  </p>
                  <FormItem
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'setting.missingRequireFields',
                        }),
                      },
                    ]}
                  >
                    <Input />
                  </FormItem>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <p>
                    {formatMessage({ id: 'setting.working_time' })}
                    <span style={{ color: 'red' }}>*</span>
                  </p>
                  <FormItem
                    name="workingTime"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'common.missingRequireFields',
                        }),
                      },
                    ]}
                  >
                    <Input />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 12 }}
                  xl={{ span: 12 }}
                  xxl={{ span: 12 }}
                >
                  <p>
                    {formatMessage({ id: 'setting.bankAccount' })}
                    <span style={{ color: 'red' }}>*</span>
                  </p>
                  <FormItem
                    name="bankAccount"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'setting.missingRequireFields',
                        }),
                      },
                    ]}
                  >
                    <Input />
                  </FormItem>
                </Col>
               
              </Row>
              <Row justify="end" style={{ marginTop: 16 }}>
                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 8 }}
                  md={{ span: 8 }}
                  lg={{ span: 6 }}
                  xl={{ span: 4 }}
                  xxl={{ span: 4 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {/* <Button
                    style={{ marginRight: 20 }}
                    onClick={handleResetFormInfo}
                    danger
                  >
                    {formatMessage({ id: 'common.reset' })}
                  </Button> */}
                  <Button type="primary" htmlType="submit">
                    {formatMessage({ id: 'common.edit' })}
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(({ settingClient }: ConnectState) => ({
  settingClient: settingClient.setting || {},
  infoClient: settingClient.infoClient || {},
}))(SettingSystem)
