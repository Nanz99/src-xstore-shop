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
import { postColor } from '@/services/product.service'
import { SketchPicker } from 'react-color';


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

function CreateColor(props) {
  const { currentUser, handleCancel, listColor } = props
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
  const [selectColor, setSelectColor] = useState('')

  const handleSelectedColor = (color) => {
    setSelectColor(color.hex)
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
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

  // const handleChangeScreenShot = values => {
  //   let tempList = [...values.fileList]
  //   setScreenShot([...tempList])
  // }

  const handleCreateSize = values => {}

  const handleCreateDescription = value => {
    setDescription(value)
  }
  // ====================================================


  const handleCreate = async values => {
    
    let newData = {
      color: selectColor,
      description: values?.description
    }
   
    const res = await postColor(newData)
       if (res?.success) {
      message.success(formatMessage({ id: 'service.createSuccess' }))
      setLoadingForm(false)
      handleCancel()
      // await window.location.reload()
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
          title="sfaas"
          onFinish={handleCreate}
        >

          {/* //Name */}
          <FormItem
          label={formatMessage({ id: 'menu.Properties.Color' })}
          name="color"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'category.reqCategory' }),
            },
          ]}
          >
           <SketchPicker width={300} color={selectColor} onChangeComplete={handleSelectedColor}/>
        </FormItem>
        <FormItem
          label={formatMessage({ id: 'service.description'  })}
          name="description"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'category.reqCategory' }),
            },
          ]}
        >
          <Input style={{width: 320}} type="text" />
        </FormItem>
        </Form>
      </Spin>
    </>
  )
}

export default CreateColor
